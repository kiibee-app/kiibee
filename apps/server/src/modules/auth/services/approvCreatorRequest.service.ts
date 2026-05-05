import { HttpException, HttpStatus } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from 'src/database/db';
import { creatorInfo } from 'src/database/schema/creator/creatorInfo.schema';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { users } from 'src/database/schema/users/users.schema';
import { fail, success } from 'src/utils/sendResponse';
import { ROLE, STATUS, Time } from 'src/utils/constant';
import { usersToken } from 'src/database/schema/users/usersToken.schema';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { logger } from 'src/logger/logger';

export const approveCreatorRequestService = async (
  requestId: string,
  approverUserId: string,
) => {
  try {
    if (!requestId || !approverUserId) {
      return fail(
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
      return fail(
        'Creator request not found or already processed',
        HttpStatus.NOT_FOUND,
      );
    }

    const userData = {
      id: randomUUID(),
      firstName: validatedRequest[0].firstName,
      lastName: validatedRequest[0].lastName,
      fullName: validatedRequest[0].fullName,
      email: validatedRequest[0].email,
      role: ROLE.CREATOR,
      status: STATUS.PENDING_SETUP,
      isMailVerified: false,
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

    const setupLink = `${process.env.FRONTEND_URL}/creator/setup?token=${token}`;

    runInBackground(
      sendTemplateEmail({
        to: userData.email,
        subject: mailSubject.APPROVED_CREATOR,
        templateName: templateName.APPROVED_CREATOR,
        variables: {
          name: userData.firstName,
          guidelinesLink: `${process.env.FRONTEND_URL}/creator/guidelines`,
          setupLink,
        },
      }),
    );
    return success(
      null,
      'Creator request approved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error approving creator request:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to approve creator request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
