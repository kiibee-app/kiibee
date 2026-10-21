import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import {
  collectionItems,
  collections,
  mediaFiles,
  users,
} from 'src/database/schema';
import { db } from 'src/database/db';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const reorderCollectionContentsService = async (
  collectionId: string,
  contentIds: string[],
  creatorId: string,
) => {
  try {
    const [collection] = await db
      .select({ id: collections.id })
      .from(collections)
      .where(
        and(
          eq(collections.id, collectionId),
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .limit(1);

    if (!collection) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    const rows = await db
      .select({ id: collectionItems.mediaFileId })
      .from(collectionItems)
      .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
      .where(
        and(
          eq(collectionItems.collectionId, collectionId),
          eq(mediaFiles.isDeleted, false),
        ),
      );
    const currentIds = new Set(rows.map((row) => row.id));

    if (
      contentIds.length !== currentIds.size ||
      new Set(contentIds).size !== contentIds.length ||
      contentIds.some((id) => !currentIds.has(id))
    ) {
      return fail(
        'Content order does not match collection items',
        HttpStatus.BAD_REQUEST,
      );
    }

    await db.transaction(async (tx) => {
      for (const [sortOrder, contentId] of contentIds.entries()) {
        await tx
          .update(collectionItems)
          .set({ sortOrder })
          .where(
            and(
              eq(collectionItems.collectionId, collectionId),
              eq(collectionItems.mediaFileId, contentId),
            ),
          );
      }

      await tx
        .update(users)
        .set({ manualContentOrder: true })
        .where(eq(users.id, creatorId));
    });

    return success({ collectionId, contentIds }, 'Content order updated');
  } catch (error) {
    logger.error('Failed to reorder collection contents:', error);
    return fail(
      'Failed to reorder collection contents',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
