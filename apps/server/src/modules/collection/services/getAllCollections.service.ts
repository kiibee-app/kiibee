import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc, count, getTableColumns, sql } from 'drizzle-orm';

import { db } from 'src/database/db';
import {
  collections,
  collectionItems,
  contentTypes,
  mediaFiles,
} from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { populateMissingCollectionCovers } from 'src/utils/populateMissingCollectionCovers';
import { fail, success } from 'src/utils/sendResponse';

import { requirePubliclyVisibleCreator } from 'src/utils/publicCreatorVisibility';
import {
  ACCESS_TYPE,
  CONTENT_TYPES,
  MEDIA_FILE_TYPE,
} from 'src/utils/constant';

export const getAllCollections = async (creatorIdOrSlug: string) => {
  try {
    const creatorRes = await requirePubliclyVisibleCreator(creatorIdOrSlug);
    if ('statusCode' in creatorRes && creatorRes.statusCode !== 200) {
      return creatorRes;
    }
    const targetCreatorId = (creatorRes as any).id;

    const collectionColumns = getTableColumns(collections);

    const result = await db
      .select({
        ...collectionColumns,
        contentQty: count(mediaFiles.id),
        hasWarningItem: sql<boolean>`COALESCE(BOOL_OR(
          ${mediaFiles.accessType} = ${ACCESS_TYPE.FREE}
          AND COALESCE(LOWER(${contentTypes.name}), '') NOT IN (
            ${MEDIA_FILE_TYPE.WEB},
            ${CONTENT_TYPES.WEB.toLowerCase()}
          )
          AND COALESCE(${mediaFiles.buyPrice}, 0) <= 0
          AND COALESCE(${mediaFiles.rentPrice}, 0) <= 0
          AND (${mediaFiles.passwordHash} IS NULL OR ${mediaFiles.passwordHash} = '')
        ), false)`,
      })
      .from(collections)
      .leftJoin(
        collectionItems,
        eq(collectionItems.collectionId, collections.id),
      )
      .leftJoin(
        mediaFiles,
        and(
          eq(mediaFiles.id, collectionItems.mediaFileId),
          eq(mediaFiles.isDeleted, false),
        ),
      )
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .where(
        and(
          eq(collections.creatorId, targetCreatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .groupBy(collections.id)
      .orderBy(desc(collections.sortOrder));

    await populateMissingCollectionCovers(db, result);

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
