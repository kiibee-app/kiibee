jest.mock('src/database/db', () => ({
  db: {
    select: jest.fn(),
  },
}));
jest.mock('src/modules/payment/services/epayTransaction.service', () => ({
  getEpayTransaction: jest.fn(),
  findEpayTransactionsByReference: jest.fn(),
  listEpayTransactions: jest.fn(),
}));
jest.mock('src/modules/payment/hooks/paymentWebhook', () => ({
  validateTransactionForOrder: jest.fn(() => true),
  fulfillOrderPayment: jest.fn(),
}));

import { db } from 'src/database/db';
import { orders, payments } from 'src/database/schema';
import {
  findEpayTransactionsByReference,
  getEpayTransaction,
} from 'src/modules/payment/services/epayTransaction.service';
import {
  fulfillOrderPayment,
  validateTransactionForOrder,
} from 'src/modules/payment/hooks/paymentWebhook';
import { reconcileOrderPayment } from 'src/modules/payment/services/reconcilePayments.service';

const dbMock = db as any;
const getEpayTransactionMock = getEpayTransaction as jest.MockedFunction<
  typeof getEpayTransaction
>;
const findEpayTransactionsByReferenceMock =
  findEpayTransactionsByReference as jest.MockedFunction<
    typeof findEpayTransactionsByReference
  >;
const fulfillOrderPaymentMock = fulfillOrderPayment as jest.MockedFunction<
  typeof fulfillOrderPayment
>;
const validateTransactionForOrderMock =
  validateTransactionForOrder as jest.MockedFunction<
    typeof validateTransactionForOrder
  >;

const order = {
  id: 'order-1',
  userId: 'user-1',
  mediaFileId: 'content-1',
  collectionId: null,
  itemType: 'purchase',
  price: '99.00',
  currency: 'DKK',
  status: 'failed',
};

const failedPayment = {
  id: 'payment-1',
  orderId: 'order-1',
  providerReference: 'txn-1',
  status: 'failed',
  amount: '99.00',
  currency: 'DKK',
};

const providerTransaction = {
  transaction: {
    id: 'txn-1',
    reference: 'order-1',
    amount: 9900,
    currency: 'DKK',
    state: 'SUCCESS',
  },
  aggregates: {
    captured: 9900,
    authorized: 9900,
  },
};

const createSelectChain = () => {
  let table: any;

  const chain: any = {
    from: jest.fn((value) => {
      table = value;
      return chain;
    }),
    where: jest.fn(() => chain),
    limit: jest.fn(() => {
      if (table === orders) return Promise.resolve([order]);
      if (table === payments) return Promise.resolve([failedPayment]);
      return Promise.resolve([]);
    }),
    then: (resolve: any, reject: any) => {
      const result =
        table === payments ? [failedPayment] : table === orders ? [order] : [];
      return Promise.resolve(result).then(resolve, reject);
    },
  };

  return chain;
};

describe('reconcileOrderPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dbMock.select.mockImplementation(() => createSelectChain());
    getEpayTransactionMock.mockResolvedValue(providerTransaction as any);
    findEpayTransactionsByReferenceMock.mockResolvedValue([
      providerTransaction as any,
    ]);
    validateTransactionForOrderMock.mockReturnValue(true);
    fulfillOrderPaymentMock.mockResolvedValue(true);
  });

  it('detects a provider capture that the database does not reflect', async () => {
    const mismatches = await reconcileOrderPayment('order-1');

    expect(mismatches).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'provider_captured_db_not_completed',
          orderId: 'order-1',
          providerCaptured: true,
          applied: false,
        }),
        expect.objectContaining({
          type: 'completed_payment_missing',
          orderId: 'order-1',
          applied: false,
        }),
      ]),
    );
    expect(fulfillOrderPaymentMock).not.toHaveBeenCalled();
  });

  it('applies a verified captured transaction only when requested', async () => {
    const mismatches = await reconcileOrderPayment('order-1', {
      apply: true,
    });

    expect(validateTransactionForOrderMock).toHaveBeenCalledWith(
      order,
      providerTransaction.transaction,
    );
    expect(fulfillOrderPaymentMock).toHaveBeenCalledTimes(1);
    expect(mismatches.some((mismatch) => mismatch.applied)).toBe(true);
  });

  it('does not apply changes when provider validation fails', async () => {
    validateTransactionForOrderMock.mockReturnValue(false);

    const mismatches = await reconcileOrderPayment('order-1', {
      apply: true,
    });

    expect(fulfillOrderPaymentMock).not.toHaveBeenCalled();
    expect(mismatches.every((mismatch) => !mismatch.applied)).toBe(true);
  });
});
