import { HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  mediaFiles,
  collections,
  orders,
  payments,
  creatorWallets,
} from 'src/database/schema';
import { ORDER_STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';

export async function getPayoutStatsService(creatorId: string) {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }
    const [currentBalance] = await db
      .select({
        amount: creatorWallets.amount,
      })
      .from(creatorWallets)
      .where(eq(creatorWallets.creatorId, creatorId));

    const balance = Number(currentBalance?.amount ?? 0);
    const totalCount = await db
      .select({
        purchases:
          sql<number>`count(case when ${orders.itemType} = 'purchase' then 1 end)`.mapWith(
            Number,
          ),
        rentals:
          sql<number>`count(case when ${orders.itemType} = 'rental' then 1 end)`.mapWith(
            Number,
          ),
      })
      .from(orders)
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(
        and(
          eq(payments.status, ORDER_STATUS.COMPLETED as any),
          eq(orders.status, ORDER_STATUS.COMPLETED as any),
          sql`(${mediaFiles.creatorId} = ${creatorId} OR ${collections.creatorId} = ${creatorId})`,
        ),
      );

    const purchases = totalCount[0]?.purchases ?? 0;
    const rentals = totalCount[0]?.rentals ?? 0;

    const stats = {
      balance: `${balance.toFixed(2)} kr.`,
      purchases,
      rentals,
    };

    return success(stats, 'Payout stats retrieved successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to fetch payout stats:', error);
    return fail(
      'Failed to fetch payout stats',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
