import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, ne } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collectionItems,
  collections,
  contentCategories,
  contentTypes,
  mediaFileCategories,
  mediaFiles,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY } from 'src/utils/constant';
import { publiclyVisibleCreatorWhere } from 'src/utils/publicCreatorVisibility';
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

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        contentId,
      );

    let resolvedMediaFileId = contentId;
    if (!isUuid) {
      const [mediaFile] = await db
        .select({ id: mediaFiles.id })
        .from(mediaFiles)
        .where(eq(mediaFiles.slug, contentId))
        .limit(1);
      if (mediaFile) {
        resolvedMediaFileId = mediaFile.id;
      }
    }

    const [collectionItem] = await db
      .select({
        collectionId: collectionItems.collectionId,
        accessType: collections.accessType,
        buyPrice: collections.buyPrice,
        rentPrice: collections.rentPrice,
        rentDuration: collections.rentDuration,
      })
      .from(collectionItems)
      .innerJoin(
        collections,
        and(
          eq(collections.id, collectionItems.collectionId),
          eq(collections.isDeleted, false),
        ),
      )
      .where(eq(collectionItems.mediaFileId, resolvedMediaFileId))
      .limit(1);

    if (!collectionItem) {
      return success(null, 'No related collection content found');
    }

    const rows = await db
      .select(relatedItemSelect)
      .from(collectionItems)
      .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
      .innerJoin(
        users,
        and(
          eq(users.id, mediaFiles.creatorId),
          eq(users.isDeleted, false),
          publiclyVisibleCreatorWhere,
        ),
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
      .where(
        and(
          eq(collectionItems.collectionId, collectionItem.collectionId),
          ne(collectionItems.mediaFileId, resolvedMediaFileId),
          publishedPublicWhere,
        ),
      );

    const items = rows.map((item) => ({
      ...item,
      publishedAgo: formatTimeAgo(item.createdAt),
    }));

    return success(
      {
        collectionId: collectionItem.collectionId,
        accessType: collectionItem.accessType,
        buyPrice: collectionItem.buyPrice,
        rentPrice: collectionItem.rentPrice,
        rentDuration: collectionItem.rentDuration,
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
