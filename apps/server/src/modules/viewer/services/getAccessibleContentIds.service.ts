import { HttpStatus } from '@nestjs/common';
import { and, eq, gt, isNotNull, isNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collectionItems,
  contentAccessRequests,
  orders,
  userContentAccess,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_TYPES, STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getAccessibleContentIds = async (userId: string) => {
  try {
    const now = new Date();

    const [
      purchasedOrGranted,
      collectionGranted,
      emailApproved,
      ordersDirect,
      ordersCollection,
    ] = await Promise.all([
      db
        .select({ contentId: userContentAccess.mediaFileId })
        .from(userContentAccess)
        .where(
          and(
            eq(userContentAccess.userId, userId),
            isNotNull(userContentAccess.mediaFileId),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        ),
      db
        .select({ contentId: collectionItems.mediaFileId })
        .from(userContentAccess)
        .innerJoin(
          collectionItems,
          eq(collectionItems.collectionId, userContentAccess.collectionId),
        )
        .where(
          and(
            eq(userContentAccess.userId, userId),
            isNull(userContentAccess.mediaFileId),
            isNotNull(userContentAccess.collectionId),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        ),
      db
        .select({ contentId: contentAccessRequests.contentId })
        .from(contentAccessRequests)
        .innerJoin(
          users,
          sql`lower(${users.email}) = lower(${contentAccessRequests.viewerEmail})`,
        )
        .where(
          and(
            eq(users.id, userId),
            eq(contentAccessRequests.status, STATUS.APPROVED),
          ),
        ),
      db
        .select({ contentId: orders.mediaFileId })
        .from(orders)
        .where(
          and(
            eq(orders.userId, userId),
            eq(orders.status, 'completed'),
            isNotNull(orders.mediaFileId),
            or(
              eq(orders.itemType, ORDER_TYPES.PURCHASE),
              and(
                eq(orders.itemType, ORDER_TYPES.RENTAL),
                or(isNull(orders.rentExpiresAt), gt(orders.rentExpiresAt, now)),
              ),
            ),
          ),
        ),
      db
        .select({ contentId: collectionItems.mediaFileId })
        .from(orders)
        .innerJoin(
          collectionItems,
          eq(collectionItems.collectionId, orders.collectionId),
        )
        .where(
          and(
            eq(orders.userId, userId),
            eq(orders.status, 'completed'),
            isNull(orders.mediaFileId),
            isNotNull(orders.collectionId),
            or(
              eq(orders.itemType, ORDER_TYPES.PURCHASE),
              and(
                eq(orders.itemType, ORDER_TYPES.RENTAL),
                or(isNull(orders.rentExpiresAt), gt(orders.rentExpiresAt, now)),
              ),
            ),
          ),
        ),
    ]);

    const contentIds = Array.from(
      new Set(
        [
          ...purchasedOrGranted.map(({ contentId }) => contentId as string),
          ...collectionGranted.map(({ contentId }) => contentId as string),
          ...emailApproved.map(({ contentId }) => contentId),
          ...ordersDirect.map(({ contentId }) => contentId as string),
          ...ordersCollection.map(({ contentId }) => contentId as string),
        ].filter(Boolean),
      ),
    );

    return success(
      { contentIds },
      'Accessible content ids retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error retrieving accessible content ids:', error);

    return fail(
      'Failed to retrieve accessible content ids',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
