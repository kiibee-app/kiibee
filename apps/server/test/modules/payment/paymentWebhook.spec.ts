jest.mock('src/database/db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    transaction: jest.fn(),
    query: {
      userCardInfo: {
        findFirst: jest.fn(),
      },
    },
  },
}));
jest.mock('src/modules/payment/services/capturePayment.service', () => ({
  capturePayment: jest.fn(),
}));
jest.mock('src/modules/payment/services/epayTransaction.service', () => ({
  getEpayTransaction: jest.fn(),
  listEpayTransactions: jest.fn(),
  findEpayTransactionsByReference: jest.fn(),
}));
jest.mock('src/services/addWallet', () => ({
  addWallet: jest.fn(),
}));
jest.mock('src/modules/export/services/sendReceipt.service', () => ({
  sendReceiptService: jest.fn(),
}));
jest.mock('src/logger/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

import { db } from 'src/database/db';
import {
  collections,
  mediaFiles,
  orders,
  payments,
  userContentAccess,
} from 'src/database/schema';
import { capturePayment } from 'src/modules/payment/services/capturePayment.service';
import { getEpayTransaction } from 'src/modules/payment/services/epayTransaction.service';
import { addWallet } from 'src/services/addWallet';
import { sendReceiptService } from 'src/modules/export/services/sendReceipt.service';
import {
  handleEpayPayment,
  parseEpayWebhook,
  validateTransactionForOrder,
} from 'src/modules/payment/hooks/paymentWebhook';

const dbMock = db as any;
const captureMock = capturePayment as jest.MockedFunction<
  typeof capturePayment
>;
const getEpayTransactionMock = getEpayTransaction as jest.MockedFunction<
  typeof getEpayTransaction
>;
const addWalletMock = addWallet as jest.MockedFunction<typeof addWallet>;
const sendReceiptMock = sendReceiptService as jest.MockedFunction<
  typeof sendReceiptService
>;

type MutableState = {
  order: any;
  content: any;
  collection: any;
  access: any;
  paymentQueue: any[];
  inserted: { table: any; values: any }[];
  updated: { table: any; values: any }[];
};

let state: MutableState;

const createSelectChain = () => {
  let table: any;

  const chain: any = {
    from: jest.fn((value) => {
      table = value;
      return chain;
    }),
    where: jest.fn(() => chain),
    innerJoin: jest.fn(() => chain),
    orderBy: jest.fn(() => chain),
    limit: jest.fn(() => {
      if (table === orders) {
        return Promise.resolve(state.order ? [state.order] : []);
      }
      if (table === mediaFiles) {
        return Promise.resolve(state.content ? [state.content] : []);
      }
      if (table === collections) {
        return Promise.resolve(state.collection ? [state.collection] : []);
      }
      if (table === userContentAccess) {
        return Promise.resolve(state.access ? [state.access] : []);
      }
      if (table === payments) {
        return Promise.resolve(state.paymentQueue.shift() ?? []);
      }
      return Promise.resolve([]);
    }),
  };

  return chain;
};

const createInsertBuilder = (table: any) => {
  const result: any = Promise.resolve(undefined);
  result.returning = jest.fn().mockResolvedValue([{ id: 'created-id' }]);

  return {
    values: jest.fn((values) => {
      state.inserted.push({ table, values });
      return result;
    }),
  };
};

const createUpdateBuilder = (table: any) => {
  const builder: any = {
    values: undefined,
    set: jest.fn((values) => {
      builder.values = values;
      return builder;
    }),
    where: jest.fn(() => {
      state.updated.push({ table, values: builder.values });
      const result: any = Promise.resolve(undefined);
      result.returning = jest
        .fn()
        .mockResolvedValue([{ id: state.order?.id ?? 'order-1' }]);
      return result;
    }),
  };

  return builder;
};

const tx = {
  execute: jest.fn().mockResolvedValue(undefined),
  select: jest.fn(() => createSelectChain()),
  insert: jest.fn((table) => createInsertBuilder(table)),
  update: jest.fn((table) => createUpdateBuilder(table)),
};

const transaction = {
  id: 'txn-1',
  reference: 'order-1',
  amount: 9900,
  currency: 'DKK',
  state: 'SUCCESS',
  paymentMethodType: 'CARD',
};

const buildOrder = (overrides: Record<string, any> = {}) => ({
  id: 'order-1',
  userId: 'user-1',
  mediaFileId: 'content-1',
  collectionId: null,
  itemType: 'purchase',
  price: '99.00',
  currency: 'DKK',
  status: 'pending',
  ...overrides,
});

describe('handleEpayPayment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    state = {
      order: buildOrder(),
      content: {
        id: 'content-1',
        creatorId: 'creator-1',
        rentDurationHours: 24,
      },
      collection: null,
      access: null,
      paymentQueue: [],
      inserted: [],
      updated: [],
    };

    dbMock.select.mockImplementation(() => createSelectChain());
    dbMock.insert.mockImplementation((table) => createInsertBuilder(table));
    dbMock.update.mockImplementation((table) => createUpdateBuilder(table));
    dbMock.transaction.mockImplementation(async (callback) => callback(tx));
    dbMock.query.userCardInfo.findFirst.mockResolvedValue(null);

    captureMock.mockResolvedValue({ success: true } as any);
    getEpayTransactionMock.mockResolvedValue({
      transaction: { ...transaction },
      aggregates: { captured: 9900, authorized: 9900 },
    } as any);
    addWalletMock.mockResolvedValue('99');
    sendReceiptMock.mockResolvedValue(undefined as any);
  });

  it('parses both top-level and data-wrapped transaction payloads', () => {
    expect(parseEpayWebhook({ transaction }).transaction).toEqual(transaction);
    expect(parseEpayWebhook({ data: { transaction } }).transaction).toEqual(
      transaction,
    );
  });

  it('successful authorization records an attempt without marking the order paid', async () => {
    await handleEpayPayment({
      event: 'transaction.authorized',
      data: {
        transaction,
        operation: {
          type: 'AUTHORIZATION',
          state: 'SUCCESS',
          transactionId: 'txn-1',
        },
      },
    });

    expect(captureMock).not.toHaveBeenCalled();
    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'completed',
      ),
    ).toBe(false);
    expect(
      state.inserted.some(
        (insert) =>
          insert.table === payments && insert.values.status === 'pending',
      ),
    ).toBe(true);
  });

  it('successful capture marks the order paid', async () => {
    state.paymentQueue = [[], [], [], []];
    getEpayTransactionMock
      .mockResolvedValueOnce({
        transaction: { ...transaction },
        aggregates: { captured: 0, authorized: 9900 },
      } as any)
      .mockResolvedValue({
        transaction: { ...transaction },
        aggregates: { captured: 9900, authorized: 9900 },
      } as any);

    await handleEpayPayment({ transaction });

    expect(captureMock).toHaveBeenCalledWith({
      transactionId: 'txn-1',
      amount: 9900,
      idempotencyKey: 'capture-txn-1',
    });
    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'completed',
      ),
    ).toBe(true);
    expect(
      state.inserted.some(
        (insert) =>
          insert.table === payments && insert.values.status === 'completed',
      ),
    ).toBe(true);
    expect(addWalletMock).toHaveBeenCalled();
  });

  it('failed capture does not mark the order paid', async () => {
    state.paymentQueue = [[], [], []];
    captureMock.mockResolvedValue({
      success: false,
      errorCode: 'DECLINED',
    } as any);
    getEpayTransactionMock.mockResolvedValue({
      transaction: { ...transaction, state: 'SUCCESS' },
      aggregates: { captured: 0, authorized: 9900 },
    } as any);

    await handleEpayPayment({ transaction });

    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'completed',
      ),
    ).toBe(false);
    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'failed',
      ),
    ).toBe(true);
    expect(addWalletMock).not.toHaveBeenCalled();
  });

  it('does not complete an order when capture is not confirmed by ePay', async () => {
    state.paymentQueue = [[], []];
    captureMock.mockResolvedValue({ success: true } as any);
    getEpayTransactionMock.mockResolvedValue({
      transaction: { ...transaction },
      aggregates: { captured: 0, authorized: 9900 },
    } as any);

    await handleEpayPayment({ transaction });

    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'completed',
      ),
    ).toBe(false);
    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'failed',
      ),
    ).toBe(false);
    expect(addWalletMock).not.toHaveBeenCalled();
  });

  it('ignores duplicate success webhooks for a completed order', async () => {
    state.order = buildOrder({ status: 'completed' });

    await handleEpayPayment({ transaction });

    expect(captureMock).not.toHaveBeenCalled();
    expect(state.inserted).toHaveLength(0);
    expect(state.updated).toHaveLength(0);
  });

  it('does not downgrade a completed order when a failed webhook arrives', async () => {
    state.order = buildOrder({ status: 'completed' });

    await handleEpayPayment({
      transaction: { ...transaction, state: 'FAILED' },
    });

    expect(getEpayTransactionMock).not.toHaveBeenCalled();
    expect(state.updated).toHaveLength(0);
  });

  it('recovers a captured payment instead of marking it failed', async () => {
    state.paymentQueue = [[], [], []];
    getEpayTransactionMock.mockResolvedValue({
      transaction: { ...transaction },
      aggregates: { captured: 9900, authorized: 9900 },
    } as any);

    await handleEpayPayment({
      transaction: { ...transaction, state: 'FAILED' },
    });

    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'completed',
      ),
    ).toBe(true);
    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'failed',
      ),
    ).toBe(false);
  });

  it('marks a pending order failed only when the provider confirms failure', async () => {
    state.paymentQueue = [[], []];
    getEpayTransactionMock.mockResolvedValue({
      transaction: { ...transaction, state: 'FAILED' },
      aggregates: { captured: 0 },
    } as any);

    await handleEpayPayment({
      transaction: { ...transaction, state: 'FAILED' },
    });

    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'failed',
      ),
    ).toBe(true);
  });

  it('updates order and payment state after a successful refund', async () => {
    state.order = buildOrder({ status: 'completed' });
    getEpayTransactionMock.mockResolvedValue({
      transaction: { ...transaction },
      aggregates: { captured: 9900, refunded: 9900 },
    } as any);

    await handleEpayPayment({
      event: 'transaction.refunded',
      data: {
        transaction,
        operation: {
          type: 'REFUND',
          state: 'SUCCESS',
          transactionId: 'txn-1',
          amount: 9900,
        },
      },
    });

    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'refunded',
      ),
    ).toBe(true);
    expect(
      state.updated.some(
        (update) =>
          update.table === payments && update.values.status === 'refunded',
      ),
    ).toBe(true);
  });

  it('marks a pending order failed after a successful void', async () => {
    state.paymentQueue = [[], []];

    await handleEpayPayment({
      event: 'transaction.voided',
      data: {
        transaction,
        operation: {
          type: 'VOID',
          state: 'SUCCESS',
          transactionId: 'txn-1',
        },
      },
    });

    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'failed',
      ),
    ).toBe(true);
  });

  it('does not mark order paid when transaction amount equals major-unit price (100 minor for 100 DKK order)', async () => {
    state.order = buildOrder({ price: '100' });
    const underpaidTxn = {
      ...transaction,
      reference: state.order.id,
      amount: 100,
    };

    await handleEpayPayment({ transaction: underpaidTxn });

    expect(captureMock).not.toHaveBeenCalled();
    expect(
      state.updated.some(
        (update) =>
          update.table === orders && update.values.status === 'completed',
      ),
    ).toBe(false);
  });
});

describe('validateTransactionForOrder', () => {
  it('rejects transaction amount equal to major-unit price (100 minor vs 100 DKK order price)', () => {
    const order = buildOrder({ price: '100' });
    const underpaidTransaction = {
      ...transaction,
      reference: order.id,
      amount: 100,
    };

    expect(
      validateTransactionForOrder(order as any, underpaidTransaction as any),
    ).toBe(false);
  });

  it('accepts transaction amount matching expected minor units (10000 minor for 100 DKK order price)', () => {
    const order = buildOrder({ price: '100' });
    const validTransaction = {
      ...transaction,
      reference: order.id,
      amount: 10000,
    };

    expect(
      validateTransactionForOrder(order as any, validTransaction as any),
    ).toBe(true);
  });
});
