import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, sql, getTableColumns } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCollectionById = async (id: string, creatorId: string) => {
  try {
    const collectionColumns = getTableColumns(collections);
    const { coverImageUrl, ...restColumns } = collectionColumns;

    const [collection] = await db
      .select({
        ...restColumns,
        coverImageUrl: sql<string>`COALESCE(
          (
            SELECT COALESCE(mf.thumbnail_landscape_url, mf.thumbnail_url)
            FROM collection_items ci
            JOIN media_files mf ON mf.id = ci.media_file_id
            WHERE ci.collection_id = collections.id
            ORDER BY ci.sort_order ASC
            LIMIT 1
          ),
          ${coverImageUrl}
        )`.as('coverImageUrl'),
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
