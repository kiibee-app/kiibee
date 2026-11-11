import { db } from 'src/database/db';
import { creatorPlans, users } from 'src/database/schema';
import { expireManualPlans } from 'src/modules/subscription/services/expireManualPlans.service';

jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));

describe('expired manual plans', () => {
  it.each([[], [{ creatorId: 'expired-creator' }]])(
    'downgrades expired assignments and resets payment requirements: %j',
    async (...args) => {
      const expired = args as { creatorId: string }[];
      const setPlan = jest.fn(() => ({
        where: () => ({ returning: async () => expired }),
      }));
      const setUser = jest.fn(() => ({ where: async () => undefined }));
      const tx = {
        select: () => ({
          from: () => ({
            where: () => ({ limit: async () => [{ id: 'try-kiibee' }] }),
          }),
        }),
        update: (table: unknown) => ({
          set:
            table === creatorPlans
              ? setPlan
              : table === users
                ? setUser
                : undefined,
        }),
      } as unknown as Parameters<Parameters<typeof db.transaction>[0]>[0];
      jest
        .mocked(db.transaction)
        .mockImplementation((callback) => callback(tx));
      expect(await expireManualPlans()).toBe(expired.length);
      expect(setPlan).toHaveBeenCalledWith(
        expect.objectContaining({
          planId: 'try-kiibee',
          manuallyPaid: false,
          manualPaidExpiresAt: null,
          customPrice: null,
          customMaxFiles: null,
        }),
      );
      expect(setUser).toHaveBeenCalledTimes(expired.length ? 1 : 0);
      if (expired.length)
        expect(setUser).toHaveBeenCalledWith({
          subscriptionUpgradeRequired: false,
        });
    },
  );
});
