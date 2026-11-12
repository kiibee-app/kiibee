import { randomUUID } from 'crypto';
import { and, eq, ne, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import {
  collections,
  mediaFiles,
  payments,
  userCardInfo,
  userContentAccess,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ACCRESS_TYPES, ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import { addWallet } from 'src/services/addWallet';
import { parseRentDurationToHours } from 'src/utils/rentDuration';
import { DEFAULT_RENT_DURATION_HOURS } from 'src/utils/downloadLimit';
import { sendReceiptService } from 'src/modules/export/services/sendReceipt.service';
import { capturePayment } from '../services/capturePayment.service';
import {
  EpayOperation,
  EpayTransaction,
  EpayTransactionResponse,
  getEpayTransaction,
} from '../services/epayTransaction.service';

const EPAY_STATE = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const;

const EPAY_OPERATION = {
  AUTHORIZATION: 'AUTHORIZATION',
  SALE: 'SALE',
  CAPTURE: 'CAPTURE',
  REFUND: 'REFUND',
  VOID: 'VOID',
} as const;

const DB_PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

const asObject = (value: unknown): any =>
  value && typeof value === 'object' ? value : undefined;

const looksLikeOperation = (value: any) =>
  Boolean(
    value &&
    typeof value === 'object' &&
    typeof value.transactionId === 'string' &&
    typeof value.type === 'string',
  );

export const parseEpayWebhook = (body: any) => {
  const data = asObject(body?.data);
  const event =
    body?.event ??
    data?.event ??
    (typeof body?.type === 'string' && body.type.includes('.')
      ? body.type
      : undefined) ??
    (typeof data?.type === 'string' && data.type.includes('.')
      ? data.type
      : undefined);

  let transaction = asObject(data?.transaction) ?? asObject(body?.transaction);

  if (!transaction && typeof data?.id === 'string') {
    transaction = data;
  }

  if (!transaction && typeof body?.id === 'string') {
    transaction = body;
  }

  const operation =
    asObject(data?.operation) ??
    asObject(body?.operation) ??
    (looksLikeOperation(data) ? data : undefined) ??
    (looksLikeOperation(body) ? body : undefined);

  return {
    event: typeof event === 'string' ? event : undefined,
    transaction: transaction as EpayTransaction | undefined,
    operation: operation as EpayOperation | undefined,
  };
};

const toMinorUnits = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.round(numberValue) : null;
};

const transactionAmountMinor = (transaction?: EpayTransaction | null) =>
  toMinorUnits(transaction?.amount);

const isCaptured = (
  providerTransaction: EpayTransactionResponse | null,
  expectedAmount: number,
) => {
  const captured = Number(providerTransaction?.aggregates?.captured ?? 0);

  if (captured >= expectedAmount) {
    return true;
  }

  return (
    providerTransaction?.transaction?.state === EPAY_STATE.SUCCESS &&
    providerTransaction?.transaction?.instantCapture === 'ON' &&
    captured > 0
  );
};

const lockKey = async (executor: any, key: string) => {
  await executor.execute(sql`select pg_advisory_xact_lock(hashtext(${key}))`);
};

const resolveTransaction = async (
  transaction?: EpayTransaction,
  operation?: EpayOperation,
): Promise<EpayTransaction | null> => {
  let resolved = transaction;

  if (!resolved && operation?.transactionId) {
    const providerTransaction = await getEpayTransaction(
      operation.transactionId,
    );
    resolved = providerTransaction?.transaction ?? {
      id: operation.transactionId,
      amount: operation.amount,
    };
  }

  if (!resolved?.id && operation?.transactionId) {
    resolved = { ...resolved, id: operation.transactionId };
  }

  if (
    resolved?.id &&
    (!resolved.reference || resolved.amount == null || !resolved.state)
  ) {
    const providerTransaction = await getEpayTransaction(resolved.id);
    if (providerTransaction?.transaction) {
      resolved = providerTransaction.transaction;
    }
  }

  return resolved ?? null;
};

const loadOrder = async (transaction: EpayTransaction) => {
  const orderId = transaction.reference;

  if (!orderId) {
    logger.error('Missing ePay transaction reference', {
      transactionId: transaction.id,
    });
    return null;
  }

  const [orderInfo] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!orderInfo) {
    logger.error('Order not found for ePay transaction', {
      orderId,
      transactionId: transaction.id,
    });
    return null;
  }

  return orderInfo;
};

