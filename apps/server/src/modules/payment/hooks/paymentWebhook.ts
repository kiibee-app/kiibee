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

export async function handleEpayPayment(body: any) {
  const {
    state,
    reference,
    amount,
    currency,
    paymentMethodDisplayText,
    paymentMethodExpiry,
    paymentMethodSubType,
    paymentMethodType,
  } = body.data.transaction;

  const orderId = reference;
  const status = state;
  const resolvedAmount = amount / 100;

  if (!orderId) {
    logger.error('⚠️ Missing reference in webhook');
    return;
  }

  const [orderInfo] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  const contentInfo = orderInfo?.mediaFileId
    ? await db
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.id, orderInfo.mediaFileId))
        .limit(1)
    : [];

  const rentExpiresAt =
    orderInfo?.itemType === ORDER_TYPES.RENTAL
      ? new Date(
          Date.now() + (contentInfo[0].rentDurationHours || 0) * 60 * 60 * 1000,
        )
      : null;

  if (status === PAYMENT_STATUS.PAYMENT_SUCCESS) {
    logger.info('✅ Payment success:', orderId);
    await db.insert(payments).values({
      id: randomUUID(),
      orderId: orderId,
      provider: 'card',
      providerReference: orderId,
      amount: resolvedAmount,
      currency: currency,
      status: ORDER_STATUS.COMPLETED,
      paymentMethod: paymentMethodType,
      cardNo: paymentMethodDisplayText,
      cardExpiry: paymentMethodExpiry,
      cardType: paymentMethodSubType,
      paidAt: new Date(),
    } as any);

    await db
      .update(orders)
      .set({ status: ORDER_STATUS.COMPLETED, rentExpiresAt })
      .where(eq(orders.id, orderId));

    await db.insert(userContentAccess).values({
      id: randomUUID(),
      orderId: orderId,
      userId: orderInfo?.userId || '',
      mediaFileId: orderInfo?.mediaFileId || null,
      collectionId: orderInfo?.collectionId || null,
      accessType:
        orderInfo?.itemType === ORDER_TYPES.PURCHASE
          ? ACCRESS_TYPES.PURCHASED
          : ACCRESS_TYPES.RENTED,
      rentExpiresAt,
    } as any);
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
