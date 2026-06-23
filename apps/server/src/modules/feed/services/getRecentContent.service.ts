import { db } from 'src/database/db';
import {
  mediaFiles,
  users,
  contentTypes,
  mediaFileCategories,
  contentCategories,
} from 'src/database/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { logger } from 'src/logger/logger';
import { success, fail } from 'src/utils/sendResponse';
import { HttpStatus } from '@nestjs/common';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';
import { CONTENT_VISIBILITY } from 'src/utils/constant';
import { dedupeFeedMediaById, orderFeedMediaByIds } from '../feed.helper';

const recentSelect = {
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

export const getRecentContentService = async (limit = 10) => {
  try {
    const recentIds = await db
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(publishedPublicWhere)
      .orderBy(desc(mediaFiles.createdAt))
      .limit(limit);

    if (recentIds.length === 0) {
      return success([], 'Recent content fetched successfully', HttpStatus.OK);
    }

    const ids = recentIds.map((row) => row.id);

    const rows = await db
      .select(recentSelect)
      .from(mediaFiles)
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
      .where(inArray(mediaFiles.id, ids));

    const recentContent = orderFeedMediaByIds(dedupeFeedMediaById(rows), ids);

    const formatted = recentContent.map((item) => ({
      ...item,
      publishedAgo: formatTimeAgo(item.createdAt),
    }));

    return success(
      formatted,
      'Recent content fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to get recent content:', error);
    return fail(
      'Failed to retrieve recent content',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