export const validateTransactionForOrder = (
  orderInfo: typeof orders.$inferSelect,
  transaction: EpayTransaction,
) => {
  const amount = transactionAmountMinor(transaction);

  if (!transaction.id) {
    logger.error('Missing ePay transaction id', { orderId: orderInfo.id });
    return false;
  }

  if (transaction.reference !== orderInfo.id) {
    logger.error('ePay transaction reference does not match order', {
      orderId: orderInfo.id,
      reference: transaction.reference,
      transactionId: transaction.id,
    });
    return false;
  }

  if (amount == null || amount <= 0) {
    logger.error('Invalid ePay transaction amount', {
      orderId: orderInfo.id,
      transactionId: transaction.id,
      amount: transaction.amount,
    });
    return false;
  }

  const storedPrice = Number(orderInfo.price);
  const expectedMinor = Math.round(storedPrice * 100);
  const legacyMinor = Math.round(storedPrice);

  if (amount !== expectedMinor && amount !== legacyMinor) {
    logger.error('ePay transaction amount does not match order', {
      orderId: orderInfo.id,
      transactionId: transaction.id,
      amount,
      expectedMinor,
      legacyMinor,
    });
    return false;
  }

  if (
    transaction.currency &&
    transaction.currency.toUpperCase() !== orderInfo.currency.toUpperCase()
  ) {
    logger.error('ePay transaction currency does not match order', {
      orderId: orderInfo.id,
      transactionId: transaction.id,
      currency: transaction.currency,
      orderCurrency: orderInfo.currency,
    });
    return false;
  }

  return true;
};

const paymentCardFields = (transaction: EpayTransaction) => ({
  paymentMethod: transaction.paymentMethodType,
  cardNo: transaction.paymentMethodDisplayText,
  cardExpiry: transaction.paymentMethodExpiry,
  cardType: transaction.paymentMethodSubType,
});

const findPaymentByTransaction = async (
  executor: any,
  transactionId: string,
) => {
  const [payment] = await executor
    .select()
    .from(payments)
    .where(eq(payments.providerReference, transactionId))
    .limit(1);

  return payment;
};

const findCompletedPaymentForOrder = async (executor: any, orderId: string) => {
  const [payment] = await executor
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.orderId, orderId),
        eq(payments.status, DB_PAYMENT_STATUS.COMPLETED),
      ),
    )
    .limit(1);

  return payment;
};

const recordAuthorization = async (transaction: EpayTransaction) => {
  if (!transaction.id) return;

  const amount = transactionAmountMinor(transaction);
  if (amount == null || amount <= 0 || !transaction.reference) return;

  await db.transaction(async (tx) => {
    await lockKey(tx, `payment:${transaction.id}`);

    const existing = await findPaymentByTransaction(tx, transaction.id!);

    if (
      existing?.status === DB_PAYMENT_STATUS.COMPLETED ||
      existing?.status === DB_PAYMENT_STATUS.REFUNDED
    ) {
      return;
    }

    if (existing) {
      await tx
        .update(payments)
        .set({
          amount: String(amount / 100),
          currency: transaction.currency ?? 'DKK',
          status: DB_PAYMENT_STATUS.PENDING,
          ...paymentCardFields(transaction),
          updatedAt: new Date(),
        })
        .where(eq(payments.id, existing.id));
      return;
    }

    await tx.insert(payments).values({
      id: randomUUID(),
      orderId: transaction.reference!,
      provider: 'card',
      providerReference: transaction.id,
      amount: String(amount / 100),
      currency: transaction.currency ?? 'DKK',
      status: DB_PAYMENT_STATUS.PENDING,
      ...paymentCardFields(transaction),
    } as any);
  });
};

