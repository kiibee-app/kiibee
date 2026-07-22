import { randomUUID } from 'crypto';
import { and, eq, ne } from 'drizzle-orm';

import { db } from 'src/database/db';
import { creatorChannels } from 'src/database/schema';
import {
  CHANNEL_NAME_MAX_LENGTH,
  CHANNEL_SLUG_MAX_LENGTH,
  CHANNEL_SLUG_SUFFIX_LENGTH,
  CHANNEL_SLUG_UNIQUE_ATTEMPTS,
  DEFAULT_CHANNEL_NAME,
} from 'src/utils/constant';
import { slugify } from 'src/utils/slug';

type DbClient = Pick<typeof db, 'select' | 'insert' | 'update'>;

function resolveChannelName(name: string | null | undefined): string {
  const trimmed = name?.trim();
  return (
    (trimmed && trimmed.slice(0, CHANNEL_NAME_MAX_LENGTH)) ||
    DEFAULT_CHANNEL_NAME
  );
}

async function allocateUniqueChannelSlug(
  client: DbClient,
  channelName: string,
  creatorId: string,
): Promise<string> {
  const baseSlug = slugify(channelName);
  const suffix = creatorId
    .replace(/-/g, '')
    .slice(0, CHANNEL_SLUG_SUFFIX_LENGTH);

  for (let attempt = 0; attempt < CHANNEL_SLUG_UNIQUE_ATTEMPTS; attempt += 1) {
    const candidate =
      attempt === 0
        ? baseSlug
        : `${baseSlug}-${suffix}${attempt > 1 ? `-${attempt}` : ''}`.slice(
            0,
            CHANNEL_SLUG_MAX_LENGTH,
          );

    const [conflict] = await client
      .select({ id: creatorChannels.id })
      .from(creatorChannels)
      .where(
        and(
          eq(creatorChannels.slug, candidate),
          ne(creatorChannels.creatorId, creatorId),
        ),
      )
      .limit(1);

    if (!conflict) {
      return candidate;
    }
  }

  return `${baseSlug}-${suffix}-${Date.now().toString(36)}`.slice(
    0,
    CHANNEL_SLUG_MAX_LENGTH,
  );
}

export const ensureCreatorChannel = async (
  client: DbClient,
  params: {
    creatorId: string;
    channelName: string | null | undefined;
  },
): Promise<void> => {
  const name = resolveChannelName(params.channelName);
  const now = new Date();

  const [existing] = await client
    .select({
      id: creatorChannels.id,
      name: creatorChannels.name,
      slug: creatorChannels.slug,
      isPublished: creatorChannels.isPublished,
    })
    .from(creatorChannels)
    .where(eq(creatorChannels.creatorId, params.creatorId))
    .limit(1);

  if (existing) {
    const updates: {
      name?: string;
      slug?: string;
      isPublished?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: now,
    };

    const nextSlug = await allocateUniqueChannelSlug(
      client,
      name,
      params.creatorId,
    );

    if (existing.name !== name) {
      updates.name = name;
    }

    if (existing.slug !== nextSlug) {
      updates.slug = nextSlug;
    }

    if (!existing.isPublished) {
      updates.isPublished = true;
    }

    if (
      updates.name === undefined &&
      updates.slug === undefined &&
      updates.isPublished === undefined
    ) {
      return;
    }

    await client
      .update(creatorChannels)
      .set(updates)
      .where(eq(creatorChannels.creatorId, params.creatorId));
    return;
  }

  const slug = await allocateUniqueChannelSlug(client, name, params.creatorId);

  await client.insert(creatorChannels).values({
    id: randomUUID(),
    creatorId: params.creatorId,
    name,
    slug,
    isPublished: true,
    createdAt: now,
    updatedAt: now,
  });
};
