import { HttpException, HttpStatus } from '@nestjs/common';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorDeletionRequests, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';

export const getCreatorDeletionHistoryService = async () => {
  try {
    const rows = await db
      .select({
        requestId: creatorDeletionRequests.id,
        requestUserId: creatorDeletionRequests.userId,
        status: creatorDeletionRequests.status,
        reason: creatorDeletionRequests.reason,
        approvedUserId: creatorDeletionRequests.approvedUserId,
        createdAt: creatorDeletionRequests.createdAt,
        updatedAt: creatorDeletionRequests.updatedAt,
        email: users.email,
        fullName: users.fullName,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        deletedAt: users.deletedAt,
      })
      .from(creatorDeletionRequests)
      .leftJoin(users, eq(creatorDeletionRequests.userId, users.id))
      .where(
        inArray(creatorDeletionRequests.status, [
          STATUS.APPROVED,
          STATUS.REJECTED,
        ]),
      )
      .orderBy(desc(creatorDeletionRequests.updatedAt));

    const data = rows.map((row) => ({
      id: row.requestId,
      status: row.status,
      reason: row.reason,
      approvedUserId: row.approvedUserId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: {
        id: row.requestUserId,
        email: row.email,
        fullName: row.fullName,
        firstName: row.firstName,
        lastName: row.lastName,
        role: row.role,
        deletedAt: row.deletedAt,
      },
    }));

    return success(
      data,
      'Creator deletion history fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator deletion history:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creator deletion history',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
