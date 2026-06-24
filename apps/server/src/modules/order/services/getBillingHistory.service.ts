import { HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from 'src/database/db';
import {
  collections,
  mediaFiles,
  orders,
  payments,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ACCRESS_TYPES, ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { BillingHistoryQueryDto } from '../dto/order.dto';

export async function getBillingHistoryService(
  userId: string,
  query?: BillingHistoryQueryDto,
) {
  try {
    const mediaCreators = alias(users, 'media_creators');
    const collectionCreators = alias(users, 'collection_creators');

    const conditions = [
      eq(orders.userId, userId),
      eq(orders.status, ORDER_STATUS.COMPLETED),
      eq(payments.status, ORDER_STATUS.COMPLETED),
    ];

    if (query?.searchContent) {
      conditions.push(
        ilike(
          sql<string>`coalesce(${mediaFiles.title}, ${collections.name})`,
          `%${query.searchContent}%`,
        ),
      );
    }

    if (query?.searchCreator) {
      conditions.push(
        ilike(
          sql<string>`coalesce(${mediaCreators.fullName}, ${collectionCreators.fullName})`,
          `%${query.searchCreator}%`,
        ),
      );
    }

    const rows = await db
      .select({
        id: payments.id,
        orderNumber: orders.id,
        contentTitle: sql<string>`coalesce(${mediaFiles.title}, ${collections.name})`,
        contentImage: sql<
          string | null
        >`coalesce(${mediaFiles.thumbnailUrl}, ${collections.coverImageUrl})`,
        creatorName: sql<string>`coalesce(${mediaCreators.fullName}, ${collectionCreators.fullName})`,
        itemType: orders.itemType,
        paymentDate: sql<Date>`coalesce(${payments.paidAt}, ${payments.createdAt})`,
        amount: payments.amount,
        paymentMethod: payments.paymentMethod,
        cardNumber: payments.cardNo,
      })
      .from(payments)
      .innerJoin(orders, eq(payments.orderId, orders.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .leftJoin(mediaCreators, eq(mediaFiles.creatorId, mediaCreators.id))
      .leftJoin(
        collectionCreators,
        eq(collections.creatorId, collectionCreators.id),
      )
      .where(and(...conditions))
      .orderBy(desc(sql`coalesce(${payments.paidAt}, ${payments.createdAt})`));

    const billingHistory = rows.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      contentTitle: row.contentTitle ?? '',
      contentImage: row.contentImage ?? '',
      creatorName: row.creatorName ?? '',
      type:
        row.itemType === ORDER_TYPES.RENTAL
          ? ACCRESS_TYPES.RENTED
          : ACCRESS_TYPES.PURCHASED,
      paymentDate: row.paymentDate,
      amount: row.amount,
      paymentMethod: row.paymentMethod,
      cardNumber: row.cardNumber,
    }));

    return success(
      billingHistory,
      'Billing history retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch billing history:', error);
    return fail(
      'Failed to fetch billing history',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
