import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collectionItems, collections, mediaFiles } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const deleteCollection = async (id: string, creatorId: string) => {
  try {
    const [existing] = await db
      .select({ id: collections.id })
      .from(collections)
      .where(
        and(
          eq(collections.id, id),
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .limit(1);

    if (!existing) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    const items = await db
      .select({ mediaFileId: collectionItems.mediaFileId })
      .from(collectionItems)
      .where(eq(collectionItems.collectionId, id));

    const mediaFileIds = items
      .map((item) => item.mediaFileId)
      .filter((mediaId): mediaId is string => Boolean(mediaId));

    await db.transaction(async (tx) => {
      await tx
        .update(collections)
        .set({ isDeleted: true })
        .where(eq(collections.id, id));

      if (mediaFileIds.length > 0) {
        await tx
          .update(mediaFiles)
          .set({ isDeleted: true })
          .where(inArray(mediaFiles.id, mediaFileIds));
      }
    });

    return success(null, 'Collection deleted successfully');
  } catch (error) {
    logger.error('Failed to delete collection', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to delete collection',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
