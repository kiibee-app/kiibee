import { HttpStatus } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
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

export async function getBillingHistoryService(userId: string) {
  try {
    const mediaCreators = alias(users, 'media_creators');
    const collectionCreators = alias(users, 'collection_creators');

    const rows = await db
      .select({
        id: payments.id,
        orderNumber: orders.id,
        contentTitle: mediaFiles.title,
        creatorName: mediaCreators.fullName,
        itemType: orders.itemType,
        paymentDate: payments.paidAt,
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
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.status, ORDER_STATUS.COMPLETED),
          eq(payments.status, ORDER_STATUS.COMPLETED),
        ),
      )
      .orderBy(desc(sql`coalesce(${payments.paidAt}, ${payments.createdAt})`));

    const billingHistory = rows.map((row) => ({
      id: row.id,
      orderNumber: row.orderNumber,
      contentTitle: row.contentTitle ?? '',
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
