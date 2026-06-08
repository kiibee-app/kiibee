import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, ne } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collectionItems,
  contentCategories,
  contentTypes,
  mediaFileCategories,
  mediaFiles,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY } from 'src/utils/constant';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';
import { fail, success } from 'src/utils/sendResponse';

const relatedItemSelect = {
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

export const getRelatedCollectionContentService = async (contentId: string) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const [collectionItem] = await db
      .select({ collectionId: collectionItems.collectionId })
      .from(collectionItems)
      .where(eq(collectionItems.mediaFileId, contentId))
      .limit(1);

    if (!collectionItem) {
      return success(null, 'No related collection content found');
    }

    const rows = await db
      .select(relatedItemSelect)
      .from(collectionItems)
      .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
      .leftJoin(users, eq(users.id, mediaFiles.creatorId))
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .leftJoin(
        mediaFileCategories,
        eq(mediaFileCategories.mediaFileId, mediaFiles.id),
      )
      .leftJoin(
        contentCategories,
        eq(contentCategories.id, mediaFileCategories.categoryId),
      )
      .where(
        and(
          eq(collectionItems.collectionId, collectionItem.collectionId),
          ne(collectionItems.mediaFileId, contentId),
          publishedPublicWhere,
        ),
      );

    if (!rows.length) {
      return success(null, 'No related collection content found');
    }

    const items = rows.map((item) => ({
      ...item,
      publishedAgo: formatTimeAgo(item.createdAt),
    }));

    return success(
      {
        collectionId: collectionItem.collectionId,
        items,
      },
      'Related collection content fetched successfully',
    );
  } catch (error) {
    logger.error('Failed to fetch related collection content:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch related collection content',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
