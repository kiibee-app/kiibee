import { HttpException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { adminMfa, users, userSessions } from 'src/database/schema';
import {
  base32Encode,
  decryptMfaSecret,
  encryptMfaSecret,
  hashRecoveryCode,
  newRecoveryCodes,
  verifyTotp,
} from './adminTotp';

export type AdminMfaChallenge = {
  requiresTwoFactor: true;
  setupRequired: boolean;
  setupKey?: string;
  accountName?: string;
};
type MfaResult =
  | AdminMfaChallenge
  | { verified: true; recoveryCodes?: string[] }
  | { error: string; status: number };

// Called only after the account's password has been verified. Database locks
// serialize verification attempts, replay protection and recovery-code use.
export async function verifyAdminMfa(
  userId: string,
  email: string,
  code?: string,
  recoveryCode?: string,
) {
  const result: MfaResult = await db.transaction(
    async (tx): Promise<MfaResult> => {
      await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .for('update');
      let [state] = await tx
        .select()
        .from(adminMfa)
        .where(eq(adminMfa.userId, userId));
      const now = new Date();
      if (state?.lockedUntil && state.lockedUntil > now) {
        return {
          error: 'Too many verification attempts. Try again in 15 minutes.',
          status: 429,
        };
      }
      if (!state || (!state.enabled && state.setupExpiresAt <= now)) {
        const secret = base32Encode(randomBytes(20));
        const values = {
          userId,
          encryptedSecret: encryptMfaSecret(secret, userId),
          enabled: false,
          setupExpiresAt: new Date(now.getTime() + 10 * 60 * 1000),
          lastUsedStep: null,
          recoveryCodeHashes: [],
        };
        [state] = await tx
          .insert(adminMfa)
          .values(values)
          .onConflictDoUpdate({ target: adminMfa.userId, set: values })
          .returning();
        // Never verify a code supplied for an expired/different setup key.
        return {
          requiresTwoFactor: true,
          setupRequired: true,
          setupKey: secret,
          accountName: `Kiibee Admin (${email})`,
        };
      }
      const secret = decryptMfaSecret(state.encryptedSecret, userId);
      if (!code && !recoveryCode) {
        return state.enabled
          ? { requiresTwoFactor: true, setupRequired: false }
          : {
              requiresTwoFactor: true,
              setupRequired: true,
              setupKey: secret,
              accountName: `Kiibee Admin (${email})`,
            };
      }
      const recoveryHash = recoveryCode ? hashRecoveryCode(recoveryCode) : '';
      const usingRecovery =
        state.enabled &&
        Boolean(recoveryHash) &&
        state.recoveryCodeHashes.includes(recoveryHash);
      const step =
        !recoveryCode && code
          ? verifyTotp(secret, code, state.lastUsedStep)
          : null;
      if (step === null && !usingRecovery) {
        const attempts = (state.lockedUntil ? 0 : state.failedAttempts) + 1;
        await tx
          .update(adminMfa)
          .set({
            failedAttempts: attempts,
            lockedUntil:
              attempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null,
          })
          .where(eq(adminMfa.userId, userId));
        // Return the error so the failed-attempt counter commits before throwing.
        return {
          error:
            attempts >= 5
              ? 'Too many verification attempts. Try again in 15 minutes.'
              : 'Invalid or already used verification code.',
          status: attempts >= 5 ? 429 : 401,
        };
      }
      if (usingRecovery) {
        // A lost phone is recovered by binding a new authenticator, rather than
        // silently leaving the missing device as the only second factor.
        const newSecret = base32Encode(randomBytes(20));
        await tx
          .update(adminMfa)
          .set({
            encryptedSecret: encryptMfaSecret(newSecret, userId),
            enabled: false,
            setupExpiresAt: new Date(now.getTime() + 10 * 60 * 1000),
            lastUsedStep: null,
            recoveryCodeHashes: state.recoveryCodeHashes.filter(
              (hash) => hash !== recoveryHash,
            ),
            failedAttempts: 0,
            lockedUntil: null,
          })
          .where(eq(adminMfa.userId, userId));
        await tx.delete(userSessions).where(eq(userSessions.userId, userId));
        return {
          requiresTwoFactor: true,
          setupRequired: true,
          setupKey: newSecret,
          accountName: `Kiibee Admin (${email})`,
        };
      }
      const recoveryCodes = !state.enabled ? newRecoveryCodes() : undefined;
      await tx
        .update(adminMfa)
        .set({
          enabled: true,
          lastUsedStep: step,
          ...(recoveryCodes
            ? { recoveryCodeHashes: recoveryCodes.map(hashRecoveryCode) }
            : {}),
          failedAttempts: 0,
          lockedUntil: null,
        })
        .where(eq(adminMfa.userId, userId));
      return { verified: true, ...(recoveryCodes ? { recoveryCodes } : {}) };
    },
  );
  if ('error' in result) throw new HttpException(result.error, result.status);
  return result;
}
