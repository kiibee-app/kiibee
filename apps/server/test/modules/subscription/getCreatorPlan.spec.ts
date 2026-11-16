import { db } from 'src/database/db';
import { getCreatorPlan } from 'src/modules/subscription/services/getCreatorPlan.service';
import { hasPaidSubscriptionPeriod } from 'src/modules/subscription/services/hasPaidSubscriptionPeriod';

jest.mock('src/database/db', () => ({ db: { select: jest.fn() } }));
jest.mock(
  'src/modules/subscription/services/expireManualPlans.service',
  () => ({ expireManualPlans: jest.fn() }),
);
jest.mock('src/modules/subscription/services/hasPaidSubscriptionPeriod');

function selectRows(rows: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    orderBy: () => query,
    limit: async () => rows,
    then: (resolve: (value: unknown[]) => unknown) =>
      Promise.resolve(rows).then(resolve),
  };
  return query as unknown as ReturnType<typeof db.select>;
}

describe('creator dashboard payment prompt', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each([true, false])(
    'hides stale payment flags for a free plan (assigned: %s)',
    async (assigned) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: true }]),
        )
        .mockReturnValueOnce(
          selectRows(assigned ? [{ planId: 'try', manuallyPaid: false }] : []),
        )
        .mockReturnValueOnce(
          selectRows([{ id: 'try', price: 0, isActive: true }]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [{ isPaidPlan: false, subscriptionUpgradeRequired: false }],
      });
      expect(hasPaidSubscriptionPeriod).not.toHaveBeenCalled();
    },
  );

  it('keeps the prompt for an unpaid admin-assigned paid plan', async () => {
    jest
      .mocked(db.select)
      .mockReturnValueOnce(selectRows([{ subscriptionUpgradeRequired: true }]))
      .mockReturnValueOnce(
        selectRows([{ planId: 'startup', manuallyPaid: false }]),
      )
      .mockReturnValueOnce(
        selectRows([{ id: 'startup', price: 99, isActive: true }]),
      );
    jest.mocked(hasPaidSubscriptionPeriod).mockResolvedValue(false);
    await expect(getCreatorPlan('creator')).resolves.toMatchObject({
      data: [{ isPaidPlan: true, subscriptionUpgradeRequired: true }],
    });
  });
});
