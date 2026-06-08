import { HttpException, HttpStatus } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from 'src/database/db';
import { creatorInfo } from 'src/database/schema/creator/creatorInfo.schema';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { users } from 'src/database/schema/users/users.schema';
import { success } from 'src/utils/sendResponse';
import { ROLE, STATUS, Time } from 'src/utils/constant';
import { usersToken } from 'src/database/schema/users/usersToken.schema';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { logger } from 'src/logger/logger';

function isPostgresUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const err = error as { code?: string; cause?: unknown };
  if (err.code === '23505') {
    return true;
  }
  const cause = err.cause;
  if (cause && typeof cause === 'object' && 'code' in cause) {
    return (cause as { code: string }).code === '23505';
  }
  return false;
}

export const approveCreatorRequestService = async (
  requestId: string,
  approverUserId: string,
  frontendBaseUrl: string,
) => {
  try {
    if (!requestId || !approverUserId) {
      throw new HttpException(
        'Request ID and approver User ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const validatedRequest = await db
      .select()
      .from(creatorApplicationRequests)
      .where(
        and(
          eq(creatorApplicationRequests.id, requestId),
          eq(creatorApplicationRequests.isDeleted, false),
        ),
      )
      .limit(1);

    if (!validatedRequest || validatedRequest.length === 0) {
      throw new HttpException(
        'Creator request not found or already processed',
        HttpStatus.NOT_FOUND,
      );
    }

    const applicationEmail = validatedRequest[0].email.trim().toLowerCase();

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, applicationEmail), eq(users.isDeleted, false)))
      .limit(1);

    if (existingUser) {
      throw new HttpException(
        'A user account with this email already exists. Remove or merge the existing account before approving this creator request.',
        HttpStatus.CONFLICT,
      );
    }

    const userData = {
      id: randomUUID(),
      firstName: validatedRequest[0].firstName,
      lastName: validatedRequest[0].lastName,
      fullName: validatedRequest[0].fullName,
      email: applicationEmail,
      role: ROLE.CREATOR,
      status: STATUS.PENDING_SETUP,
      isEmailVerified: false,
    };
    const creatorData = {
      id: randomUUID(),
      userId: userData.id,
      phone: validatedRequest[0].phone,
      cvr: validatedRequest[0].cvr,
      address: validatedRequest[0].address,
      city: validatedRequest[0].city,
      postalCode: validatedRequest[0].postalCode,
      exampleWorkLink: validatedRequest[0].exampleWorkLink,
      contentDescription: validatedRequest[0].contentDescription,
    };

    await db.transaction(async (tx) => {
      await tx.insert(users).values(userData);
      await tx.insert(creatorInfo).values(creatorData);
      await tx
        .update(creatorApplicationRequests)
        .set({
          status: STATUS.APPROVED,
          isDeleted: true,
          approvedUserId: approverUserId,
          updatedAt: new Date(),
        })
        .where(eq(creatorApplicationRequests.id, requestId));
    });
    const token = randomBytes(32).toString('hex');

    await db.insert(usersToken).values({
      id: randomUUID(),
      userId: userData.id,
      token,
      type: 'setup',
      expiresAt: new Date(Date.now() + Time.ONE_DAY),
    });

    const setupLink = `${frontendBaseUrl}/creator-plans?token=${token}`;

    runInBackground(
      sendTemplateEmail({
        to: userData.email,
        subject: mailSubject.APPROVED_CREATOR,
        templateName: templateName.APPROVED_CREATOR,
        variables: {
          name: userData.firstName,
          setupLink,
        },
      }),
    );
    return success(
      null,
      'Creator request approved successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Error approving creator request:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    if (isPostgresUniqueViolation(error)) {
      throw new HttpException(
        'This email is already registered. The creator cannot be approved until that account is resolved.',
        HttpStatus.CONFLICT,
      );
    }
    const detail =
      error instanceof Error ? error.message : JSON.stringify(error);
    logger.error('Approve creator unexpected error detail:', detail);
    throw new HttpException(
      'Failed to approve creator request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
