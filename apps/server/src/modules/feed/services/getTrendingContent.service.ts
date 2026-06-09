import { db } from 'src/database/db';
import {
  mediaFiles,
  users,
  contentTypes,
  mediaFileCategories,
  contentCategories,
} from 'src/database/schema';
import { eq, sql, and, inArray } from 'drizzle-orm';
import { logger } from 'src/logger/logger';
import { success, fail } from 'src/utils/sendResponse';
import { HttpStatus } from '@nestjs/common';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';
import { CONTENT_VISIBILITY } from 'src/utils/constant';
import { dedupeFeedMediaById, orderFeedMediaByIds } from '../feed.helper';

const trendingSelect = {
  id: mediaFiles.id,
  title: mediaFiles.title,
  description: mediaFiles.description,
  thumbnailUrl: mediaFiles.thumbnailUrl,
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

export const getTrendingContentService = async (limit = 10) => {
  try {
    const trendingIds = await db
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(publishedPublicWhere)
      .orderBy(sql`RANDOM()`)
      .limit(limit);

    if (trendingIds.length === 0) {
      return success(
        [],
        'Trending content fetched successfully',
        HttpStatus.OK,
      );
    }

    const ids = trendingIds.map((row) => row.id);

    const rows = await db
      .select(trendingSelect)
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

    const trendingContent = orderFeedMediaByIds(dedupeFeedMediaById(rows), ids);

    const formatted = trendingContent.map((item) => ({
      ...item,
      publishedAgo: formatTimeAgo(item.createdAt),
    }));

    return success(
      formatted,
      'Trending content fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to get trending content:', error);
    return fail(
      'Failed to retrieve trending content',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
