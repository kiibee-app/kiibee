import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import {
  creatorDeletionRequests,
  creatorPlans,
  subscriptions,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';
import { and, eq } from 'drizzle-orm';
import { deleteSubscriptionService } from 'src/modules/subscription/services/deleteSubscription.service';

export const approveCreatorDeletionRequestService = async (
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
      .select({ userId: creatorDeletionRequests.userId })
      .from(creatorDeletionRequests)
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

    const targetUserId = pendingRequest.userId;

    if (!targetUserId) {
      throw new HttpException(
        'Creator account associated with this request no longer exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [activeSubscription] = await db
      .select({
        id: subscriptions.id,
        agreementId: subscriptions.agreementId,
        amount: subscriptions.amount,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.creatorId, targetUserId),
          eq(subscriptions.isActive, true),
        ),
      )
      .limit(1);

    const hasActivePaidSubscription =
      !!activeSubscription?.agreementId &&
      Number(activeSubscription.amount) > 0;

    if (hasActivePaidSubscription) {
      await deleteSubscriptionService(targetUserId);
    }

    await db.transaction(async (tx) => {
      const [request] = await tx
        .update(creatorDeletionRequests)
        .set({
          status: STATUS.APPROVED,
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
        .returning({ userId: creatorDeletionRequests.userId });

      if (!request || request.userId !== targetUserId) {
        throw new HttpException(
          'Creator deletion request not found or already processed',
          HttpStatus.NOT_FOUND,
        );
      }

      const deletedAt = new Date();

      await tx
        .update(users)
        .set({ isDeleted: true, deletedAt })
        .where(eq(users.id, targetUserId));

      await tx
        .update(creatorPlans)
        .set({ status: STATUS.INACTIVE, updatedAt: deletedAt })
        .where(
          and(
            eq(creatorPlans.creatorId, targetUserId),
            eq(creatorPlans.status, STATUS.ACTIVE),
          ),
        );

      if (activeSubscription) {
        await tx
          .update(subscriptions)
          .set({
            isActive: false,
            status: 'cancelled',
            updatedAt: deletedAt,
          })
          .where(eq(subscriptions.id, activeSubscription.id));
      }
    });

    return success(
      null,
      'Creator deletion request approved. Account soft-deleted and subscription plan cancelled.',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error approving creator deletion request:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to approve creator deletion request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
