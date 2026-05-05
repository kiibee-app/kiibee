import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { users, usersToken } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { and, eq } from 'drizzle-orm';
import { Time } from 'src/utils/constant';
import { randomBytes, randomUUID } from 'crypto';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';

export const forgetPasswordService = async (
  email: string,
  frontendBaseUrl: string,
) => {
  try {
    if (!email) {
      return fail('Email is required', HttpStatus.BAD_REQUEST);
    }

    const user = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), eq(users.isDeleted, false)))
      .limit(1);

    if (!user || user.length === 0) {
      return fail('No user found with this email', HttpStatus.NOT_FOUND);
    }

    const token = randomBytes(32).toString('hex');

    await db.insert(usersToken).values({
      id: randomUUID(),
      userId: user[0].id,
      token,
      type: 'reset_password',
      expiresAt: new Date(Date.now() + Time.FIFTEEN_MINUTES),
    });
    const resetLink = `${frontendBaseUrl}/auth/forget-password?token=${token}`;

    runInBackground(
      sendTemplateEmail({
        to: user[0].email,
        subject: mailSubject.RESET_PASSWORD,
        templateName: templateName.RESET_PASSWORD,
        variables: {
          name: user[0].firstName,
          resetLink,
        },
      }),
    );
    return success(
      null,
      'Password reset link sent successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error in forgetPasswordService:', error);

    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to process forget password request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
