import { hasPaidSubscriptionPeriod } from 'src/modules/subscription/services/hasPaidSubscriptionPeriod';
import type { db } from 'src/database/db';

jest.mock('src/database/db', () => ({ db: {} }));

describe('manual subscription access', () => {
  it.each([
    {
      label: 'without expiry',
      manuallyPaid: true,
      expiresAt: null,
      paid: false,
      expected: true,
    },
    {
      label: 'before expiry',
      manuallyPaid: true,
      expiresAt: new Date('2099-01-01'),
      paid: false,
      expected: true,
    },
    {
      label: 'after expiry',
      manuallyPaid: true,
      expiresAt: new Date('2000-01-01'),
      paid: false,
      expected: false,
    },
    {
      label: 'disabled',
      manuallyPaid: false,
      expiresAt: null,
      paid: false,
      expected: false,
    },
    {
      label: 'with an ePay period after manual expiry',
      manuallyPaid: true,
      expiresAt: new Date('2000-01-01'),
      paid: true,
      expected: true,
    },
  ])('$label', async ({ manuallyPaid, expiresAt, paid, expected }) => {
    const results = [
      [{ manuallyPaid, expiresAt }],
      paid ? [{ id: 'epay-period' }] : [],
    ];
    const select = jest.fn().mockImplementation(() => ({
      from: () => ({
        where: () => ({
          orderBy: () => ({ limit: async () => results.shift() }),
          limit: async () => results.shift(),
        }),
      }),
    }));
    const database = { select } as unknown as Pick<typeof db, 'select'>;
    await expect(
      hasPaidSubscriptionPeriod(database, 'creator', 'plan'),
    ).resolves.toBe(expected);
    expect(select).toHaveBeenCalledTimes(
      manuallyPaid && (!expiresAt || expiresAt > new Date()) ? 1 : 2,
    );
  });
});