const markPaymentFailed = async (
  transaction: EpayTransaction,
  orderInfo: typeof orders.$inferSelect,
) => {
  if (!transaction.id) return;

  const amount = transactionAmountMinor(transaction);

  await db.transaction(async (tx) => {
    await lockKey(tx, `order:${orderInfo.id}`);

    const [currentOrder] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderInfo.id))
      .limit(1);

    if (
      !currentOrder ||
      currentOrder.status === ORDER_STATUS.COMPLETED ||
      currentOrder.status === 'refunded'
    ) {
      logger.info('Ignoring failure for completed or refunded order', {
        orderId: orderInfo.id,
        transactionId: transaction.id,
      });
      return;
    }

    const completedPayment = await findCompletedPaymentForOrder(
      tx,
      orderInfo.id,
    );

    if (completedPayment) {
      logger.info('Ignoring failure because a completed payment exists', {
        orderId: orderInfo.id,
        transactionId: transaction.id,
      });
      return;
    }

    const existingPayment = await findPaymentByTransaction(tx, transaction.id!);

    if (existingPayment) {
      await tx
        .update(payments)
        .set({
          status: DB_PAYMENT_STATUS.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, existingPayment.id));
    } else {
      await tx.insert(payments).values({
        id: randomUUID(),
        orderId: orderInfo.id,
        provider: 'card',
        providerReference: transaction.id,
        amount: String((amount ?? 0) / 100),
        currency: transaction.currency ?? orderInfo.currency,
        status: DB_PAYMENT_STATUS.FAILED,
        ...paymentCardFields(transaction),
      } as any);
    }

    await tx
      .update(orders)
      .set({
        status: ORDER_STATUS.FAILED,
        rentExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, orderInfo.id),
          ne(orders.status, ORDER_STATUS.COMPLETED),
          ne(orders.status, 'refunded'),
        ),
      );
  });
};

