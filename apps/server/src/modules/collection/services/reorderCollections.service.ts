import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { collections, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const reorderCollectionsService = async (
  collectionIds: string[],
  creatorId: string,
) => {
  try {
    if (new Set(collectionIds).size !== collectionIds.length) {
      return fail(
        'Collection order contains duplicates',
        HttpStatus.BAD_REQUEST,
      );
    }

    const ownedCollections = await db
      .select({ id: collections.id })
      .from(collections)
      .where(
        and(
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      );
    const ownedIds = new Set(ownedCollections.map((item) => item.id));

    if (
      ownedCollections.length !== collectionIds.length ||
      collectionIds.some((id) => !ownedIds.has(id))
    ) {
      return fail(
        'Collection order contains invalid items',
        HttpStatus.BAD_REQUEST,
      );
    }

    await db.transaction(async (tx) => {
      for (const [index, collectionId] of collectionIds.entries()) {
        await tx
          .update(collections)
          .set({ sortOrder: collectionIds.length - index })
          .where(eq(collections.id, collectionId));
      }

      await tx
        .update(users)
        .set({ manualContentOrder: true })
        .where(eq(users.id, creatorId));
    });

    return success(collectionIds, 'Collection order updated');
  } catch (error) {
    logger.error('Failed to reorder collections:', error);
    return fail(
      'Failed to reorder collections',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
