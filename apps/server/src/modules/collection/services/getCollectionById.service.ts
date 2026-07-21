import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, getTableColumns } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections, collectionItems, mediaFiles } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCollectionById = async (id: string, creatorId: string) => {
  try {
    const collectionColumns = getTableColumns(collections);

    const [collection] = await db
      .select({
        ...collectionColumns,
      })
      .from(collections)
      .where(
        and(
          eq(collections.id, id),
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .limit(1);

    if (!collection) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    if (!collection.coverImageUrl) {
      const [firstItem] = await db
        .select({
          thumbnailUrl: mediaFiles.thumbnailUrl,
          thumbnailLandscapeUrl: mediaFiles.thumbnailLandscapeUrl,
        })
        .from(collectionItems)
        .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
        .where(eq(collectionItems.collectionId, id))
        .orderBy(collectionItems.sortOrder)
        .limit(1);

      if (firstItem) {
        collection.coverImageUrl =
          firstItem.thumbnailUrl || firstItem.thumbnailLandscapeUrl || null;
      }
    }

    return success(collection, 'Collection retrieved successfully');
  } catch (error) {
    logger.error('Failed to get collection', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to retrieve collection',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
