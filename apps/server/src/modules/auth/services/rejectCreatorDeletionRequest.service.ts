import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorDeletionRequests } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';

export const rejectCreatorDeletionRequestService = async (
  requestId: string,
  approverUserId: string,
) => {
  try {
    if (!requestId || !approverUserId) {
      throw new HttpException(
        'Request ID and approver User ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [request] = await db
      .update(creatorDeletionRequests)
      .set({
        status: STATUS.REJECTED,
        approvedUserId: approverUserId,
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(creatorDeletionRequests.id, requestId),
          eq(creatorDeletionRequests.isDeleted, false),
          eq(creatorDeletionRequests.status, STATUS.PENDING),
        ),
      )
      .returning({ id: creatorDeletionRequests.id });

    if (!request) {
      throw new HttpException(
        'Creator deletion request not found or already processed',
        HttpStatus.NOT_FOUND,
      );
    }

    return success(
      {
        id: request.id,
        status: STATUS.REJECTED,
      },
      'Creator deletion request rejected. The account remains active.',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error rejecting creator deletion request:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to reject creator deletion request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
