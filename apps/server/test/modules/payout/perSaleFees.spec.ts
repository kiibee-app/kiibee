import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { calculatePayoutFees } from 'src/utils/payoutFees';
import {
  countPayoutSales,
  calculateCreatorPayoutFees,
} from 'src/modules/payout/services/creatorPayoutFees';
import { getCreatorPayoutSaleSummary } from 'src/modules/payout/services/creatorPayoutFees';
import { db } from 'src/database/db';
jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
beforeEach(() => jest.resetAllMocks());

it('matches the old statement: 16 sales × 9 DKK, plus 6% of 900 DKK', () => {
  expect(
    calculatePayoutFees({
      amount: 900,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
      saleCount: 16,
    }),
  ).toMatchObject({
    platformFee: 144,
    processingFee: 54,
    payableAmount: 702,
    saleCount: 16,
  });
});
it('does not treat the per-sale fee as a single payout fee', () => {
  expect(
    calculatePayoutFees({
      amount: 1425,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
      saleCount: 16,
    }),
  ).toMatchObject({
    platformFee: 144,
    processingFee: 85.5,
    payableAmount: 1195.5,
  });
});
it('rejects an unverified sale count', () => {
  for (const saleCount of [undefined, 0, -1, 1.5, NaN])
    expect(() =>
      calculatePayoutFees({
        amount: 900,
        basePlanPrice: 0,
        fixedPlatformFee: 9,
        saleCount,
      }),
    ).toThrow();
});
it('excludes previously paid sales and supports different sale prices', () => {
  expect(countPayoutSales([100, 200, 50, 75], 300, 125)).toBe(2);
  expect(countPayoutSales([100, 200, 50, 75], 0, 300)).toBe(2);
});
it('does not guess sale counts for partial sales or unmatched imported balances', () => {
  expect(() => countPayoutSales([100, 200], 50, 250)).toThrow();
  expect(() => countPayoutSales([100, 200], 0, 150)).toThrow();
  expect(() => countPayoutSales([100], 0, 200)).toThrow();
});
it('retains configured percentage terms and reports the payout sale count', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(feeRows([{ price: '1000', itemType: 'purchase' }]))
    .mockReturnValueOnce(feeRows([{ amount: '1000' }]));
  await expect(
    calculateCreatorPayoutFees('creator', {
      amount: 1000,
      basePlanPrice: 0,
      platformFeePct: 20,
      transactionFeePct: 2,
      fixedPlatformFee: 9,
    }),
  ).resolves.toMatchObject({
    platformFee: 200,
    processingFee: 20,
    payableAmount: 780,
  });
  expect(db.select).toHaveBeenCalledTimes(2);
});

function feeRows(data: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    leftJoin: () => query,
    orderBy: () => query,
    limit: () => query,
    then: (resolve: (value: unknown[]) => unknown) =>
      Promise.resolve(data).then(resolve),
  };
  return query as unknown as ReturnType<typeof db.select>;
}

it('uses captured payment amounts to reconcile the same credits as the wallet', async () => {
  jest.mocked(db.select).mockClear();
  jest
    .mocked(db.select)
    .mockReturnValueOnce(
      feeRows([
        ...Array.from({ length: 15 }, () => ({ price: '90.00' })),
        { price: '75.00' },
      ]),
    )
    .mockReturnValueOnce(feeRows([{ amount: '1425' }]));
  await expect(
    calculateCreatorPayoutFees('creator', {
      amount: 1425,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
      transactionFeePct: 6,
    }),
  ).resolves.toMatchObject({
    saleCount: 16,
    platformFee: 144,
    processingFee: 85.5,
    payableAmount: 1195.5,
  });
  // Verify the query's source, not just the arithmetic on mocked rows.
  const selection = jest.mocked(db.select).mock.calls[0][0] as {
    price: SQL;
  };
  const query = new PgDialect().sqlToQuery(selection.price);
  expect(query.sql).toContain('"payments"."amount"');
  expect(query.sql).not.toContain('"orders"."price"');
  expect(query.sql).toContain('limit 1');
  expect(query.sql).toContain('"payments"."order_id" = "orders"."id"');
});

