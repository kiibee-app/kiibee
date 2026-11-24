jest.mock(
  'src/modules/payout/services/refreshPendingPayoutFees.service',
  () => ({ refreshPendingPayoutFees: jest.fn().mockResolvedValue(undefined) }),
);
import { db } from 'src/database/db';
import { approvePayoutRequestService } from 'src/modules/payout/services/approvePayoutRequest.service';
jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));
jest.mock('src/modules/payout/services/payoutInfo.service', () => ({
  payoutInfoService: jest.fn(),
}));
jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn(),
}));
jest.mock('src/logger/logger', () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));

function transactionWith(data: unknown[][]) {
  const select = jest.fn(() => {
    const result = data.shift();
    const query = {
      from: () => query,
      where: () => query,
      limit: () => query,
      for: () => query,
      leftJoin: () => query,
      orderBy: () => query,
      then: (resolve: (rows: unknown) => unknown) =>
        Promise.resolve(result).then(resolve),
    };
    return query;
  });
  const tx = { select, update: jest.fn() };
  jest.mocked(db.transaction).mockImplementation(async (fn: any) => fn(tx));
  return tx;
}
it('requires old pending requests to be recreated with reviewed fees', async () => {
  const tx = transactionWith([
    [{ creatorId: 'c', status: 'pending', payoutId: 'p' }],
    [{ creatorId: 'c', status: 'pending', rawAmount: '900' }],
    [{ amount: '900' }],
  ]);
  await expect(approvePayoutRequestService('r')).rejects.toThrow(
    'old fee calculation',
  );
  expect(tx.update).not.toHaveBeenCalled();
});
it('refuses a stale per-sale fee before changing the wallet', async () => {
  const tx = transactionWith([
    [
      {
        creatorId: 'c',
        status: 'pending',
        payoutId: 'p',
        rawAmount: '900',
        currency: 'DKK',
        platformFee: '144',
        processingFee: '54',
        payableAmount: '702',
        feeBreakdown: {
          saleCount: 16,
          fixedPlatformFee: 9,
          processingFeePercentage: 0.06,
        },
      },
    ],
    [{ creatorId: 'c', status: 'pending', rawAmount: '900', amount: '702' }],
    [{ amount: '900' }],
    [{ price: '450' }, { price: '450' }],
    [{ amount: '0' }],
  ]);
  await expect(approvePayoutRequestService('r')).rejects.toThrow(
    'Sales changed',
  );
  expect(tx.update).not.toHaveBeenCalled();
});
