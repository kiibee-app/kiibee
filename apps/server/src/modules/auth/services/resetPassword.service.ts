import { HttpException, HttpStatus } from '@nestjs/common';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { fail, success } from 'src/utils/sendResponse';
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
      return fail('All fields are required', HttpStatus.BAD_REQUEST);
    }

    if (password !== confirmPassword) {
      return fail('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    if (password.length < 6) {
      return fail(
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
        return fail('Invalid or expired token', HttpStatus.BAD_REQUEST);
      }

      if (tokenData.isUsed) {
        return fail('Token already used', HttpStatus.BAD_REQUEST);
      }

      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, tokenData.userId))
        .limit(1);

      if (!user) {
        return fail('Invalid token user', HttpStatus.BAD_REQUEST);
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
        HttpStatus.OK,
      );
    });
  } catch (error) {
    logger.error('Error in resetPasswordService:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to process reset password',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