it('does not guess a payment amount from the order price when a credit is missing', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(feeRows([{ price: null }]))
    .mockReturnValueOnce(feeRows([{ amount: '1425' }]));
  await expect(
    calculateCreatorPayoutFees('creator', {
      amount: 1425,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
    }),
  ).rejects.toThrow('missing its captured payment amount');
});

it('excludes free orders without charging a fee or blocking paid sales', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(
      feeRows([
        { price: null, orderPrice: '0' },
        { price: '1425.00', orderPrice: '1140.00' },
      ]),
    )
    .mockReturnValueOnce(feeRows([{ amount: '1425' }]));
  await expect(
    calculateCreatorPayoutFees('creator', {
      amount: 1425,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
      transactionFeePct: 6,
    }),
  ).resolves.toMatchObject({
    saleCount: 1,
    platformFee: 9,
    processingFee: 85.5,
    payableAmount: 1330.5,
  });
});

it('counts only the outstanding wallet credits, independent of imported payout gross totals', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(
      feeRows([
        { price: '999.00', itemType: 'purchase' },
        { price: '100.00', itemType: 'purchase' },
        { price: '200.00', itemType: 'rental' },
        { price: '166.00', itemType: 'rental' },
      ]),
    )
    .mockReturnValueOnce(feeRows([{ amount: '466.00' }]));
  await expect(getCreatorPayoutSaleSummary('creator')).resolves.toEqual({
    saleCount: 3,
    purchases: 1,
    rentals: 2,
  });
  const selection = jest.mocked(db.select).mock.calls[1][0];
  expect(selection).toHaveProperty('amount');
});
it('counts only the sales in a requested partial payout, not all unpaid sales', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(
      feeRows([
        { price: '90', itemType: 'purchase' },
        { price: '75', itemType: 'rental' },
        { price: '200', itemType: 'purchase' },
      ]),
    )
    .mockReturnValueOnce(feeRows([{ amount: '365' }]));
  await expect(
    getCreatorPayoutSaleSummary('creator', { amount: 165 }),
  ).resolves.toEqual({ saleCount: 2, purchases: 1, rentals: 1 });
});
it('reports zero unpaid sales when the wallet is empty', async () => {
  await expect(
    getCreatorPayoutSaleSummary('creator', { walletBalance: 0 }),
  ).resolves.toEqual({ saleCount: 0, purchases: 0, rentals: 0 });
  expect(db.select).not.toHaveBeenCalled();
});
it('does not invent a count for a manually adjusted balance without corresponding credits', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(feeRows([{ price: '30', itemType: 'purchase' }]))
    .mockReturnValueOnce(feeRows([{ amount: '1425' }]));
  await expect(getCreatorPayoutSaleSummary('creator')).rejects.toThrow(
    'exceeds verified payment credits',
  );
});

it('never charges the previous 16 settled sales again when the next 3 sales are paid out', async () => {
  const previousSales = [
    ...Array.from({ length: 8 }, () => ({ price: '90', itemType: 'purchase' })),
    ...Array.from({ length: 7 }, () => ({ price: '90', itemType: 'rental' })),
    { price: '75', itemType: 'rental' },
  ];
  jest
    .mocked(db.select)
    .mockReturnValueOnce(feeRows(previousSales))
    .mockReturnValueOnce(feeRows([{ amount: '1425' }]));
  await expect(
    calculateCreatorPayoutFees('creator', {
      amount: 1425,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
      transactionFeePct: 6,
    }),
  ).resolves.toMatchObject({
    saleCount: 16,
    purchases: 8,
    rentals: 8,
    platformFee: 144,
    payableAmount: 1195.5,
  });
  // Approval debits 1425 gross. Three subsequent captures replenish only 466.
  jest
    .mocked(db.select)
    .mockReturnValueOnce(
      feeRows([
        ...previousSales,
        { price: '100', itemType: 'purchase' },
        { price: '200', itemType: 'rental' },
        { price: '166', itemType: 'rental' },
      ]),
    )
    .mockReturnValueOnce(feeRows([{ amount: '466' }]));
  await expect(
    calculateCreatorPayoutFees('creator', {
      amount: 466,
      basePlanPrice: 0,
      fixedPlatformFee: 9,
      transactionFeePct: 6,
    }),
  ).resolves.toMatchObject({
    saleCount: 3,
    purchases: 1,
    rentals: 2,
    platformFee: 27,
    processingFee: 27.96,
    payableAmount: 411.04,
  });
});