const ensureCompletedPayment = async (
  executor: any,
  orderInfo: typeof orders.$inferSelect,
  transaction: EpayTransaction,
) => {
  if (!transaction.id) return;

  const amount = transactionAmountMinor(transaction) ?? 0;
  const existing = await findPaymentByTransaction(executor, transaction.id);

  if (existing) {
    if (
      existing.status !== DB_PAYMENT_STATUS.COMPLETED &&
      existing.status !== DB_PAYMENT_STATUS.REFUNDED
    ) {
      await executor
        .update(payments)
        .set({
          status: DB_PAYMENT_STATUS.COMPLETED,
          paidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(payments.id, existing.id));
    }

    return;
  }

  const completedPayment = await findCompletedPaymentForOrder(
    executor,
    orderInfo.id,
  );

  if (completedPayment) return;

  await executor.insert(payments).values({
    id: randomUUID(),
    orderId: orderInfo.id,
    provider: 'card',
    providerReference: transaction.id,
    amount: String(amount / 100),
    currency: transaction.currency ?? orderInfo.currency,
    status: DB_PAYMENT_STATUS.COMPLETED,
    ...paymentCardFields(transaction),
    paidAt: new Date(),
  } as any);
};

const resolveOrderItem = async (orderInfo: typeof orders.$inferSelect) => {
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
    : (contentInfo?.rentDurationHours ?? DEFAULT_RENT_DURATION_HOURS);

  return {
    creatorId: isCollectionOrder
      ? collectionInfo?.creatorId
      : contentInfo?.creatorId,
    rentExpiresAt:
      orderInfo.itemType === ORDER_TYPES.RENTAL
        ? new Date(
            Date.now() +
              (rentDurationHours || DEFAULT_RENT_DURATION_HOURS) *
                60 *
                60 *
                1000,
          )
        : null,
  };
};

export const fulfillOrderPayment = async (
  orderInfo: typeof orders.$inferSelect,
  transaction: EpayTransaction,
) => {
  if (!transaction.id) return false;

  const amount = transactionAmountMinor(transaction) ?? 0;
  const { creatorId, rentExpiresAt } = await resolveOrderItem(orderInfo);

  if (!creatorId) {
    logger.error('Creator not found for order', {
      orderId: orderInfo.id,
      transactionId: transaction.id,
    });
    return false;
  }

  const processed = await db.transaction(async (tx) => {
    await lockKey(tx, `order:${orderInfo.id}`);

    const [currentOrder] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderInfo.id))
      .limit(1);

    if (!currentOrder) return false;

    if (currentOrder.status === ORDER_STATUS.COMPLETED) {
      await ensureCompletedPayment(tx, orderInfo, transaction);
      return false;
    }

    if (currentOrder.status === 'refunded') {
      return false;
    }

    const completedPayment = await findCompletedPaymentForOrder(
      tx,
      orderInfo.id,
    );

    const [completedOrder] = await tx
      .update(orders)
      .set({
        status: ORDER_STATUS.COMPLETED,
        rentExpiresAt,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, orderInfo.id),
          ne(orders.status, ORDER_STATUS.COMPLETED),
          ne(orders.status, 'refunded'),
        ),
      )
      .returning({ id: orders.id });

    if (!completedOrder) {
      await ensureCompletedPayment(tx, orderInfo, transaction);
      return false;
    }

    await ensureCompletedPayment(tx, orderInfo, transaction);

    const [existingAccess] = await tx
      .select({ id: userContentAccess.id })
      .from(userContentAccess)
      .where(eq(userContentAccess.orderId, orderInfo.id))
      .limit(1);

    if (!existingAccess) {
      await tx.insert(userContentAccess).values({
        id: randomUUID(),
        orderId: orderInfo.id,
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

    if (!completedPayment) {
      await addWallet(
        creatorId,
        amount / 100,
        transaction.currency ?? orderInfo.currency,
        tx,
      );
    }

    return true;
  });

  return processed;
};

const finalizeFulfillment = async (
  orderInfo: typeof orders.$inferSelect,
  transaction: EpayTransaction,
) => {
  try {
    await sendReceiptService(orderInfo.id);
  } catch (error) {
    logger.error('Error sending payment receipt', {
      orderId: orderInfo.id,
      transactionId: transaction.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  if (
    !transaction.paymentMethodId ||
    !transaction.paymentMethodDisplayText ||
    !transaction.paymentMethodExpiry ||
    !transaction.paymentMethodSubType
  ) {
    return;
  }

  const existingCard = await db.query.userCardInfo.findFirst({
    where: and(
      eq(userCardInfo.userId, orderInfo.userId),
      eq(userCardInfo.paymentMethodId, transaction.paymentMethodId),
    ),
  });

  if (existingCard) return;

  const firstCard = await db.query.userCardInfo.findFirst({
    where: eq(userCardInfo.userId, orderInfo.userId),
  });

  await db.insert(userCardInfo).values({
    id: randomUUID(),
    userId: orderInfo.userId,
    paymentMethodId: transaction.paymentMethodId,
    cardNo: transaction.paymentMethodDisplayText,
    expireDate: transaction.paymentMethodExpiry,
    cardType: transaction.paymentMethodSubType,
    ePaySubscriptionId: transaction.subscriptionId || '',
    isDefault: !firstCard,
  });
};

const handleTransactionSuccess = async (transaction: EpayTransaction) => {
  const resolved = await resolveTransaction(transaction);
  if (!resolved?.id) return;

  const orderInfo = await loadOrder(resolved);
  if (!orderInfo) return;

  if (
    orderInfo.status === ORDER_STATUS.COMPLETED ||
    orderInfo.status === 'refunded'
  ) {
    return;
  }

  if (!validateTransactionForOrder(orderInfo, resolved)) return;

  const amount = transactionAmountMinor(resolved) ?? 0;

  await recordAuthorization(resolved);

  let providerTransaction = await getEpayTransaction(resolved.id);

  if (isCaptured(providerTransaction, amount)) {
    const providerData = providerTransaction?.transaction ?? resolved;

    if (!validateTransactionForOrder(orderInfo, providerData)) return;

    const processed = await fulfillOrderPayment(orderInfo, providerData);

    if (processed) {
      logger.info('Payment was already captured and order completed', {
        orderId: orderInfo.id,
        transactionId: resolved.id,
      });
      await finalizeFulfillment(orderInfo, providerData);
    } else {
      logger.info('Payment success already processed', {
        orderId: orderInfo.id,
        transactionId: resolved.id,
      });
    }

    return;
  }

  let captureResult: any;

  try {
    captureResult = await capturePayment({
      transactionId: resolved.id,
      amount,
      idempotencyKey: `capture-${resolved.id}`,
    });
  } catch (error) {
    logger.error('Error capturing payment', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  providerTransaction = await getEpayTransaction(resolved.id);

  if (!isCaptured(providerTransaction, amount)) {
    if (captureResult?.success === false) {
      logger.error('Payment capture failed', {
        orderId: orderInfo.id,
        transactionId: resolved.id,
        errorCode: captureResult.errorCode,
      });
      await markPaymentFailed(resolved, orderInfo);
      return;
    }

    logger.warn('Capture not confirmed by ePay; leaving order pending', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
    });
    return;
  }

  const providerData = providerTransaction?.transaction ?? resolved;

  if (!validateTransactionForOrder(orderInfo, providerData)) return;

  const processed = await fulfillOrderPayment(orderInfo, providerData);

  if (processed) {
    logger.info('Payment captured and order completed', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
    });
    await finalizeFulfillment(orderInfo, providerData);
  } else {
    logger.info('Payment success already processed', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
    });
  }
};

const handleCaptureFailure = async (
  transaction: EpayTransaction,
  operation?: EpayOperation,
) => {
  const resolved = await resolveTransaction(transaction, operation);
  if (!resolved?.id) return;

  const orderInfo = await loadOrder(resolved);
  if (!orderInfo) return;

  if (
    orderInfo.status === ORDER_STATUS.COMPLETED ||
    orderInfo.status === 'refunded'
  ) {
    logger.info('Ignoring capture failure for completed order', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
    });
    return;
  }

  const amount = transactionAmountMinor(resolved) ?? 0;
  const providerTransaction = await getEpayTransaction(resolved.id);

  if (isCaptured(providerTransaction, amount)) {
    if (validateTransactionForOrder(orderInfo, resolved)) {
      const processed = await fulfillOrderPayment(orderInfo, resolved);
      if (processed) await finalizeFulfillment(orderInfo, resolved);
    }
    return;
  }

  await markPaymentFailed(resolved, orderInfo);
};

const handleTransactionFailed = async (transaction: EpayTransaction) => {
  const resolved = await resolveTransaction(transaction);
  if (!resolved?.id) return;

  const orderInfo = await loadOrder(resolved);
  if (!orderInfo) return;

  if (
    orderInfo.status === ORDER_STATUS.COMPLETED ||
    orderInfo.status === 'refunded'
  ) {
    logger.info('Ignoring failed webhook for completed or refunded order', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
      orderStatus: orderInfo.status,
    });
    return;
  }

  const providerTransaction = await getEpayTransaction(resolved.id);

  if (providerTransaction) {
    const providerData = providerTransaction.transaction ?? resolved;
    const amount = transactionAmountMinor(providerData) ?? 0;

    if (isCaptured(providerTransaction, amount)) {
      if (validateTransactionForOrder(orderInfo, providerData)) {
        const processed = await fulfillOrderPayment(orderInfo, providerData);
        if (processed) await finalizeFulfillment(orderInfo, providerData);
      }
      return;
    }

    if (providerData.state === EPAY_STATE.SUCCESS) {
      logger.info(
        'Payment is authorized but not captured; keeping order pending',
        {
          orderId: orderInfo.id,
          transactionId: resolved.id,
        },
      );
      await recordAuthorization(providerData);
      return;
    }

    if (
      providerData.state !== EPAY_STATE.FAILED &&
      providerData.state !== EPAY_STATE.EXPIRED
    ) {
      logger.info('Ignoring non-final failed webhook state', {
        orderId: orderInfo.id,
        transactionId: resolved.id,
        state: providerData.state,
      });
      return;
    }
  }

  await markPaymentFailed(resolved, orderInfo);
};

const handleRefundSuccess = async (
  transaction: EpayTransaction,
  operation: EpayOperation,
) => {
  const resolved = await resolveTransaction(transaction, operation);
  if (!resolved?.id) return;

  const orderInfo = await loadOrder(resolved);
  if (!orderInfo) return;

  const amount = transactionAmountMinor(resolved) ?? 0;
  const providerTransaction = await getEpayTransaction(resolved.id);
  const refundedAmount = Number(
    providerTransaction?.aggregates?.refunded ?? operation.amount ?? amount,
  );

  if (refundedAmount < amount) {
    logger.info('Ignoring partial refund for order status', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
      refundedAmount,
      amount,
    });
    return;
  }

  await db.transaction(async (tx) => {
    await lockKey(tx, `order:${orderInfo.id}`);

    await tx
      .update(orders)
      .set({
        status: 'refunded',
        updatedAt: new Date(),
      })
      .where(and(eq(orders.id, orderInfo.id), ne(orders.status, 'refunded')));

    await tx
      .update(payments)
      .set({
        status: DB_PAYMENT_STATUS.REFUNDED,
        refundedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(payments.orderId, orderInfo.id),
          eq(payments.status, DB_PAYMENT_STATUS.COMPLETED),
        ),
      );
  });
};

