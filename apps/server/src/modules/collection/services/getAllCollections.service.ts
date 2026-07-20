import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc, count, getTableColumns, inArray } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections, collectionItems, mediaFiles } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getAllCollections = async (creatorId: string) => {
  try {
    const collectionColumns = getTableColumns(collections);

    const result = await db
      .select({
        ...collectionColumns,
        contentQty: count(collectionItems.id),
      })
      .from(collections)
      .leftJoin(
        collectionItems,
        eq(collectionItems.collectionId, collections.id),
      )
      .where(
        and(
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .groupBy(collections.id)
      .orderBy(desc(collections.sortOrder));

    const collectionIds = result.map((c) => c.id);
    if (collectionIds.length > 0) {
      const firstItems = await db
        .select({
          collectionId: collectionItems.collectionId,
          thumbnailUrl: mediaFiles.thumbnailUrl,
          thumbnailLandscapeUrl: mediaFiles.thumbnailLandscapeUrl,
        })
        .from(collectionItems)
        .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
        .where(inArray(collectionItems.collectionId, collectionIds))
        .orderBy(collectionItems.sortOrder);

      const firstItemMap = new Map<
        string,
        { thumbnailUrl: string | null; thumbnailLandscapeUrl: string | null }
      >();
      for (const item of firstItems) {
        if (item.collectionId && !firstItemMap.has(item.collectionId)) {
          firstItemMap.set(item.collectionId, item);
        }
      }

      for (const col of result) {
        if (!col.coverImageUrl) {
          const firstItem = firstItemMap.get(col.id);
          if (firstItem) {
            col.coverImageUrl =
              firstItem.thumbnailUrl || firstItem.thumbnailLandscapeUrl || null;
          }
        }
      }
    }

    return success(result, 'Collections retrieved successfully');
  } catch (error) {
    logger.error('Failed to get collections', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to retrieve collections',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
