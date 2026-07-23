import { inArray, eq, and } from 'drizzle-orm';

import { db as defaultDb } from 'src/database/db';
import { collectionItems, mediaFiles } from 'src/database/schema';

type Database = typeof defaultDb;

type Collection = {
  id: string;
  coverImageUrl: string | null;
};

export async function populateMissingCollectionCovers(
  db: Database,
  collections: Collection[],
) {
  const missingCoverIds = collections
    .filter((collection) => !collection.coverImageUrl)
    .map((collection) => collection.id);

  if (missingCoverIds.length === 0) return;

  const firstItems = await db
    .select({
      collectionId: collectionItems.collectionId,
      thumbnailUrl: mediaFiles.thumbnailUrl,
      thumbnailLandscapeUrl: mediaFiles.thumbnailLandscapeUrl,
    })
    .from(collectionItems)
    .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
    .where(
      and(
        inArray(collectionItems.collectionId, missingCoverIds),
        eq(mediaFiles.isDeleted, false),
      ),
    )
    .orderBy(collectionItems.sortOrder);

  const firstItemMap = new Map<string, string | null>();
  for (const item of firstItems) {
    if (item.collectionId && !firstItemMap.has(item.collectionId)) {
      firstItemMap.set(
        item.collectionId,
        item.thumbnailUrl || item.thumbnailLandscapeUrl || null,
      );
    }
  }

  collections.forEach((collection) => {
    collection.coverImageUrl ??= firstItemMap.get(collection.id) ?? null;
  });
}