const handleVoidSuccess = async (
  transaction: EpayTransaction,
  operation: EpayOperation,
) => {
  const resolved = await resolveTransaction(transaction, operation);
  if (!resolved?.id) return;

  const orderInfo = await loadOrder(resolved);
  if (!orderInfo) return;

  if (
    orderInfo.status === ORDER_STATUS.COMPLETED ||
    orderInfo.status === 'refunded'
  ) {
    logger.info('Ignoring void for completed or refunded order', {
      orderId: orderInfo.id,
      transactionId: resolved.id,
      orderStatus: orderInfo.status,
    });
    return;
  }

  await markPaymentFailed(resolved, orderInfo);
};

const handleOperationEvent = async (
  operation: EpayOperation,
  transaction?: EpayTransaction,
) => {
  const resolved = await resolveTransaction(transaction, operation);
  if (!resolved?.id) return;

  const state = operation.state;
  const type = operation.type;

  if (state === EPAY_STATE.PROCESSING || state === EPAY_STATE.PENDING) {
    logger.info('Ignoring processing ePay operation', {
      transactionId: resolved.id,
      operationType: type,
      operationState: state,
    });
    return;
  }

  if (state === EPAY_STATE.SUCCESS) {
    if (type === EPAY_OPERATION.AUTHORIZATION) {
      const orderInfo = await loadOrder(resolved);
      if (!orderInfo) return;
      if (!validateTransactionForOrder(orderInfo, resolved)) return;
      await recordAuthorization(resolved);
      logger.info('Payment authorized', {
        orderId: orderInfo.id,
        transactionId: resolved.id,
      });
      return;
    }

    if (type === EPAY_OPERATION.CAPTURE || type === EPAY_OPERATION.SALE) {
      const orderInfo = await loadOrder(resolved);
      if (!orderInfo) return;

      if (
        orderInfo.status === ORDER_STATUS.COMPLETED ||
        orderInfo.status === 'refunded'
      ) {
        logger.info('Ignoring duplicate capture event', {
          orderId: orderInfo.id,
          transactionId: resolved.id,
          orderStatus: orderInfo.status,
        });
        return;
      }

      if (!validateTransactionForOrder(orderInfo, resolved)) return;

      const processed = await fulfillOrderPayment(orderInfo, resolved);
      if (processed) {
        logger.info('Payment captured and order completed', {
          orderId: orderInfo.id,
          transactionId: resolved.id,
        });
        await finalizeFulfillment(orderInfo, resolved);
      }
      return;
    }

    if (type === EPAY_OPERATION.REFUND) {
      await handleRefundSuccess(resolved, operation);
      return;
    }

    if (type === EPAY_OPERATION.VOID) {
      await handleVoidSuccess(resolved, operation);
      return;
    }
  }

  if (state === EPAY_STATE.FAILED) {
    if (type === EPAY_OPERATION.CAPTURE || type === EPAY_OPERATION.SALE) {
      await handleCaptureFailure(resolved, operation);
      return;
    }

    if (type === EPAY_OPERATION.AUTHORIZATION) {
      await handleTransactionFailed(resolved);
      return;
    }

    logger.info('Ignoring failed non-payment ePay operation', {
      transactionId: resolved.id,
      operationType: type,
      operationState: state,
    });
  }
};

