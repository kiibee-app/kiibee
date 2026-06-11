import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { db } from '../db';
import { collectionItems, collections, mediaFiles } from '../schema';
import {
  batchInsert,
  collectReferencedUmbracoMedia,
  findUmbracoUsersRoot,
  loadProfileKeys,
  profileUserId,
  resolveMediaFileId,
  showSeedUuid,
  slugifyUmbracoValue,
  textOrNull,
  type JsonRecord,
} from './umbracoSeed.helpers';
import { loadChannelSlugByCreatorId } from './umbracoSeed.db';

const BATCH_SIZE = 100;

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : value.slice(0, maxLength);
}

function loadExistingShowKeys(
  root: string,
  profileKeys: string[],
): Map<string, Set<string>> {
  const showKeysByProfile = new Map<string, Set<string>>();

  for (const profileKey of profileKeys) {
    const showsPath = join(root, profileKey, 'shows', 'items.json');
    if (!existsSync(showsPath)) {
      continue;
    }

    const shows = JSON.parse(readFileSync(showsPath, 'utf8')) as JsonRecord[];
    showKeysByProfile.set(
      profileKey,
      new Set(
        shows
          .map((show) => textOrNull(show.key)?.toLowerCase())
          .filter((key): key is string => Boolean(key)),
      ),
    );
  }

  return showKeysByProfile;
}

export const seedUmbracoReferencedMedia = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco referenced media seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const profileKeys = loadProfileKeys(root);
  const existingShowKeysByProfile = loadExistingShowKeys(root, profileKeys);
  const referencedMedia = collectReferencedUmbracoMedia(
    root,
    profileKeys,
    existingShowKeysByProfile,
  );

  if (!referencedMedia.size) {
    console.log(
      'Umbraco referenced media seed skipped (no archived media found)',
    );
    return;
  }

  const channelSlugByCreatorId = await loadChannelSlugByCreatorId();
  const collectionRows = await db
    .select({
      creatorId: collections.creatorId,
      id: collections.id,
    })
    .from(collections);
  const collectionIdByCreatorId = new Map(
    collectionRows.map((row) => [row.creatorId, row.id]),
  );
  const existingMediaIds = new Set(
    (await db.select({ id: mediaFiles.id }).from(mediaFiles)).map(
      (row) => row.id,
    ),
  );

  const now = new Date();
  const pendingMedia: (typeof mediaFiles.$inferInsert)[] = [];
  const pendingCollectionItems: (typeof collectionItems.$inferInsert)[] = [];

  for (const media of referencedMedia.values()) {
    const creatorId = profileUserId(media.profileKey);
    const mediaFileId = resolveMediaFileId(media.profileKey, media.mediaKey);
    if (!mediaFileId || existingMediaIds.has(mediaFileId)) {
      continue;
    }

    const channelSlug =
      channelSlugByCreatorId.get(creatorId) ??
      slugifyUmbracoValue(media.profileKey);
    const slug = truncate(
      `${channelSlug}-${slugifyUmbracoValue(media.slugSuffix)}-${media.mediaKey.replace(/-/g, '').slice(0, 8)}`,
      500,
    );

    pendingMedia.push({
      id: mediaFileId,
      creatorId,
      title: truncate(media.title, 500),
      slug,
      description: 'Imported from Umbraco purchase/stat history',
      fileKey: media.fileKey,
      contentUrl: media.contentUrl,
      contentTypeId: media.fileKey ? 'video' : 'video',
      thumbnailUrl: media.thumbnailUrl,
      thumbnailLandscapeUrl: media.thumbnailLandscapeUrl,
      visibility: 'public',
      accessType: media.buyPrice || media.rentPrice ? 'paid' : 'free',
      buyPrice: media.buyPrice,
      rentPrice: media.rentPrice,
      rentDurationHours: media.rentPrice ? 48 : null,
      currency: 'DKK',
      isDownloadable: Boolean(media.contentUrl),
      sortOrder: 9999,
      isPublished: true,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    });

    const collectionId = collectionIdByCreatorId.get(creatorId);
    if (collectionId) {
      pendingCollectionItems.push({
        id: showSeedUuid('collection-item', media.profileKey, media.mediaKey),
        collectionId,
        mediaFileId,
        sortOrder: 9999,
        createdAt: now,
        updatedAt: now,
      });
    }

    existingMediaIds.add(mediaFileId);
  }

  await batchInsert(pendingMedia, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(mediaFiles)
        .values(row)
        .onConflictDoUpdate({
          target: mediaFiles.id,
          set: {
            title: row.title,
            slug: row.slug,
            description: row.description,
            fileKey: row.fileKey,
            contentUrl: row.contentUrl,
            thumbnailUrl: row.thumbnailUrl,
            thumbnailLandscapeUrl: row.thumbnailLandscapeUrl,
            buyPrice: row.buyPrice,
            rentPrice: row.rentPrice,
            updatedAt: row.updatedAt,
          },
        });
    }
  });

  await batchInsert(pendingCollectionItems, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(collectionItems)
        .values(row)
        .onConflictDoNothing({ target: collectionItems.id });
    }
  });

  console.log(
    `Umbraco referenced media seed completed (${pendingMedia.length} archived media files from ${root})`,
  );
};
