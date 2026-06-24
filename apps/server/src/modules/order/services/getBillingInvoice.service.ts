import { HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
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

export async function getBillingInvoiceService(
  userId: string,
  billingId: string,
) {
  try {
    if (!billingId) {
      return fail('billingId must be provided', HttpStatus.BAD_REQUEST);
    }

    const mediaCreators = alias(users, 'media_creators');
    const collectionCreators = alias(users, 'collection_creators');

    const [invoice] = await db
      .select({
        orderNumber: orders.id,
        itemType: orders.itemType,
        contentTitle: sql<string>`coalesce(${mediaFiles.title}, ${collections.name})`,
        contentImage: sql<
          string | null
        >`coalesce(${mediaFiles.thumbnailUrl}, ${collections.coverImageUrl})`,
        creatorName: sql<string>`coalesce(${mediaCreators.fullName}, ${collectionCreators.fullName})`,
        paymentDate: sql<Date>`coalesce(${payments.paidAt}, ${payments.createdAt})`,
        amount: payments.amount,
        cardNumber: payments.cardNo,
        paymentMethod: payments.paymentMethod,
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
          eq(payments.id, billingId),
          eq(orders.userId, userId),
          eq(orders.status, ORDER_STATUS.COMPLETED),
          eq(payments.status, ORDER_STATUS.COMPLETED),
        ),
      )
      .limit(1);

    if (!invoice) {
      return fail('Billing invoice not found', HttpStatus.NOT_FOUND);
    }

    return success(
      {
        orderNumber: invoice.orderNumber,
        type:
          invoice.itemType === ORDER_TYPES.RENTAL
            ? ACCRESS_TYPES.RENTED
            : ACCRESS_TYPES.PURCHASED,
        paymentDate: invoice.paymentDate,
        amount: invoice.amount,
        paymentMethod: invoice.paymentMethod,
        cardNumber: invoice.cardNumber,
        contentDetails: {
          contentTitle: invoice.contentTitle ?? '',
          contentImage: invoice.contentImage ?? '',
          creatorName: invoice.creatorName ?? '',
        },
      },
      'Billing invoice retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch billing invoice:', error);
    return fail(
      'Failed to fetch billing invoice',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
