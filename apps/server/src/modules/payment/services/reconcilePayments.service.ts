import { and, desc, eq, gte, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { payments } from 'src/database/schema';
import { ORDER_STATUS } from 'src/utils/constant';
import {
  EpayTransactionResponse,
  findEpayTransactionsByReference,
  getEpayTransaction,
} from '../services/epayTransaction.service';
import {
  fulfillOrderPayment,
  validateTransactionForOrder,
} from '../hooks/paymentWebhook';

export type PaymentReconciliationMismatch = {
  type:
    | 'provider_captured_db_not_completed'
    | 'completed_payment_missing'
    | 'db_completed_provider_not_captured'
    | 'provider_transaction_not_found'
    | 'duplicate_provider_transactions'
    | 'multiple_completed_payments';
  orderId: string;
  orderStatus: string;
  transactionIds: string[];
  paymentIds: string[];
  providerCaptured: boolean;
  message: string;
  applied: boolean;
};

export type PaymentReconciliationResult = {
  checkedOrders: number;
  mismatches: PaymentReconciliationMismatch[];
  applied: number;
};

const isProviderCaptured = (transaction: EpayTransactionResponse) =>
  Number(transaction.aggregates?.captured ?? 0) > 0 ||
  transaction.operations?.some(
    (operation) => operation.type === 'SALE' && operation.state === 'SUCCESS',
  ) === true;

const uniqueTransactions = (
  transactions: EpayTransactionResponse[],
): EpayTransactionResponse[] => {
  const byId = new Map<string, EpayTransactionResponse>();

  for (const transaction of transactions) {
    if (transaction.transaction?.id) {
      byId.set(transaction.transaction.id, transaction);
    }
  }

  return [...byId.values()];
};

const loadProviderTransactions = async (
  orderId: string,
  orderPayments: (typeof payments.$inferSelect)[],
) => {
  const transactions: EpayTransactionResponse[] = [];
  const seenIds = new Set<string>();

  for (const payment of orderPayments) {
    const reference = payment.providerReference;

    if (!reference || reference === orderId || seenIds.has(reference)) continue;

    seenIds.add(reference);
    const transaction = await getEpayTransaction(reference);

    if (transaction) transactions.push(transaction);
  }

  const referenceTransactions = await findEpayTransactionsByReference(orderId);

  return uniqueTransactions([...transactions, ...referenceTransactions]);
};

const applyCapturedTransaction = async (
  orderInfo: typeof orders.$inferSelect,
  transaction: EpayTransactionResponse,
) => {
  const transactionData = transaction.transaction;

  if (!transactionData?.id) return false;

  if (!validateTransactionForOrder(orderInfo, transactionData)) {
    return false;
  }

  const [before] = await db
    .select({ status: payments.status })
    .from(payments)
    .where(eq(payments.providerReference, transactionData.id))
    .limit(1);

  const fulfilled = await fulfillOrderPayment(orderInfo, transactionData);

  if (fulfilled) return true;

  const [after] = await db
    .select({ status: payments.status })
    .from(payments)
    .where(eq(payments.providerReference, transactionData.id))
    .limit(1);

  return after?.status === 'completed' && before?.status !== 'completed';
};

export const reconcileOrderPayment = async (
  orderId: string,
  options: { apply?: boolean } = {},
): Promise<PaymentReconciliationMismatch[]> => {
  const [orderInfo] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!orderInfo) {
    return [];
  }

  const orderPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, orderId));

  const providerTransactions = await loadProviderTransactions(
    orderId,
    orderPayments,
  );
  const capturedTransactions = providerTransactions.filter(isProviderCaptured);

  const completedPayments = orderPayments.filter(
    (payment) =>
      payment.status === 'completed' || payment.status === 'refunded',
  );
  const completedOnlyPayments = orderPayments.filter(
    (payment) => payment.status === 'completed',
  );

  const mismatches: PaymentReconciliationMismatch[] = [];
  const transactionIds = capturedTransactions
    .map((transaction) => transaction.transaction?.id)
    .filter((id): id is string => Boolean(id));
  const paymentIds = completedPayments.map((payment) => payment.id);
  const canApplyCapturedTransaction =
    Boolean(options.apply) &&
    capturedTransactions.length === 1 &&
    completedOnlyPayments.length <= 1 &&
    (orderInfo.status !== ORDER_STATUS.COMPLETED ||
      completedPayments.length === 0) &&
    orderInfo.status !== 'refunded';

  const applied = canApplyCapturedTransaction
    ? await applyCapturedTransaction(orderInfo, capturedTransactions[0])
    : false;

  if (capturedTransactions.length > 1) {
    mismatches.push({
      type: 'duplicate_provider_transactions',
      orderId,
      orderStatus: orderInfo.status,
      transactionIds,
      paymentIds,
      providerCaptured: true,
      message: 'Multiple captured ePay transactions reference the same order',
      applied: false,
    });
  }

  if (completedOnlyPayments.length > 1) {
    mismatches.push({
      type: 'multiple_completed_payments',
      orderId,
      orderStatus: orderInfo.status,
      transactionIds,
      paymentIds,
      providerCaptured: capturedTransactions.length > 0,
      message: 'Multiple completed payment records exist for the same order',
      applied: false,
    });
  }

  if (capturedTransactions.length > 0) {
    if (
      orderInfo.status !== ORDER_STATUS.COMPLETED &&
      orderInfo.status !== 'refunded'
    ) {
      mismatches.push({
        type: 'provider_captured_db_not_completed',
        orderId,
        orderStatus: orderInfo.status,
        transactionIds,
        paymentIds,
        providerCaptured: true,
        message:
          'ePay reports a captured transaction but the order is not completed',
        applied,
      });
    }

    if (completedPayments.length === 0) {
      mismatches.push({
        type: 'completed_payment_missing',
        orderId,
        orderStatus: orderInfo.status,
        transactionIds,
        paymentIds,
        providerCaptured: true,
        message:
          'ePay reports a captured transaction but no completed payment exists',
        applied,
      });
    }
  }

  if (
    orderInfo.status === ORDER_STATUS.COMPLETED &&
    completedPayments.length === 0
  ) {
    if (!mismatches.some((item) => item.type === 'completed_payment_missing')) {
      mismatches.push({
        type: 'completed_payment_missing',
        orderId,
        orderStatus: orderInfo.status,
        transactionIds,
        paymentIds,
        providerCaptured: capturedTransactions.length > 0,
        message: 'Order is completed but has no completed payment record',
        applied,
      });
    }
  }

  if (completedOnlyPayments.length > 0 && capturedTransactions.length === 0) {
    const providerTransactionIds = new Set(
      providerTransactions
        .map((transaction) => transaction.transaction?.id)
        .filter((id): id is string => Boolean(id)),
    );

    const hasMissingProviderTransaction = completedOnlyPayments.some(
      (payment) => {
        if (!payment.providerReference) return true;
        if (payment.providerReference === orderId) return false;
        return !providerTransactionIds.has(payment.providerReference);
      },
    );

    if (providerTransactions.length === 0 || hasMissingProviderTransaction) {
      mismatches.push({
        type: 'provider_transaction_not_found',
        orderId,
        orderStatus: orderInfo.status,
        transactionIds,
        paymentIds,
        providerCaptured: false,
        message:
          'A completed payment exists but its ePay transaction was not found',
        applied: false,
      });
    } else {
      mismatches.push({
        type: 'db_completed_provider_not_captured',
        orderId,
        orderStatus: orderInfo.status,
        transactionIds,
        paymentIds,
        providerCaptured: false,
        message:
          'Database payment is completed but ePay does not report a capture',
        applied: false,
      });
    }
  }

  return mismatches;
};

