jest.mock('src/database/db', () => ({
  db: {
    transaction: jest.fn(),
  },
}));

import { db } from 'src/database/db';
import { orders } from 'src/database/schema';
import { findOrCreateCheckoutOrder } from 'src/modules/order/services/orderIdempotency';

const dbMock = db as any;

const existingOrder = {
  id: 'order-existing',
  userId: 'user-1',
  mediaFileId: 'content-1',
  collectionId: null,
  itemType: 'purchase',
  price: '99.00',
  currency: 'DKK',
  status: 'pending',
  idempotencyKey: 'checkout-key',
};

const newOrder = {
  id: 'order-new',
  userId: 'user-1',
  mediaFileId: 'content-1',
  collectionId: null,
  itemType: 'purchase' as const,
  price: '99.00',
  currency: 'DKK',
  status: 'pending' as const,
  idempotencyKey: 'checkout-key',
};

let selectResult: any[];
let inserted: any[];
let tx: any;

const createSelectChain = () => {
  const chain: any = {
    from: jest.fn(() => chain),
    where: jest.fn(() => chain),
    orderBy: jest.fn(() => chain),
    limit: jest.fn(() => Promise.resolve(selectResult)),
  };
  return chain;
};

const createInsertBuilder = () => {
  const result: any = Promise.resolve(undefined);
  result.returning = jest.fn().mockResolvedValue([newOrder]);
  return {
    values: jest.fn((values) => {
      inserted.push(values);
      return result;
    }),
  };
};

describe('findOrCreateCheckoutOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    selectResult = [];
    inserted = [];
    tx = {
      execute: jest.fn().mockResolvedValue(undefined),
      select: jest.fn(() => createSelectChain()),
      insert: jest.fn(() => createInsertBuilder()),
    };
    dbMock.transaction.mockImplementation(async (callback: any) =>
      callback(tx),
    );
  });

  it('reuses an order for a repeated idempotency key', async () => {
    selectResult = [existingOrder];

    const result = await findOrCreateCheckoutOrder(newOrder);

    expect(result).toEqual({ order: existingOrder, created: false });
    expect(tx.insert).not.toHaveBeenCalled();
  });

  it('reuses a recent pending order when the client has no idempotency key', async () => {
    selectResult = [existingOrder];

    const result = await findOrCreateCheckoutOrder({
      ...newOrder,
      idempotencyKey: null,
    });

    expect(result).toEqual({ order: existingOrder, created: false });
    expect(tx.insert).not.toHaveBeenCalled();
  });

  it('creates a new order when no matching checkout exists', async () => {
    const result = await findOrCreateCheckoutOrder(newOrder);

    expect(result).toEqual({ order: newOrder, created: true });
    expect(tx.insert).toHaveBeenCalledWith(orders);
    expect(inserted[0]).toMatchObject({
      idempotencyKey: 'checkout-key',
      userId: 'user-1',
    });
  });
});
