import { db } from 'src/database/db';
import { refreshPendingPayoutFees } from 'src/modules/payout/services/refreshPendingPayoutFees.service';
jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), transaction: jest.fn() },
}));

function query(result: unknown[]) {
  const q = {
    from: () => q,
    where: () => q,
    limit: () => q,
    for: () => q,
    innerJoin: () => q,
    leftJoin: () => q,
    orderBy: () => q,
    then: (resolve: (value: unknown[]) => unknown) =>
      Promise.resolve(result).then(resolve),
  };
  return q;
}
const request = {
  id: 'r',
  payoutId: 'p',
  creatorId: 'demo',
  status: 'pending',
  currency: 'DKK',
  rawAmount: '1425',
  feeBreakdown: null,
};
function setup(rows: unknown[][]) {
  jest.mocked(db.select).mockReturnValue(query([{ id: 'r' }]) as any);
  const writes: { table: unknown; values: any }[] = [];
  const tx = {
    select: jest.fn(() => query(rows.shift() ?? [])),
    update: jest.fn((table) => ({
      set: (values: unknown) => {
        writes.push({ table, values });
        return { where: async () => [] };
      },
    })),
  };
  jest.mocked(db.transaction).mockImplementation(async (fn: any) => fn(tx));
  return { tx, writes };
}
beforeEach(() => jest.clearAllMocks());
it('repairs the existing pending request and payout together without debiting the wallet', async () => {
  const { writes, tx } = setup([
    [request],
    [{ ...request, id: 'p', amount: '1330.50' }],
    [{ amount: '1425' }],
    [
      {
        price: '129',
        fixedPlatformFee: 9,
        transactionFeePct: 6,
        platformFeePct: null,
      },
    ],
    [...Array.from({ length: 15 }, () => ({ price: '90' })), { price: '75' }],
    [{ amount: '1425' }],
  ]);
  await refreshPendingPayoutFees('demo');
  expect(writes).toHaveLength(2);
  expect(writes[0].values).toMatchObject({
    platformFee: '144.00',
    processingFee: '85.50',
    payableAmount: '1195.50',
    feeBreakdown: {
      saleCount: 16,
      fixedPlatformFee: 9,
      processingFeePercentage: 0.06,
    },
  });
  expect(writes[1].values).toMatchObject({ amount: '1195.50' });
  expect(tx.update).toHaveBeenCalledTimes(2);
});
it.each(['completed', 'rejected'])(
  'does not alter a request that became %s',
  async (status) => {
    const { writes } = setup([[{ ...request, status }]]);
    await refreshPendingPayoutFees();
    expect(writes).toHaveLength(0);
  },
);
it('is idempotent when another reader has already repaired the pending request', async () => {
  const { writes } = setup([
    [{ ...request, feeBreakdown: { calculationVersion: 2, saleCount: 16 } }],
  ]);
  await refreshPendingPayoutFees();
  expect(writes).toHaveLength(0);
});
it('refuses an inconsistent linked payout before any writes', async () => {
  const { writes } = setup([
    [request],
    [{ ...request, creatorId: 'someone-else' }],
  ]);
  await expect(refreshPendingPayoutFees()).rejects.toThrow('does not match');
  expect(writes).toHaveLength(0);
});
it('does not invent sale counts when the imported amount cannot be reconciled', async () => {
  const { writes } = setup([
    [request],
    [request],
    [{ amount: '1425' }],
    [{ price: '129', fixedPlatformFee: 9 }],
    [{ price: '100' }],
    [{ amount: '1425' }],
  ]);
  await expect(refreshPendingPayoutFees()).rejects.toThrow(
    'exceeds verified payment credits',
  );
  expect(writes).toHaveLength(0);
});

it('keeps unresolvable requests readable without displaying stale amounts', async () => {
  setup([[request], [{ ...request, creatorId: 'someone-else' }]]);
  await expect(
    refreshPendingPayoutFees(undefined, undefined, false),
  ).resolves.toEqual({ r: 'Pending payout does not match its request' });
});

it('upgrades a previous fee snapshot using the saved rates rather than replacing its contract', async () => {
  const { writes, tx } = setup([
    [
      {
        ...request,
        feeBreakdown: {
          saleCount: 1,
          fixedPlatformFee: 9,
          platformFeePercentage: 0,
          processingFeePercentage: 0.06,
        },
      },
    ],
    [{ ...request, id: 'p', amount: '1330.50' }],
    [{ amount: '1425' }],
    [
      ...Array.from({ length: 15 }, () => ({
        price: '90',
        itemType: 'purchase',
      })),
      { price: '75', itemType: 'rental' },
    ],
    [{ amount: '1425' }],
  ]);
  await refreshPendingPayoutFees('demo');
  expect(tx.select).toHaveBeenCalledTimes(5);
  expect(writes[0].values).toMatchObject({
    platformFee: '144.00',
    processingFee: '85.50',
    payableAmount: '1195.50',
    feeBreakdown: {
      calculationVersion: 2,
      saleCount: 16,
      purchases: 15,
      rentals: 1,
      fixedPlatformFee: 9,
      processingFeePercentage: 0.06,
    },
  });
});
