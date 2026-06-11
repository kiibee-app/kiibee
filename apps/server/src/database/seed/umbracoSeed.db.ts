import { eq, inArray } from 'drizzle-orm';

import { db } from '../db';
import { creatorChannels, users } from '../schema';
import {
  findUmbracoUsersRoot,
  loadProfileKeys,
  profileUserId,
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
