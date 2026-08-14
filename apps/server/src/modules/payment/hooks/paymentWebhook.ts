import { db } from 'src/database/db';
import { randomUUID } from 'crypto';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { and, eq, ne } from 'drizzle-orm';
import {
  collections,
  mediaFiles,
  payments,
  userCardInfo,
  userContentAccess,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import {
  ACCRESS_TYPES,
  ORDER_STATUS,
  ORDER_TYPES,
  PAYMENT_STATUS,
} from 'src/utils/constant';
import { addWallet } from 'src/services/addWallet';
import { parseRentDurationToHours } from 'src/utils/rentDuration';
import { sendReceiptService } from 'src/modules/export/services/sendReceipt.service';

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
    paymentMethodId,
    subscriptionId,
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

  if (!orderInfo) {
    logger.error('⚠️ Order not found for webhook reference:', orderId);
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

  if (status !== PAYMENT_STATUS.PAYMENT_SUCCESS) {
    logger.info('ℹ️ Unhandled status:', status);
    return;
  }

  const isCollectionOrder = Boolean(
    orderInfo.collectionId && !orderInfo.mediaFileId,
  );
  const [contentInfo] = orderInfo.mediaFileId
    ? await db
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.id, orderInfo.mediaFileId))
        .limit(1)
    : [];
  const [collectionInfo] = isCollectionOrder
    ? await db
        .select()
        .from(collections)
        .where(eq(collections.id, orderInfo.collectionId!))
        .limit(1)
    : [];

  const rentDurationHours = isCollectionOrder
    ? parseRentDurationToHours(collectionInfo?.rentDuration)
    : contentInfo?.rentDurationHours;

  const rentExpiresAt =
    orderInfo.itemType === ORDER_TYPES.RENTAL
      ? new Date(Date.now() + (rentDurationHours || 0) * 60 * 60 * 1000)
      : null;

  const creatorId = isCollectionOrder
    ? collectionInfo?.creatorId
    : contentInfo?.creatorId;

  if (!creatorId) {
    logger.error('⚠️ Creator not found for order:', orderId);
    return;
  }

  logger.info('✅ Payment success:', orderId);

  const processed = await db.transaction(async (tx) => {
    const [completedOrder] = await tx
      .update(orders)
      .set({
        status: ORDER_STATUS.COMPLETED,
        rentExpiresAt,
        updatedAt: new Date(),
      })
      .where(
        and(eq(orders.id, orderId), ne(orders.status, ORDER_STATUS.COMPLETED)),
      )
      .returning({ id: orders.id });

    if (!completedOrder) {
      return false;
    }

    await tx.insert(payments).values({
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

    await tx.insert(userContentAccess).values({
      id: randomUUID(),
      orderId: orderId,
      userId: orderInfo.userId,
      mediaFileId: orderInfo.mediaFileId || null,
      collectionId: orderInfo.collectionId || null,
      accessType:
        orderInfo.itemType === ORDER_TYPES.PURCHASE
          ? ACCRESS_TYPES.PURCHASED
          : ACCRESS_TYPES.RENTED,
      rentExpiresAt,
    } as any);

    await addWallet(creatorId, resolvedAmount, currency);

    return true;
  });

  if (!processed) {
    logger.info('ℹ️ Order already processed, skipping duplicate webhook:', {
      orderId,
    });
    return;
  }

  await sendReceiptService(orderId);

  const existingCard = await db.query.userCardInfo.findFirst({
    where: and(
      eq(userCardInfo.userId, orderInfo.userId),
      eq(userCardInfo.paymentMethodId, paymentMethodId),
    ),
  });

  if (!existingCard) {
    const firstCard = await db.query.userCardInfo.findFirst({
      where: eq(userCardInfo.userId, orderInfo.userId),
    });

    await db.insert(userCardInfo).values({
      id: randomUUID(),
      userId: orderInfo.userId,
      paymentMethodId,
      cardNo: paymentMethodDisplayText,
      expireDate: paymentMethodExpiry,
      cardType: paymentMethodSubType,
      ePaySubscriptionId: subscriptionId || '',
      isDefault: !firstCard,
    });
  }
}
