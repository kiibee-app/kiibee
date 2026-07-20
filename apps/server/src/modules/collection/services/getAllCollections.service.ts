import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc, count, getTableColumns, sql } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections, collectionItems } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getAllCollections = async (creatorId: string) => {
  try {
    const collectionColumns = getTableColumns(collections);
    const { coverImageUrl, ...restColumns } = collectionColumns;

    const result = await db
      .select({
        ...restColumns,
        contentQty: count(collectionItems.id),
        coverImageUrl: sql<string>`COALESCE(
          ${coverImageUrl},
          (
            SELECT COALESCE(mf.thumbnail_url, mf.thumbnail_landscape_url)
            FROM collection_items ci
            JOIN media_files mf ON mf.id = ci.media_file_id
            WHERE ci.collection_id = collections.id
            ORDER BY ci.sort_order ASC
            LIMIT 1
          )
        )`.as('coverImageUrl'),
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
