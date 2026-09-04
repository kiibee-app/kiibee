import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { mediaFiles, orders, payments, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { eq, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import {
  mailNote,
  mailSubject,
  templateName,
} from 'src/utils/mailServiceConstant';
import { formatDate } from 'src/utils/formatDate';
import { success } from 'src/utils/sendResponse';
import { ORDER_TYPES } from 'src/utils/constant';

export const sendReceiptService = async (orderId: string) => {
  try {
    const creators = alias(users, 'creators');

    const [orderInfo] = await db
      .select({
        orderId: orders.id,
        userEmail: users.email,
        userName: users.fullName,
        itemType: orders.itemType,
        price: orders.price,
        currency: orders.currency,
        status: orders.status,
        createdAt: orders.createdAt,
        mediaFileId: orders.mediaFileId,
        content: {
          mediaId: mediaFiles.id,
          mediaTitle: mediaFiles.title,
          creatorName: creators.fullName,
        },
        payment: {
          paymentMethod: payments.paymentMethod,
          status: payments.status,
          cardType: sql<string>`coalesce(${payments.cardType}, 'Not found')`,
          cardNo: sql<string>`coalesce(${payments.cardNo}, 'XXXX-XXXX-XXXX-XXXX')`,
          paidAt: payments.paidAt,
          amount: payments.amount,
        },
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .innerJoin(creators, eq(mediaFiles.creatorId, creators.id))
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .where(eq(orders.id, orderId));

    if (!orderInfo) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    const isRental = orderInfo.itemType === ORDER_TYPES.RENTAL;

    runInBackground(
      sendTemplateEmail({
        to: orderInfo.userEmail,
        subject: isRental
          ? mailSubject.RENTAL_RECEIPT
          : mailSubject.PURCHASE_RECEIPT,
        templateName: isRental
          ? templateName.RENTAL_RECEIPT
          : templateName.PURCHASE_RECEIPT,
        variables: {
          userName: orderInfo.userName,
          orderId: orderInfo.orderId,
          mediaTitle: orderInfo.content.mediaTitle,
          creatorName: orderInfo.content.creatorName,
          orderTypeLabel: isRental ? ORDER_TYPES.RENTAL : ORDER_TYPES.PURCHASE,
          headerTitle: isRental
            ? 'Your rental is confirmed'
            : 'Your purchase is confirmed',
          createdAt: formatDate(orderInfo.createdAt),
          price: orderInfo.payment.amount ?? orderInfo.price,
          currency: orderInfo.currency,
          status: orderInfo.status,
          paymentMethod: orderInfo.payment.paymentMethod,
          cardType: orderInfo.payment.cardType,
          cardNoLast4: orderInfo.payment.cardNo.slice(-4),
          paidAt: formatDate(orderInfo.payment.paidAt ?? new Date()),
          accessNote: isRental
            ? mailNote.RENTAL_RECEIPT
            : mailNote.PURCHASE_RECEIPT,
        },
      }),
    );

    return success(null, 'Receipt email sent successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to send receipt:', error);

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      'Failed to send receipt',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
