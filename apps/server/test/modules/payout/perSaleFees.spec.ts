import { calculatePayoutFees } from 'src/utils/payoutFees';
import {
  countPayoutSales,
  calculateCreatorPayoutFees,
} from 'src/modules/payout/services/creatorPayoutFees';
import { db } from 'src/database/db';
jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));

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
it('retains configured percentage terms without querying sales', async () => {
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
  expect(db.select).not.toHaveBeenCalled();
});
