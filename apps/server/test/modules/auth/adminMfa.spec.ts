import { db } from 'src/database/db';
import { adminMfa } from 'src/database/schema';
import { verifyAdminMfa } from 'src/modules/auth/services/adminMfa.service';
import {
  decryptMfaSecret,
  hashRecoveryCode,
  totp,
} from 'src/modules/auth/services/adminTotp';

jest.mock('src/database/db', () => ({ db: { transaction: jest.fn() } }));

describe('admin MFA enrollment and verification', () => {
  let state: typeof adminMfa.$inferSelect | undefined;
  let sessionsDeleted: jest.Mock;
  let lock: jest.Mock;
  const originalKey = process.env.ADMIN_MFA_ENCRYPTION_KEY;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-27T05:00:00Z'));
    process.env.ADMIN_MFA_ENCRYPTION_KEY = 'ab'.repeat(32);
    state = undefined;
    sessionsDeleted = jest.fn().mockResolvedValue(undefined);
    lock = jest.fn().mockResolvedValue([{ id: 'admin' }]);
    const tx = {
      select: () => ({
        from: (table: unknown) => ({
          where: () =>
            table === adminMfa
              ? Promise.resolve(state ? [{ ...state }] : [])
              : { for: lock },
        }),
      }),
      insert: () => ({
        values: (values: Partial<typeof state>) => ({
          onConflictDoUpdate: () => ({
            returning: async () => {
              state = {
                failedAttempts: 0,
                lockedUntil: null,
                ...state,
                ...values,
              } as typeof adminMfa.$inferSelect;
              return [{ ...state }];
            },
          }),
        }),
      }),
      update: () => ({
        set: (values: Partial<typeof state>) => ({
          where: async () => {
            Object.assign(state!, values);
          },
        }),
      }),
      delete: () => ({ where: sessionsDeleted }),
    };
    jest.mocked(db.transaction).mockImplementation(async (callback) => {
      const previous = state ? { ...state } : undefined;
      try {
        return await callback(tx as never);
      } catch (error) {
        state = previous;
        throw error;
      }
    });
  });
  afterEach(() => jest.useRealTimers());
  afterAll(() => {
    if (originalKey === undefined) delete process.env.ADMIN_MFA_ENCRYPTION_KEY;
    else process.env.ADMIN_MFA_ENCRYPTION_KEY = originalKey;
  });

  async function enroll() {
    const challenge = await verifyAdminMfa('admin', 'admin@example.com');
    if (!('setupKey' in challenge) || !challenge.setupKey)
      throw new Error('Missing setup key');
    const secret = challenge.setupKey;
    const enrolled = await verifyAdminMfa(
      'admin',
      'admin@example.com',
      totp(secret, Math.floor(Date.now() / 30000)),
    );
    return { challenge, secret, enrolled };
  }

  it('requires proof of enrollment before enabling MFA, and shows recovery codes once', async () => {
    const { secret, enrolled } = await enroll();
    expect(enrolled).toMatchObject({
      verified: true,
      recoveryCodes: expect.any(Array),
    });
    expect(state?.enabled).toBe(true);
    expect(state?.encryptedSecret).not.toContain(secret);
    if (!('recoveryCodes' in enrolled))
      throw new Error('Missing recovery codes');
    expect(state?.recoveryCodeHashes).toEqual(
      enrolled.recoveryCodes!.map(hashRecoveryCode),
    );
    expect(lock).toHaveBeenCalled();
    expect(await verifyAdminMfa('admin', 'admin@example.com')).toEqual({
      requiresTwoFactor: true,
      setupRequired: false,
    });
    jest.advanceTimersByTime(30000);
    expect(
      await verifyAdminMfa(
        'admin',
        'admin@example.com',
        totp(secret, Math.floor(Date.now() / 30000)),
      ),
    ).toEqual({ verified: true });
  });

  it('rejects replayed codes and commits failed-attempt tracking', async () => {
    const { secret } = await enroll();
    await expect(
      verifyAdminMfa(
        'admin',
        'admin@example.com',
        totp(secret, Math.floor(Date.now() / 30000)),
      ),
    ).rejects.toMatchObject({ status: 401 });
    expect(state?.failedAttempts).toBe(1);
  });

  it('locks out after five failures, preserves the lock across password-only logins, and expires it', async () => {
    const { secret } = await enroll();
    for (let index = 0; index < 5; index++) {
      await expect(
        verifyAdminMfa('admin', 'admin@example.com', 'bad'),
      ).rejects.toMatchObject({ status: index === 4 ? 429 : 401 });
    }
    expect(state?.failedAttempts).toBe(5);
    await expect(
      verifyAdminMfa('admin', 'admin@example.com'),
    ).rejects.toMatchObject({ status: 429 });
    jest.advanceTimersByTime(15 * 60 * 1000);
    expect(
      await verifyAdminMfa(
        'admin',
        'admin@example.com',
        totp(secret, Math.floor(Date.now() / 30000)),
      ),
    ).toEqual({ verified: true });
    expect(state?.failedAttempts).toBe(0);
  });

  it('consumes a recovery code and requires verification of a replacement authenticator', async () => {
    const { secret, enrolled } = await enroll();
    if (!('recoveryCodes' in enrolled))
      throw new Error('Missing recovery codes');
    const recoveryCode = enrolled.recoveryCodes![0];
    const replacement = await verifyAdminMfa(
      'admin',
      'admin@example.com',
      undefined,
      recoveryCode,
    );
    expect(replacement).toMatchObject({
      requiresTwoFactor: true,
      setupRequired: true,
    });
    expect(state?.enabled).toBe(false);
    expect(state?.recoveryCodeHashes).not.toContain(
      hashRecoveryCode(recoveryCode),
    );
    expect(sessionsDeleted).toHaveBeenCalled();
    const newSecret = decryptMfaSecret(state!.encryptedSecret, 'admin');
    expect(newSecret).not.toBe(secret);
    await expect(
      verifyAdminMfa('admin', 'admin@example.com', undefined, recoveryCode),
    ).rejects.toMatchObject({ status: 401 });
    const result = await verifyAdminMfa(
      'admin',
      'admin@example.com',
      totp(newSecret, Math.floor(Date.now() / 30000)),
    );
    expect(result).toMatchObject({
      verified: true,
      recoveryCodes: expect.any(Array),
    });
    expect(state?.recoveryCodeHashes).toHaveLength(10);
    expect(state?.recoveryCodeHashes).not.toContain(
      hashRecoveryCode(recoveryCode),
    );
  });

  it('keeps a pending setup key stable until expiry, then rotates it without accepting an old code', async () => {
    const first = await verifyAdminMfa('admin', 'admin@example.com');
    expect(await verifyAdminMfa('admin', 'admin@example.com')).toEqual(first);
    jest.advanceTimersByTime(10 * 60 * 1000);
    const next = await verifyAdminMfa('admin', 'admin@example.com', '123456');
    expect(next).toMatchObject({
      requiresTwoFactor: true,
      setupRequired: true,
    });
    expect(next).not.toEqual(first);
    expect(state?.enabled).toBe(false);
  });
});
