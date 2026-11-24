import { randomUUID } from 'crypto';
import { and, eq, gt, inArray, isNull, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  channelCodeGrants,
  collections,
  contentSettings,
  users,
} from 'src/database/schema';
import { comparePassword } from './passwordHash';

export function channelCodeHashes(stored?: string | null): string[] {
  if (!stored) return [];
  try {
    const parsed = stored.startsWith('[') ? JSON.parse(stored) : [stored];
    return Array.isArray(parsed)
      ? parsed.filter((hash): hash is string => typeof hash === 'string')
      : [];
  } catch {
    return [];
  }
}
export async function getChannelCodeState(creatorId: string, userId?: string) {
  const [setting] = await db
    .select()
    .from(contentSettings)
    .where(eq(contentSettings.userId, creatorId))
    .limit(1);
  if (setting?.accessType !== 'set_password') return null;
  const [creator] = await db
    .select({ isDeleted: users.isDeleted })
    .from(users)
    .where(eq(users.id, creatorId))
    .limit(1);
  const [pass] = await db
    .select({ rentDuration: collections.rentDuration })
    .from(collections)
    .where(eq(collections.id, `profile-access-${creatorId}`))
    .limit(1);
  const hashes = channelCodeHashes(setting.passwordHash);
  const [grant] =
    userId &&
    userId !== creatorId &&
    hashes.length &&
    creator &&
    !creator.isDeleted
      ? await db
          .select()
          .from(channelCodeGrants)
          .where(
            and(
              eq(channelCodeGrants.creatorId, creatorId),
              eq(channelCodeGrants.userId, userId),
              inArray(channelCodeGrants.codeHash, hashes),
              or(
                isNull(channelCodeGrants.expiresAt),
                gt(channelCodeGrants.expiresAt, new Date()),
              ),
            ),
          )
          .limit(1)
      : [];
  return {
    collectionId: undefined,
    buyPrice: undefined,
    rentPrice: undefined,
    required: false,
    codeRequired: true,
    hasAccess: Boolean(
      creator && !creator.isDeleted && (userId === creatorId || grant),
    ),
    rentDuration: pass?.rentDuration ?? null,
    accessBoxText: setting.accessBoxText,
    accessInfo: grant
      ? {
          accessType: 'rented' as const,
          rentExpiresAt: grant.expiresAt,
          grantedAt: grant.grantedAt,
        }
      : undefined,
  };
}
export async function redeemChannelCode(
  creatorId: string,
  userId: string,
  code: string,
  duration: string | null,
) {
  const [setting] = await db
    .select()
    .from(contentSettings)
    .where(eq(contentSettings.userId, creatorId))
    .limit(1);
  for (const hash of channelCodeHashes(setting?.passwordHash)) {
    if (!(await comparePassword(code, hash))) continue;
    const now = new Date();
    // Match the payment rental convention: one month is 30 days.
    const expiresAt = duration
      ? new Date(
          now.getTime() +
            Number(duration.split('_')[0]) * 30 * 24 * 60 * 60 * 1000,
        )
      : null;
    const [grant] = await db
      .insert(channelCodeGrants)
      .values({
        id: randomUUID(),
        creatorId,
        userId,
        codeHash: hash,
        grantedAt: now,
        expiresAt,
      })
      .onConflictDoNothing()
      .returning();
    if (grant) return grant;
    const [existing] = await db
      .select()
      .from(channelCodeGrants)
      .where(
        and(
          eq(channelCodeGrants.creatorId, creatorId),
          eq(channelCodeGrants.userId, userId),
          eq(channelCodeGrants.codeHash, hash),
        ),
      )
      .limit(1);
    if (existing && (!existing.expiresAt || existing.expiresAt > now))
      return existing;
  }
  return null;
}
