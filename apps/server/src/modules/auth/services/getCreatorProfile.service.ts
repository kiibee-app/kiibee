import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  users,
  creatorInfo,
  creatorBankAccounts,
  creatorDeletionRequests,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';

export const getCreatorProfileService = async (userId: string) => {
  try {
    const [user, creator, bankAccount, pendingDeletion] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).limit(1),

      db
        .select()
        .from(creatorInfo)
        .where(eq(creatorInfo.userId, userId))
        .limit(1),

      db
        .select()
        .from(creatorBankAccounts)
        .where(eq(creatorBankAccounts.creatorId, userId))
        .limit(1),

      db
        .select({ id: creatorDeletionRequests.id })
        .from(creatorDeletionRequests)
        .where(
          and(
            eq(creatorDeletionRequests.userId, userId),
            eq(creatorDeletionRequests.status, STATUS.PENDING),
            eq(creatorDeletionRequests.isDeleted, false),
          ),
        )
        .limit(1),
    ]);

    if (!user.length) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const responseData = {
      user: user[0] || null,
      creatorInfo: creator[0] || null,
      bankAccount: bankAccount[0] || null,
      hasPendingDeletionRequest: pendingDeletion.length > 0,
    };

    return success(
      responseData,
      'Creator profile fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator profile', {
      error,
      userId,
    });

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch creator profile',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