const inferOperationFromEvent = (
  event: string,
  operation?: EpayOperation,
): EpayOperation | undefined => {
  if (operation) return operation;

  const eventName = event.toLowerCase();
  const state = eventName.includes('process')
    ? EPAY_STATE.PROCESSING
    : eventName.includes('failed') || eventName.includes('expired')
      ? EPAY_STATE.FAILED
      : EPAY_STATE.SUCCESS;

  if (eventName.includes('refund')) {
    return { type: EPAY_OPERATION.REFUND, state };
  }

  if (eventName.includes('void')) {
    return { type: EPAY_OPERATION.VOID, state };
  }

  if (eventName.includes('captur')) {
    return { type: EPAY_OPERATION.CAPTURE, state };
  }

  if (eventName.includes('authoriz')) {
    return { type: EPAY_OPERATION.AUTHORIZATION, state };
  }

  return undefined;
};

export async function handleEpayPayment(body: any) {
  const { event, transaction, operation } = parseEpayWebhook(body);

  if (event) {
    const eventName = event.toLowerCase();
    const inferredOperation = inferOperationFromEvent(event, operation);

    if (inferredOperation) {
      await handleOperationEvent(inferredOperation, transaction);
      return;
    }

    if (eventName.includes('failed') || eventName.includes('expired')) {
      if (!transaction) {
        logger.error('Missing transaction in failed ePay webhook', { event });
        return;
      }
      await handleTransactionFailed(transaction);
      return;
    }

    if (
      eventName.includes('success') ||
      eventName.includes('succeeded') ||
      eventName.includes('completed')
    ) {
      if (!transaction) {
        logger.error('Missing transaction in successful ePay webhook', {
          event,
        });
        return;
      }
      await handleTransactionSuccess(transaction);
      return;
    }
  }

  if (operation) {
    await handleOperationEvent(operation, transaction);
    return;
  }

  if (!transaction) {
    logger.error('Missing transaction in ePay webhook', {
      event,
      hasData: Boolean(body?.data),
      hasOperation: Boolean(operation),
    });
    return;
  }

  switch (transaction.state) {
    case EPAY_STATE.SUCCESS:
      await handleTransactionSuccess(transaction);
      return;
    case EPAY_STATE.FAILED:
    case EPAY_STATE.EXPIRED:
      await handleTransactionFailed(transaction);
      return;
    case EPAY_STATE.PENDING:
    case EPAY_STATE.PROCESSING:
      logger.info('Ignoring pending ePay transaction webhook', {
        transactionId: transaction.id,
        state: transaction.state,
      });
      return;
    default:
      logger.info('Ignoring unhandled ePay transaction state', {
        transactionId: transaction.id,
        state: transaction.state,
      });
  }
}
