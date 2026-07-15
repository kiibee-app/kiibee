import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users } from 'src/database/schema/users/users.schema';
import { creatorDeletionRequests } from 'src/database/schema/users/creatorDeletionRequests.schema';
import { logger } from 'src/logger/logger';
import { success, fail } from 'src/utils/sendResponse';
import { ROLE, STATUS } from 'src/utils/constant';
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

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        role: true,
        isDeleted: true,
      },
    });

    if (!user) {
      return fail('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isDeleted) {
      return fail('User account is already deleted', HttpStatus.BAD_REQUEST);
    }

    const isCreator = user.role === ROLE.CREATOR;

    if (isCreator) {
      const existingPending = await db
        .select({ id: creatorDeletionRequests.id })
        .from(creatorDeletionRequests)
        .where(
          and(
            eq(creatorDeletionRequests.userId, userId),
            eq(creatorDeletionRequests.status, STATUS.PENDING),
            eq(creatorDeletionRequests.isDeleted, false),
          ),
        )
        .limit(1);

      if (existingPending.length > 0) {
        return fail(
          'A deletion request is already pending for this account',
          HttpStatus.CONFLICT,
        );
      }

      await db.insert(creatorDeletionRequests).values({
        userId,
        status: STATUS.PENDING,
      });

      return success(
        null,
        'Creator account deletion request submitted successfully. You can continue using your account until it is approved by an admin.',
        HttpStatus.OK,
      );
    }

    const deletedAt = new Date();

    await db
      .update(users)
      .set({ isDeleted: true, deletedAt })
      .where(eq(users.id, userId));

    await logoutService(userId, jti, exp);

    return success(null, 'User account deleted successfully', HttpStatus.OK);
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
