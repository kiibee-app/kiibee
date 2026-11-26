import { CUSTOM_PLAN_ID } from 'src/modules/subscription/services/customPlan';
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
      custom: { customKiibeeCutPct: 0, customTransactionFeePct: 0 },
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
              customKiibeeCutPct: 0,
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
            customKiibeeCutPct: 0,
            customTransactionFeePct: 2,
          },
        ],
      });
    },
  );
});

import { subscriptionTerms } from 'src/modules/subscription/services/subscriptionTerms';
describe('paid custom offers based on Try Kiibee', () => {
  it.each([
    { customPrice: 100, paymentPeriod: '1', months: 1, amount: 100 },
    { customPrice6: 600, paymentPeriod: '6', months: 6, amount: 600 },
  ])(
    'uses the custom amount for a zero-price base: $amount',
    ({ months, amount, ...overrides }) => {
      expect(subscriptionTerms(0, overrides)).toMatchObject({
        months,
        subtotal: amount,
        amount: amount * 1.25,
        minorAmount: amount * 125,
        billingOptions: [{ months, amount }],
      });
    },
  );
  it('keeps the unmodified free plan free', () => {
    expect(subscriptionTerms(0)).toMatchObject({ amount: 0, minorAmount: 0 });
  });
  it.each(['draft', 'pending', 'paid'])(
    'returns 100 DKK for the custom card and email calculation (%s)',
    async (state) => {
      jest.mocked(db.select).mockReset();
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: state === 'pending' }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              planId: 'try',
              customPrice: 100,
              paymentPeriod: '1',
              customSubscriptionRevision: 1,
              customSubscriptionStatus: state,
            },
          ]),
        )
        .mockReturnValueOnce(
          selectRows([
            { id: 'try', name: 'Try Kiibee', price: 0, isActive: true },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [
          {
            basePrice: 0,
            price: 100,
            isPaidPlan: true,
            hasCustomPlanOffer: true,
            billingOptions: [{ months: 1, amount: 100 }],
          },
        ],
      });
    },
  );
});

describe('independent custom plan display', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each(['draft', 'pending', 'paid'])(
    'keeps custom price and offer visible in %s state',
    async (state) => {
      jest
        .mocked(db.select)
        .mockReturnValueOnce(
          selectRows([{ subscriptionUpgradeRequired: false }]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              planId: CUSTOM_PLAN_ID,
              customPrice: 175,
              customMaxFiles: 40,
              customKiibeeCutPct: 15,
              customTransactionFeePct: 2,
              customSubscriptionStatus: state,
              customSubscriptionRevision: 1,
            },
          ]),
        )
        .mockReturnValueOnce(
          selectRows([
            {
              id: CUSTOM_PLAN_ID,
              name: 'Custom',
              price: 0,
              maxFiles: 0,
              isActive: false,
            },
          ]),
        );
      await expect(getCreatorPlan('creator')).resolves.toMatchObject({
        data: [
          {
            name: 'Custom',
            price: 175,
            maxFiles: 40,
            hasCustomPlanOffer: true,
            isPaidPlan: true,
            subscriptionUpgradeRequired: state === 'pending',
            isActive: state !== 'pending',
          },
        ],
      });
    },
  );
});
