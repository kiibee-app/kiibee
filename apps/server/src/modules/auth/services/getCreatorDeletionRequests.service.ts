import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorDeletionRequests, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';

export const getCreatorDeletionRequestsService = async () => {
  try {
    const rows = await db
      .select({
        requestId: creatorDeletionRequests.id,
        requestUserId: creatorDeletionRequests.userId,
        status: creatorDeletionRequests.status,
        approvedUserId: creatorDeletionRequests.approvedUserId,
        createdAt: creatorDeletionRequests.createdAt,
        updatedAt: creatorDeletionRequests.updatedAt,
        email: users.email,
        fullName: users.fullName,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
      })
      .from(creatorDeletionRequests)
      .leftJoin(users, eq(creatorDeletionRequests.userId, users.id))
      .where(
        and(
          eq(creatorDeletionRequests.isDeleted, false),
          eq(creatorDeletionRequests.status, STATUS.PENDING),
        ),
      );

    const data = rows.map((row) => ({
      id: row.requestId,
      status: row.status,
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
      },
    }));

    return success(
      data,
      'Creator deletion requests fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator deletion requests:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creator deletion requests',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
