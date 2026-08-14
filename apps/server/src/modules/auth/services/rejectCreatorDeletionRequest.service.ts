import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorDeletionRequests, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';

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

    const [pendingRequest] = await db
      .select({
        requestId: creatorDeletionRequests.id,
        userEmail: users.email,
        userFirstName: users.firstName,
        userFullName: users.fullName,
      })
      .from(creatorDeletionRequests)
      .leftJoin(users, eq(creatorDeletionRequests.userId, users.id))
      .where(
        and(
          eq(creatorDeletionRequests.id, requestId),
          eq(creatorDeletionRequests.isDeleted, false),
          eq(creatorDeletionRequests.status, STATUS.PENDING),
        ),
      )
      .limit(1);

    if (!pendingRequest) {
      throw new HttpException(
        'Creator deletion request not found or already processed',
        HttpStatus.NOT_FOUND,
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

    if (pendingRequest.userEmail) {
      runInBackground(
        sendTemplateEmail({
          to: pendingRequest.userEmail,
          subject: mailSubject.REJECTED_CREATOR_DELETION,
          templateName: templateName.REJECTED_CREATOR_DELETION,
          variables: {
            name:
              pendingRequest.userFirstName ||
              pendingRequest.userFullName ||
              'there',
          },
        }),
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
