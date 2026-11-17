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
  it.each([
    { custom: {}, expected: false },
    { custom: { customPrice: 149, customMaxFiles: 25 }, expected: true },
    {
      custom: { customKiibeeCutDkk: 0, customTransactionFeePct: 0 },
      expected: true,
    },
  ])(
    'exposes a creator-only custom card when overrides exist: $expected',
    async ({ custom, expected }) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: false }]),
        )
        .mockReturnValueOnce(
          selectRows([{ planId: 'startup', manuallyPaid: false, ...custom }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              id: 'startup',
              name: 'Start-up',
              price: 99,
              maxFiles: 10,
              isActive: true,
            },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [
          {
            basePrice: 99,
            baseMaxFiles: 10,
            hasCustomOverrides: expected,
            price: 'customPrice' in custom ? 149 : 99,
            maxFiles: 'customMaxFiles' in custom ? 25 : 10,
          },
        ],
      });
    },
  );
  it.each([
    { state: undefined, revision: 0, visible: false },
    { state: 'draft', revision: 0, visible: false },
    { state: 'draft', revision: 1, visible: true },
    { state: 'paid', revision: 0, visible: false },
    { state: 'cancelled', revision: 1, visible: false },
    { state: 'pending', revision: 1, visible: true },
    { state: 'paid', revision: 1, visible: true },
  ])(
    'shows custom card only for an activated offer ($state/$revision)',
    async ({ state, revision, visible }) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: false }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              planId: 'startup',
              manuallyPaid: false,
              paymentPeriod: '1',
              customPrice: 99,
              customSubscriptionStatus: state,
              customSubscriptionRevision: revision,
            },
          ]),
        )
        .mockReturnValueOnce(
          selectRows([
            { id: 'startup', price: 99, maxFiles: 10, isActive: true },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [{ hasCustomPlanOffer: visible }],
      });
    },
  );
  it.each(['draft', 'pending', 'paid'])(
    'shows the sole six-month offer for %s',
    async (state) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: false }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              planId: 'startup',
              manuallyPaid: false,
              customPrice6: 600,
              paymentPeriod: '1',
              customSubscriptionStatus: state,
              customSubscriptionRevision: 1,
            },
          ]),
        )
        .mockReturnValueOnce(
          selectRows([
            { id: 'startup', price: 99, maxFiles: 10, isActive: true },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [{ billingOptions: [{ months: 6, amount: 600 }] }],
      });
    },
  );
  it.each(['draft', 'pending', 'paid'])(
    'hides an empty saved offer with a stale six-month interval (%s)',
    async (state) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: false }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              planId: 'startup',
              manuallyPaid: false,
              paymentPeriod: '6',
              customSubscriptionStatus: state,
              customSubscriptionRevision: 3,
            },
          ]),
        )
        .mockReturnValueOnce(
          selectRows([
            { id: 'startup', price: 99, maxFiles: 10, isActive: true },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [
          { hasCustomPlanOffer: false, subscriptionUpgradeRequired: false },
        ],
      });
    },
  );
  it.each(['draft', 'paid'])(
    'applies only operational overrides without a custom payment card (%s)',
    async (state) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: false }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              planId: 'startup',
              manuallyPaid: false,
              customMaxFiles: 25,
              customKiibeeCutDkk: 0,
              customTransactionFeePct: 2,
              paymentPeriod: '1',
              customSubscriptionStatus: state,
              customSubscriptionRevision: 3,
            },
          ]),
        )
        .mockReturnValueOnce(
          selectRows([
            { id: 'startup', price: 99, maxFiles: 10, isActive: true },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [
          {
            hasCustomPlanOffer: false,
            subscriptionUpgradeRequired: false,
            price: 99,
            maxFiles: 25,
            customKiibeeCutDkk: 0,
            customTransactionFeePct: 2,
          },
        ],
      });
    },
  );
});
