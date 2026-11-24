import { db } from 'src/database/db';
import { creatorPayouts } from 'src/database/schema';
import { getSettlementHistoryService } from 'src/modules/payout/services/getSettlementHistory.service';
import { refreshPendingPayoutFees } from 'src/modules/payout/services/refreshPendingPayoutFees.service';
jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
jest.mock(
  'src/modules/payout/services/refreshPendingPayoutFees.service',
  () => ({ refreshPendingPayoutFees: jest.fn().mockResolvedValue({}) }),
);
function query(result: unknown[]) {
  const q = {
    from: () => q,
    where: () => q,
    innerJoin: () => q,
    leftJoin: () => q,
    orderBy: async () => result,
  };
  return q;
}
it('returns the same repaired net payout to the creator web view', async () => {
  jest
    .mocked(db.select)
    .mockReturnValueOnce(
      query([
        {
          id: 'p',
          amount: '1195.50',
          grossAmount: '1425.00',
          platformFee: '144.00',
          processingFee: '85.50',
          feeBreakdown: {
            saleCount: 16,
            fixedPlatformFee: 9,
            processingFeePercentage: 0.06,
          },
          status: 'pending',
        },
      ]) as any,
    )
    .mockReturnValueOnce(query([]) as any);
  await expect(getSettlementHistoryService('demo')).resolves.toMatchObject({
    data: [
      {
        amount: '1195.50 kr.',
        grossAmount: '1425.00 kr.',
        platformFee: '144.00 kr.',
        processingFee: '85.50 kr.',
        saleCount: 16,
        status: 'Pending',
      },
    ],
  });
  expect(refreshPendingPayoutFees).toHaveBeenCalledWith(
    'demo',
    undefined,
    false,
  );
  expect(jest.mocked(db.select).mock.calls[0][0]).toMatchObject({
    amount: creatorPayouts.amount,
  });
});
