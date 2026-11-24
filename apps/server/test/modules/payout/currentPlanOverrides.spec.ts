import type { ExecutionContext } from '@nestjs/common';
import { db } from 'src/database/db';
import { CheckPlanLimit } from 'src/middleware/checkPlanLimit';
import { payoutCalculationService } from 'src/modules/payout/services/payoutCalculation.service';
import { ROLE } from 'src/utils/constant';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
function rows(data: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    leftJoin: () => query,
    orderBy: () => query,
    limit: async () => data,
    then: (resolve: (value: unknown[]) => unknown) =>
      Promise.resolve(data).then(resolve),
  };
  return query as unknown as ReturnType<typeof db.select>;
}
beforeEach(() => jest.clearAllMocks());
it.each(['draft', 'pending', 'paid', 'cancelled'])(
  'applies payout fee overrides on the current plan (%s)',
  async (state) => {
    jest
      .mocked(db.select)
      .mockReturnValueOnce(
        rows([
          {
            planId: 'startup',
            customSubscriptionStatus: state,
            customKiibeeCutDkk: 20,
            customTransactionFeePct: 2,
          },
        ]),
      )
      .mockReturnValueOnce(rows([{ amount: '1000', currency: 'DKK' }]))
      .mockReturnValueOnce(rows([{ price: 99 }]))
      .mockReturnValueOnce(rows([{ price: '1000' }]))
      .mockReturnValueOnce(rows([{ amount: '0' }]));
    await expect(payoutCalculationService('creator')).resolves.toMatchObject({
      data: { platformFee: 20, processingFee: 20, payableAmount: 960 },
    });
  },
);
it.each([0, 25])(
  'enforces the saved max files %s without custom payment',
  async (limit) => {
    jest
      .mocked(db.select)
      .mockReturnValueOnce(rows([{ role: ROLE.CREATOR }]))
      .mockReturnValueOnce(
        rows([
          {
            planId: 'startup',
            customMaxFiles: limit,
            customSubscriptionStatus: 'draft',
          },
        ]),
      )
      .mockReturnValueOnce(rows([{ maxFiles: 10 }]))
      .mockReturnValueOnce(rows([{ count: 10 }]));
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { userId: 'creator' } }),
      }),
    } as ExecutionContext;
    const result = new CheckPlanLimit().canActivate(context);
    if (limit === 0)
      await expect(result).rejects.toMatchObject({ status: 403 });
    else await expect(result).resolves.toBe(true);
  },
);
