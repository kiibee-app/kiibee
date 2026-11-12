jest.mock('src/database/db', () => ({
  db: {
    transaction: jest.fn(),
  },
}));

import { PgDialect } from 'drizzle-orm/pg-core';
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
let where: jest.Mock;

const createSelectChain = () => {
  const chain: any = {
    from: jest.fn(() => chain),
    where: where.mockImplementation(() => chain),
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
    where = jest.fn();
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

  it('uses the same lock and lookup for omitted currency and the database default', async () => {
    const dialect = new PgDialect();
    await findOrCreateCheckoutOrder({ ...newOrder, idempotencyKey: null });
    const explicitLock = dialect.sqlToQuery(tx.execute.mock.calls[0][0]);
    const explicitLookup = dialect.sqlToQuery(where.mock.calls[0][0]);

    await findOrCreateCheckoutOrder({
      ...newOrder,
      idempotencyKey: null,
      currency: undefined,
    });

    expect(dialect.sqlToQuery(tx.execute.mock.calls[1][0])).toEqual(explicitLock);
    const defaultLookup = dialect.sqlToQuery(where.mock.calls[1][0]);
    expect(defaultLookup.sql).toEqual(explicitLookup.sql);
    // The time-window parameter changes between calls; currency must not.
    expect(defaultLookup.params.slice(0, 5)).toEqual(
      explicitLookup.params.slice(0, 5),
    );
    expect(defaultLookup.params[4]).toBe('DKK');
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
