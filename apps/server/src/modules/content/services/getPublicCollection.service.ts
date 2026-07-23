import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, gt, isNull, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  collectionItems,
  contentCategories,
  contentTypes,
  mediaFileCategories,
  mediaFiles,
  userContentAccess,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY } from 'src/utils/constant';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';
import { fail, success } from 'src/utils/sendResponse';

const collectionItemSelect = {
  id: mediaFiles.id,
  title: mediaFiles.title,
  description: mediaFiles.description,
  thumbnailUrl: mediaFiles.thumbnailUrl,
  thumbnailLandscapeUrl: mediaFiles.thumbnailLandscapeUrl,
  creatorId: mediaFiles.creatorId,
  creatorName: users.fullName,
  contentType: contentTypes.name,
  accessType: mediaFiles.accessType,
  categoryName: contentCategories.name,
  buyPrice: mediaFiles.buyPrice,
  rentPrice: mediaFiles.rentPrice,
  createdAt: mediaFiles.createdAt,
};

const publishedPublicWhere = and(
  eq(mediaFiles.visibility, CONTENT_VISIBILITY.PUBLIC),
  eq(mediaFiles.isPublished, true),
  eq(mediaFiles.isDeleted, false),
);

const hasActiveCollectionAccess = async (
  collectionId: string,
  userId: string,
) => {
  const now = new Date();

  const [access] = await db
    .select({ id: userContentAccess.id })
    .from(userContentAccess)
    .where(
      and(
        eq(userContentAccess.userId, userId),
        eq(userContentAccess.collectionId, collectionId),
        isNull(userContentAccess.mediaFileId),
        or(
          isNull(userContentAccess.rentExpiresAt),
          gt(userContentAccess.rentExpiresAt, now),
        ),
      ),
    )
    .limit(1);

  return Boolean(access);
};

export const getPublicCollectionService = async (
  collectionId: string,
  viewerId?: string,
) => {
  try {
    if (!collectionId) {
      return fail('Collection ID is required', HttpStatus.BAD_REQUEST);
    }

    const [collection] = await db
      .select({
        id: collections.id,
        name: collections.name,
        description: collections.description,
        isDeleted: collections.isDeleted,
      })
      .from(collections)
      .where(eq(collections.id, collectionId))
      .limit(1);

    if (!collection) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    if (collection.isDeleted) {
      if (
        !viewerId ||
        !(await hasActiveCollectionAccess(collectionId, viewerId))
      ) {
        return fail('Collection not found', HttpStatus.NOT_FOUND);
      }
    }

    const itemConditions = [eq(collectionItems.collectionId, collectionId)];
    if (!collection.isDeleted) {
      itemConditions.push(publishedPublicWhere!);
    }

    const rows = await db
      .select(collectionItemSelect)
      .from(collectionItems)
      .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
      .innerJoin(
        users,
        and(eq(users.id, mediaFiles.creatorId), eq(users.isDeleted, false)),
      )
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .leftJoin(
        mediaFileCategories,
        eq(mediaFileCategories.mediaFileId, mediaFiles.id),
      )
      .leftJoin(
        contentCategories,
        eq(contentCategories.id, mediaFileCategories.categoryId),
      )
      .where(and(...itemConditions));

    const items = rows.map((item) => ({
      ...item,
      publishedAgo: formatTimeAgo(item.createdAt),
    }));

    return success(
      {
        collectionId: collection.id,
        name: collection.name,
        description: collection.description,
        items,
      },
      'Collection fetched successfully',
    );
  } catch (error) {
    logger.error('Failed to fetch public collection:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch collection details',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
