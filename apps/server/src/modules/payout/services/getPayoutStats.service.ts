import { HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayouts,
  mediaFiles,
  collections,
  orders,
  payments,
} from 'src/database/schema';
import { ORDER_STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';

export async function getPayoutStatsService(creatorId: string) {
  try {
    const totalEarnings = await db
      .select({
        total: sql<number>`coalesce(sum(${orders.price}), 0)`.mapWith(Number),
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

    const totalPaidOut = await db
      .select({
        total: sql<number>`coalesce(sum(${creatorPayouts.amount}), 0)`.mapWith(
          Number,
        ),
      })
      .from(creatorPayouts)
      .where(
        and(
          eq(creatorPayouts.creatorId, creatorId),
          eq(creatorPayouts.status, 'completed'),
        ),
      );

    const earnings = totalEarnings[0]?.total ?? 0;
    const paidOut = totalPaidOut[0]?.total ?? 0;
    const balance = earnings - paidOut;

    const stats = {
      balance: `${balance.toFixed(2)} kr.`,
      purchases: totalEarnings[0]?.purchases ?? 0,
      rentals: totalEarnings[0]?.rentals ?? 0,
      earnings,
      paidOut,
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