export const reconcilePayments = async (options: {
  orderIds?: string[];
  since?: Date;
  limit?: number;
  apply?: boolean;
}): Promise<PaymentReconciliationResult> => {
  const since =
    options.since ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const limit = Math.min(Math.max(options.limit ?? 200, 1), 1000);

  const orderRows = options.orderIds?.length
    ? await db
        .select({ id: orders.id })
        .from(orders)
        .where(inArray(orders.id, options.orderIds))
        .limit(limit)
    : await db
        .select({ id: orders.id })
        .from(orders)
        .where(
          and(
            gte(orders.createdAt, since),
            inArray(orders.status, [
              ORDER_STATUS.PENDING,
              ORDER_STATUS.FAILED,
              ORDER_STATUS.COMPLETED,
              'refunded',
            ]),
          ),
        )
        .orderBy(desc(orders.createdAt))
        .limit(limit);

  const mismatches: PaymentReconciliationMismatch[] = [];

  for (const order of orderRows) {
    const orderMismatches = await reconcileOrderPayment(order.id, {
      apply: options.apply,
    });
    mismatches.push(...orderMismatches);
  }

  return {
    checkedOrders: orderRows.length,
    mismatches,
    applied: mismatches.filter((mismatch) => mismatch.applied).length,
  };
};
