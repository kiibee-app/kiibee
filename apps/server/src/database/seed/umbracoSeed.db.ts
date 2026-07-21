import { eq, inArray } from 'drizzle-orm';

import { db } from '../db';
import {
  creatorChannels,
  creatorPayoutRequests,
  creatorPayouts,
  creatorWallets,
  subscriptionPaymentsHistory,
  subscriptions,
  users,
} from '../schema';
import {
  findUmbracoUsersRoot,
  loadProfileKeys,
  profileUserId,
  UMBRACO_SKIP_PROFILE_KEYS,
} from './umbracoSeed.helpers';

export async function loadSeededProfileUserIds(
  root?: string | null,
): Promise<Set<string>> {
  const umbracoRoot = root ?? findUmbracoUsersRoot();
  if (!umbracoRoot) {
    return new Set();
  }

  const profileUserIds = loadProfileKeys(umbracoRoot).map((profileKey) =>
    profileUserId(profileKey),
  );

  if (!profileUserIds.length) {
    return new Set();
  }

  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(inArray(users.id, profileUserIds));

  return new Set(rows.map((row) => row.id));
}

/** Delete previously seeded creators that are now on the skip list. */
export async function removeSkippedUmbracoProfiles(): Promise<number> {
  const skippedIds = [...UMBRACO_SKIP_PROFILE_KEYS].map((profileKey) =>
    profileUserId(profileKey),
  );

  if (!skippedIds.length) {
    return 0;
  }

  const existing = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(inArray(users.id, skippedIds));

  if (!existing.length) {
    return 0;
  }

  const ids = existing.map((row) => row.id);

  // Clear RESTRICT dependent rows before deleting the user (CASCADE handles the rest).
  await db
    .delete(creatorPayoutRequests)
    .where(inArray(creatorPayoutRequests.creatorId, ids));
  await db.delete(creatorPayouts).where(inArray(creatorPayouts.creatorId, ids));
  await db.delete(creatorWallets).where(inArray(creatorWallets.creatorId, ids));
  await db
    .delete(subscriptionPaymentsHistory)
    .where(inArray(subscriptionPaymentsHistory.creatorId, ids));
  await db.delete(subscriptions).where(inArray(subscriptions.creatorId, ids));

  await db.delete(users).where(inArray(users.id, ids));

  console.log(
    `Removed ${existing.length} skipped Umbraco seed profile(s): ${existing
      .map((row) => row.email)
      .join(', ')}`,
  );

  return existing.length;
}

export async function loadChannelSlugByCreatorId(): Promise<
  Map<string, string>
> {
  const rows = await db
    .select({
      creatorId: creatorChannels.creatorId,
      slug: creatorChannels.slug,
    })
    .from(creatorChannels);

  return new Map(rows.map((row) => [row.creatorId, row.slug]));
}

export async function loadCreatorIdsByRole(): Promise<Set<string>> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, 'creator'));

  return new Set(rows.map((row) => row.id));
}
