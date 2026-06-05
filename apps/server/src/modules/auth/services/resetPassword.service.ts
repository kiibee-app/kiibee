import { HttpException, HttpStatus } from '@nestjs/common';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { db } from 'src/database/db';
import { usersToken } from 'src/database/schema/users/usersToken.schema';
import { users } from 'src/database/schema/users/users.schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'src/utils/passwordHash';

export const resetPasswordService = async (payload: ResetPasswordDto) => {
  try {
    const { token, password, confirmPassword } = payload;

    if (!token || !password || !confirmPassword) {
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

    return await db.transaction(async (tx) => {
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

      if (tokenData.expiresAt < new Date()) {
        throw new HttpException(
          'Reset link has expired',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, tokenData.userId))
        .limit(1);

      if (!user) {
        throw new HttpException('Invalid token user', HttpStatus.BAD_REQUEST);
      }

      const newPasswordHash = await hashPassword(password);

      await tx
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, tokenData.userId));

      await tx
        .update(usersToken)
        .set({ isUsed: true })
        .where(eq(usersToken.token, token));

      return success(
        { email: user.email },
        'Password reset successfully',
        HttpStatus.CREATED,
      );
    });
  } catch (error) {
    logger.error('Error in resetPasswordService:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to process reset password',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
