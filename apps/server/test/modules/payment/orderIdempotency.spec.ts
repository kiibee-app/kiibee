jest.mock('src/database/db', () => ({
  db: {
    transaction: jest.fn(),
  },
}));

import { HttpStatus } from '@nestjs/common';
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

  it('throws 409 Conflict when reused idempotency key has different price', async () => {
    selectResult = [existingOrder];

    await expect(
      findOrCreateCheckoutOrder({
        ...newOrder,
        price: '49.00',
      }),
    ).rejects.toMatchObject({
      status: HttpStatus.CONFLICT,
      message: 'Idempotency key was already used for a different request',
    });
  });

  it('throws 409 Conflict when reused idempotency key belongs to another user', async () => {
    selectResult = [existingOrder];

    await expect(
      findOrCreateCheckoutOrder({
        ...newOrder,
        userId: 'user-2',
      }),
    ).rejects.toMatchObject({
      status: HttpStatus.CONFLICT,
      message: 'Idempotency key was already used for a different request',
    });
  });

  it('throws 409 Conflict when reused idempotency key has different item or mediaFileId', async () => {
    selectResult = [existingOrder];

    await expect(
      findOrCreateCheckoutOrder({
        ...newOrder,
        mediaFileId: 'different-content',
      }),
    ).rejects.toMatchObject({
      status: HttpStatus.CONFLICT,
      message: 'Idempotency key was already used for a different request',
    });
  });
});

import { completeZeroOrder } from 'src/modules/order/services/completeZeroOrder';
describe('zero-price content and collection orders', () => {
  function setup(order: Record<string, unknown>, existing = false) {
    const select = jest
      .fn()
      .mockReturnValueOnce({
        from: () => ({ where: () => ({ for: async () => [order] }) }),
      })
      .mockReturnValueOnce({
        from: () => ({
          where: () => ({
            limit: async () => (existing ? [{ id: 'grant' }] : []),
          }),
        }),
      });
    const set = jest.fn().mockReturnValue({ where: async () => undefined });
    const values = jest
      .fn()
      .mockReturnValue({ onConflictDoNothing: async () => undefined });
    jest.mocked(db.transaction).mockImplementation(async (callback) =>
      callback({
        select,
        update: () => ({ set }),
        insert: () => ({ values }),
      } as never),
    );
    return { set, values };
  }
  beforeEach(() => jest.clearAllMocks());
  it.each([
    ['media', null],
    [null, 'collection'],
  ])(
    'completes and grants a zero-price purchase %s/%s',
    async (mediaFileId, collectionId) => {
      const { set, values } = setup({
        id: 'order',
        userId: 'viewer',
        price: '0',
        status: 'pending',
        itemType: 'purchase',
        mediaFileId,
        collectionId,
      });
      await expect(completeZeroOrder('order', 'viewer', null)).resolves.toEqual(
        { orderId: 'order', completed: true },
      );
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'completed' }),
      );
      expect(values).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaFileId,
          collectionId,
          accessType: 'purchased',
          rentExpiresAt: null,
        }),
      );
    },
  );
  it('does not duplicate a grant or extend an already completed rental', async () => {
    const { set, values } = setup(
      {
        id: 'order',
        userId: 'viewer',
        price: '0',
        status: 'completed',
        itemType: 'rental',
        rentExpiresAt: new Date('2030-01-01'),
      },
      true,
    );
    await completeZeroOrder('order', 'viewer', 48);
    expect(set).not.toHaveBeenCalled();
    expect(values).not.toHaveBeenCalled();
  });
  it.each([{ price: '10' }, { status: 'refunded' }, { userId: 'other' }])(
    'rejects an invalid zero-price checkout %j',
    async (changed) => {
      const { values } = setup({
        id: 'order',
        userId: 'viewer',
        price: '0',
        status: 'pending',
        itemType: 'purchase',
        ...changed,
      });
      await expect(
        completeZeroOrder('order', 'viewer', null),
      ).rejects.toBeDefined();
      expect(values).not.toHaveBeenCalled();
    },
  );
});
