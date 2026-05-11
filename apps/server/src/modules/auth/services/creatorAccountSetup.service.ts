import { HttpException, HttpStatus } from '@nestjs/common';
import { CreatorAccountSetupDto } from '../dto/creatorAccountSetup.dto';
import { success } from 'src/utils/sendResponse';
import { db } from 'src/database/db';
import { creatorPlans, users, usersToken } from 'src/database/schema';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { ACCOUNT_STATUS } from 'src/utils/constant';
import { hashPassword } from 'src/utils/passwordHash';
import { logger } from 'src/logger/logger';

export const setupCreatorAccountService = async (
  payload: CreatorAccountSetupDto,
) => {
  try {
    const { token, planId, confirmEmail, password, confirmPassword } = payload;

    if (!token || !planId || !confirmEmail || !password || !confirmPassword) {
      throw new HttpException(
        'All fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (password.length < 6) {
      throw new HttpException(
        'Password must be at least 6 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await hashPassword(password);

    let userId: string | null = null;

    await db.transaction(async (tx) => {
      const [tokenData] = await tx
        .select()
        .from(usersToken)
        .where(eq(usersToken.token, token))
        .limit(1);

      if (!tokenData) {
        throw new HttpException(
          'Invalid or expired token',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (tokenData.isUsed) {
        throw new HttpException('Token already used', HttpStatus.BAD_REQUEST);
      }

      const [emailFromToken] = await tx
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, tokenData.userId))
        .limit(1);

      if (!emailFromToken || emailFromToken.email !== confirmEmail) {
        throw new HttpException(
          'Email does not match token',
          HttpStatus.BAD_REQUEST,
        );
      }

      userId = tokenData.userId;

      await tx
        .update(users)
        .set({
          passwordHash,
          status: ACCOUNT_STATUS.ACTIVE,
          isEmailVerified: true,
        })
        .where(eq(users.id, userId));

      await tx.insert(creatorPlans).values({
        id: crypto.randomUUID(),
        planId,
        creatorId: userId,
      });

      await tx
        .update(usersToken)
        .set({ isUsed: true })
        .where(eq(usersToken.token, token));
    });

    const responseData = {
      userId,
      email: confirmEmail,
      planId,
    };

    return success(
      responseData,
      'Creator account setup successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error setting up creator account:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to setup creator account',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
