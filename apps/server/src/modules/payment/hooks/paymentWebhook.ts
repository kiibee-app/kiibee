import { db } from 'src/database/db';
import { randomUUID } from 'crypto';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { eq } from 'drizzle-orm';
import { mediaFiles, payments, userContentAccess } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import {
  ACCRESS_TYPES,
  ORDER_STATUS,
  ORDER_TYPES,
  PAYMENT_STATUS,
} from 'src/utils/constant';

type PaymentTransaction = {
  reference: string;
  amount?: string | number;
  currency?: string;
  paymentMethodDisplayText?: string | null;
  paymentMethodExpiry?: string | null;
  paymentMethodSubType?: string | null;
  paymentMethodType?: string | null;
};

export async function completeSuccessfulOrderPayment(
  transaction: PaymentTransaction,
) {
  const orderId = transaction.reference;
  if (!orderId) {
    logger.error('⚠️ Missing reference while completing payment');
    return null;
  }

  const [orderInfo] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!orderInfo) {
    logger.error('⚠️ Order not found while completing payment:', orderId);
    return null;
  }

  const contentInfo = orderInfo.mediaFileId
    ? await db
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.id, orderInfo.mediaFileId))
        .limit(1)
    : [];

  const rentExpiresAt =
    orderInfo.itemType === ORDER_TYPES.RENTAL
      ? new Date(
          Date.now() + (contentInfo[0].rentDurationHours || 0) * 60 * 60 * 1000,
        )
      : null;

  logger.info('✅ Payment success:', orderId);

  const [existingPayment] = await db
    .select({ id: payments.id })
    .from(payments)
    .where(eq(payments.orderId, orderId))
    .limit(1);

  if (!existingPayment) {
    await db.insert(payments).values({
      id: randomUUID(),
      orderId,
      provider: 'card',
      providerReference: orderId,
      amount: String(transaction.amount ?? orderInfo.price),
      currency: transaction.currency ?? orderInfo.currency,
      status: ORDER_STATUS.COMPLETED,
      paymentMethod: transaction.paymentMethodType ?? null,
      cardNo: transaction.paymentMethodDisplayText ?? null,
      cardExpiry: transaction.paymentMethodExpiry ?? null,
      cardType: transaction.paymentMethodSubType ?? null,
      paidAt: new Date(),
    } as any);
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({ status: ORDER_STATUS.COMPLETED, rentExpiresAt })
    .where(eq(orders.id, orderId))
    .returning();

  const [existingAccess] = await db
    .select({ id: userContentAccess.id })
    .from(userContentAccess)
    .where(eq(userContentAccess.orderId, orderId))
    .limit(1);

  if (!existingAccess) {
    await db.insert(userContentAccess).values({
      id: randomUUID(),
      orderId,
      userId: orderInfo.userId,
      mediaFileId: orderInfo.mediaFileId || null,
      collectionId: orderInfo.collectionId || null,
      accessType:
        orderInfo.itemType === ORDER_TYPES.PURCHASE
          ? ACCRESS_TYPES.PURCHASED
          : ACCRESS_TYPES.RENTED,
      rentExpiresAt,
    } as any);
  }

  return updatedOrder;
}

export async function handleEpayPayment(body: any) {
  if (!body?.data?.transaction) {
    logger.error('⚠️ Invalid webhook payload: missing transaction data');
    return;
  }

  const transaction = body.data.transaction;
  const { state, reference } = transaction;

  const orderId = reference;
  const status = state;

  if (!orderId) {
    logger.error('⚠️ Missing reference in webhook');
    return;
  }

  if (status === PAYMENT_STATUS.PAYMENT_SUCCESS) {
    await completeSuccessfulOrderPayment(transaction);
    return;
  }

  if (status === PAYMENT_STATUS.PAYMENT_FAILED) {
    logger.error('❌ Payment failed:', orderId);
    await db
      .update(orders)
      .set({ status: ORDER_STATUS.FAILED, rentExpiresAt: null })
      .where(eq(orders.id, orderId));
    return;
  }

  if (status === PAYMENT_STATUS.PAYMENT_EXPIRED) {
    logger.info('⏰ Payment expired:', orderId);
    await db
      .update(orders)
      .set({ status: ORDER_STATUS.FAILED, rentExpiresAt: null })
      .where(eq(orders.id, orderId));
    return;
  }

  logger.info('ℹ️ Unhandled status:', status);
}
