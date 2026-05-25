import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc, count, getTableColumns } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections, collectionItems } from 'src/database/schema';

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
