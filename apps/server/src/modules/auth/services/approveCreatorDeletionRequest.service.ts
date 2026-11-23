import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import {
  creatorDeletionRequests,
  creatorApplicationRequests,
  usersToken,
  creatorInfo,
  creatorPlans,
  subscriptions,
  userSessions,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { ROLE, STATUS } from 'src/utils/constant';
import { and, eq } from 'drizzle-orm';
import { deleteSubscriptionService } from 'src/modules/subscription/services/deleteSubscription.service';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';

export const approveCreatorDeletionRequestService = async (
  requestId: string,
  approverUserId: string,
  options: { creatorId?: string } = {},
) => {
  try {
    if ((!requestId && !options.creatorId) || !approverUserId) {
      throw new HttpException(
        'Request ID and approver User ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [pendingRequest] = options.creatorId
      ? await db
          .select({
            userId: users.id,
            userEmail: users.email,
            userFirstName: users.firstName,
            userFullName: users.fullName,
          })
          .from(users)
          .where(
            and(
              eq(users.id, options.creatorId),
              eq(users.role, ROLE.CREATOR),
              eq(users.isDeleted, false),
            ),
          )
          .limit(1)
      : await db
          .select({
            userId: creatorDeletionRequests.userId,
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
        options.creatorId
          ? 'Creator account not found or already closed'
          : 'Creator deletion request not found or already processed',
        HttpStatus.NOT_FOUND,
      );
    }

    const targetUserId = pendingRequest.userId;

    if (!targetUserId || !pendingRequest.userEmail) {
      throw new HttpException(
        'Creator account associated with this request no longer exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [activeSubscription] = await db
      .select({
        id: subscriptions.id,
        agreementId: subscriptions.agreementId,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.creatorId, targetUserId),
          eq(subscriptions.isActive, true),
        ),
      )
      .limit(1);

    if (activeSubscription?.agreementId) {
      await deleteSubscriptionService(targetUserId, {
        subscriptionId: activeSubscription.id,
        preserveCreatorPlan: true,
        notify: false,
      });
    }

    await db.transaction(async (tx) => {
      const deletedAt = new Date();
      // Claim the account atomically so repeated/concurrent closures cannot notify twice.
      const [closedUser] = await tx
        .update(users)
        .set({
          isDeleted: true,
          deletedAt,
          isActive: false,
          isHidden: true,
          status: 'deleted',
          updatedAt: deletedAt,
        })
        .where(
          and(
            eq(users.id, targetUserId),
            eq(users.role, ROLE.CREATOR),
            eq(users.isDeleted, false),
          ),
        )
        .returning({ id: users.id });
      if (!closedUser) {
        throw new HttpException(
          'Creator account is already closed',
          HttpStatus.CONFLICT,
        );
      }

      if (options.creatorId) {
        const [existingRequest] = await tx
          .select({ id: creatorDeletionRequests.id })
          .from(creatorDeletionRequests)
          .where(
            and(
              eq(creatorDeletionRequests.userId, targetUserId),
              eq(creatorDeletionRequests.status, STATUS.PENDING),
              eq(creatorDeletionRequests.isDeleted, false),
            ),
          )
          .limit(1);
        if (existingRequest) {
          await tx
            .update(creatorDeletionRequests)
            .set({
              status: STATUS.APPROVED,
              approvedUserId: approverUserId,
              isDeleted: true,
              updatedAt: deletedAt,
              reason: 'Account closed by admin due to inactivity',
            })
            .where(eq(creatorDeletionRequests.id, existingRequest.id));
        } else {
          await tx.insert(creatorDeletionRequests).values({
            userId: targetUserId,
            status: STATUS.APPROVED,
            approvedUserId: approverUserId,
            isDeleted: true,
            reason: 'Account closed by admin due to inactivity',
          });
        }
      } else {
        const [request] = await tx
          .update(creatorDeletionRequests)
          .set({
            status: STATUS.APPROVED,
            approvedUserId: approverUserId,
            isDeleted: true,
            updatedAt: deletedAt,
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
      }

      // Archive previous applications so the same email can apply again.
      await tx
        .update(creatorApplicationRequests)
        .set({ isDeleted: true, deletedAt, updatedAt: deletedAt })
        .where(
          and(
            eq(creatorApplicationRequests.email, pendingRequest.userEmail!),
            eq(creatorApplicationRequests.isDeleted, false),
          ),
        );
      await tx.delete(usersToken).where(eq(usersToken.userId, targetUserId));

      await tx
        .delete(userSessions)
        .where(eq(userSessions.userId, targetUserId));

      await tx.delete(creatorInfo).where(eq(creatorInfo.userId, targetUserId));

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

    runInBackground(
      sendTemplateEmail({
        to: pendingRequest.userEmail,
        subject: options.creatorId
          ? mailSubject.CREATOR_ACCOUNT_CLOSED
          : mailSubject.APPROVED_CREATOR_DELETION,
        templateName: options.creatorId
          ? templateName.CREATOR_ACCOUNT_CLOSED
          : templateName.APPROVED_CREATOR_DELETION,
        variables: {
          name:
            pendingRequest.userFirstName ||
            pendingRequest.userFullName ||
            'there',
        },
      }),
    );

    return success(
      options.creatorId ? { id: targetUserId, isDeleted: true } : null,
      options.creatorId
        ? 'Creator account permanently closed. Notification email queued.'
        : 'Creator deletion request approved. Account soft-deleted and subscription plan cancelled.',
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
