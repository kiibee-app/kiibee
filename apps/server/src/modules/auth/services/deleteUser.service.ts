import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { db } from 'src/database/db';
import { users } from 'src/database/schema/users/users.schema';
import { logger } from 'src/logger/logger';
import { fail } from 'src/utils/sendResponse';
import { logoutService } from './logout.service';

export const deleteUserService = async (
  userId: string,
  jti?: string,
  exp?: number,
) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }
    const deletedAt = new Date();

    await db
      .update(users)
      .set({ isDeleted: true, deletedAt })
      .where(eq(users.id, userId));

    await logoutService(userId, jti, exp);
    return {
      success: true,
      message: 'User account deleted successfully',
    };
  } catch (error) {
    logger.error('Error in deleteUserService:', error);

    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to process delete user request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
