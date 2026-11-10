import { db } from 'src/database/db';
import { hasPaidSubscriptionPeriod } from 'src/modules/subscription/services/hasPaidSubscriptionPeriod';
import { users } from 'src/database/schema';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { adminUpdateCreatorPlan } from 'src/modules/subscription/services/adminUpdateCreatorPlan.service';

jest.mock('src/modules/subscription/services/hasPaidSubscriptionPeriod');

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

  it.each([
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
      alreadyPaid = false,
      previouslyRequired = false,
      paymentRequired,
    }) => {
      jest.mocked(hasPaidSubscriptionPeriod).mockResolvedValue(alreadyPaid);
      jest.mocked(db.select).mockReturnValue({
        from: () => ({
          where: () => ({
            limit: async () => [{ id: input.planId, price: 99 }],
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
                            planId: previousPlanId,
                            price: previousPrice,
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
      const tx = {
        select,
        update: (table: unknown) => ({
          set:
            table === users
              ? setPaymentRequired
              : () => ({ where: async () => undefined }),
        }),
        insert: () => ({ values: async () => undefined }),
      } as unknown as Parameters<Parameters<typeof db.transaction>[0]>[0];
      jest
        .mocked(db.transaction)
        .mockImplementation((callback) => callback(tx));

      await expect(
        adminUpdateCreatorPlan(creatorId, input),
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
      expect(sendTemplateEmail).not.toHaveBeenCalled();
    },
  );
});
