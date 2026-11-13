import { db } from 'src/database/db';
import { hasPaidSubscriptionPeriod } from 'src/modules/subscription/services/hasPaidSubscriptionPeriod';
import { adminBillingRequests, users } from 'src/database/schema';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { adminUpdateCreatorPlan } from 'src/modules/subscription/services/adminUpdateCreatorPlan.service';

jest.mock('src/modules/subscription/services/hasPaidSubscriptionPeriod');
jest.mock(
  'src/modules/subscription/services/adminBillingRequest.service',
  () => ({ recordAdminBillingEmail: jest.fn().mockResolvedValue(undefined) }),
);
jest.mock('src/utils/sanitize', () => ({
  escapeHtml: (value: string) => value,
}));

jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), transaction: jest.fn() },
}));

jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn().mockResolvedValue(true),
}));

describe('adminUpdateCreatorPlan paid assignments', () => {
  const creatorId = 'creator-1';
  const input = {
    planId: 'startup',
    customPrice: null,
    customPrice3: null,
    customPrice6: null,
    customPrice12: null,
    customMaxFiles: null,
    customKiibeeCutDkk: null,
    customTransactionFeePct: null,
    paymentPeriod: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(['2026-02-30', 'not-a-date', '2099-01-01T12:00:00Z'])(
    'rejects invalid or time-based expiry %s',
    async (manualPaidExpiresAt) => {
      await expect(
        adminUpdateCreatorPlan(creatorId, {
          ...input,
          manuallyPaid: true,
          manualPaidExpiresAt,
        }),
      ).rejects.toMatchObject({ status: 400 });
      expect(db.transaction).not.toHaveBeenCalled();
    },
  );

  it.each([
    {
      previousPlanId: 'startup',
      previousPrice: 99,
      targetId: 'pro',
      targetPrice: 299,
      paymentRequired: true,
    },
    {
      previousPlanId: 'pro',
      previousPrice: 299,
      targetId: 'startup',
      targetPrice: 99,
      paymentRequired: true,
    },
    {
      previousPlanId: 'try',
      previousPrice: 0,
      targetId: 'pro',
      targetPrice: 299,
      paymentRequired: true,
    },
    {
      previousPlanId: 'startup',
      previousPrice: 99,
      previousManual: true,
      manuallyPaid: true,
      alreadyPaid: true,
      paymentRequired: false,
    },
    {
      previousPlanId: 'pro',
      previousPrice: 299,
      previousManual: true,
      manuallyPaid: true,
      alreadyPaid: true,
      paymentRequired: false,
    },
    {
      previousPlanId: 'pro',
      previousPrice: 299,
      targetPrice: 0,
      paymentRequired: false,
    },
    {
      previousPlanId: 'try',
      previousPrice: 0,
      manuallyPaid: true,
      alreadyPaid: true,
      previouslyRequired: true,
      paymentRequired: false,
    },
    {
      previousPlanId: 'startup',
      previousPrice: 99,
      manuallyPaid: false,
      paymentRequired: true,
    },
    {
      previousPlanId: 'startup',
      previousPrice: 99,
      targetPrice: 0,
      previouslyRequired: true,
      paymentRequired: false,
    },
    {
      previousPlanId: 'pro',
      previousPrice: 299,
      targetPrice: 0,
      previouslyRequired: true,
      paymentRequired: false,
    },
    {
      previousPlanId: 'try',
      previousPrice: 0,
      targetPrice: 0,
      previouslyRequired: true,
      paymentRequired: false,
    },
    { previousPlanId: 'try', previousPrice: 0, paymentRequired: true },
    { previousPrice: undefined, paymentRequired: true },
    {
      previousPlanId: 'other-paid-plan',
      previousPrice: 99,
      paymentRequired: true,
    },
    { previousPlanId: 'startup', previousPrice: 99, paymentRequired: false },
    {
      previousPlanId: 'pro',
      previousPrice: 299,
      alreadyPaid: true,
      paymentRequired: false,
    },
    {
      previousPlanId: 'startup',
      previousPrice: 99,
      alreadyPaid: true,
      previouslyRequired: true,
      paymentRequired: false,
    },
  ])(
    'sets payment required to $paymentRequired when assigning a paid plan from price $previousPlanId',
    async ({
      previousPlanId,
      previousPrice,
      previousManual = false,
      targetPrice = 99,
      targetId,
      manuallyPaid,
      alreadyPaid = false,
      previouslyRequired = false,
      paymentRequired,
    }) => {
      const targetPlanId =
        targetId ?? (targetPrice === 0 ? 'try' : input.planId);
      const targetName =
        targetPlanId === 'try'
          ? 'Try Kiibee'
          : targetPlanId === 'pro'
            ? 'Pro'
            : 'Start-up';
      jest.mocked(hasPaidSubscriptionPeriod).mockResolvedValue(alreadyPaid);
      jest.mocked(db.select).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: async () => [
              {
                id: targetPlanId,
                name: targetName,
                price: targetPrice,
              },
            ],
          }),
        }),
      } as unknown as ReturnType<typeof db.select>);

      const select = jest
        .fn()
        .mockReturnValueOnce({
          from: () => ({
            where: () => ({
              for: async () => [
                {
                  email: 'creator@example.com',
                  fullName: 'Test Creator',
                  subscriptionUpgradeRequired: previouslyRequired,
                },
              ],
            }),
          }),
        })
        .mockReturnValueOnce({
          from: () => ({
            innerJoin: () => ({
              where: () => ({
                orderBy: () => ({
                  limit: async () =>
                    previousPrice === undefined
                      ? []
                      : [
                          {
                            id: 'creator-plan',
                            manuallyPaid: previousManual,
                            planId: previousPlanId,
                            price: previousPrice,
                            name: previousPlanId,
                          },
                        ],
                }),
              }),
            }),
          }),
        });
      const setPaymentRequired = jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue(undefined),
      });
      const inserted = jest.fn().mockResolvedValue(undefined);
      const tx = {
        select,
        update: (table: unknown) => ({
          set:
            table === users
              ? setPaymentRequired
              : () => ({ where: async () => undefined }),
        }),
        insert: (table: unknown) => ({
          values: (value: unknown) => inserted(table, value),
        }),
      } as unknown as Parameters<Parameters<typeof db.transaction>[0]>[0];
      jest
        .mocked(db.transaction)
        .mockImplementation((callback) => callback(tx));

      await expect(
        adminUpdateCreatorPlan(creatorId, {
          ...input,
          planId: targetPlanId,
          manuallyPaid,
        }),
      ).resolves.toMatchObject({
        success: true,
      });
      if (paymentRequired !== previouslyRequired) {
        expect(setPaymentRequired).toHaveBeenCalledWith({
          subscriptionUpgradeRequired: paymentRequired,
        });
      } else {
        expect(setPaymentRequired).not.toHaveBeenCalled();
      }
      const planChanged = previousPlanId !== targetPlanId;
      const paymentRequestCreated =
        paymentRequired && (planChanged || !previouslyRequired);
      if (paymentRequestCreated) {
        expect(inserted).toHaveBeenCalledWith(
          adminBillingRequests,
          expect.objectContaining({
            creatorId,
            planId: targetPlanId,
            planName: targetName,
            amount: String(targetPrice),
            currency: 'DKK',
          }),
        );
      } else {
        expect(
          inserted.mock.calls.some(([table]) => table === adminBillingRequests),
        ).toBe(false);
      }
      const manualPaymentReceived = Boolean(
        manuallyPaid && (!previousManual || previousPlanId !== targetPlanId),
      );
      expect(sendTemplateEmail).toHaveBeenCalledTimes(
        Number(planChanged || paymentRequestCreated) +
          Number(manualPaymentReceived),
      );
      if (planChanged || paymentRequestCreated) {
        expect(sendTemplateEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            to: 'creator@example.com',
            cc: 'info@kiibee.com',
            templateName: 'subscriptionPlanChanged',
            variables: {
              creator: { fullName: 'Test Creator' },
              previousPlanName: previousPlanId || 'Intet aktivt abonnement',
              planName: targetName,
            },
          }),
        );
      }
      if (manualPaymentReceived) {
        expect(sendTemplateEmail).toHaveBeenCalledWith(
          expect.objectContaining({
            to: 'creator@example.com',
            cc: 'info@kiibee.com',
            templateName: 'subscriptionManualPayment',
          }),
        );
      }
    },
  );
});
