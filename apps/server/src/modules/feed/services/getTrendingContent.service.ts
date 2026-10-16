import { db } from 'src/database/db';
import {
  mediaFiles,
  users,
  contentTypes,
  mediaFileCategories,
  contentCategories,
} from 'src/database/schema';
import { eq, sql, and, inArray, desc } from 'drizzle-orm';
import { logger } from 'src/logger/logger';
import { success, fail } from 'src/utils/sendResponse';
import { HttpStatus } from '@nestjs/common';
import { formatTimeAgo } from 'src/utils/formatTimeAgo';
import {
  CONTENT_VISIBILITY,
  RECENT_CANDIDATE_MULTIPLIER,
  RECENT_MIN_CANDIDATE_LIMIT,
} from 'src/utils/constant';
import {
  creatorContentIsDiscoverable,
  publiclyVisibleCreatorWhere,
} from 'src/utils/publicCreatorVisibility';
import {
  balanceFeedMediaByCreator,
  dedupeFeedMediaById,
  orderFeedMediaByIds,
} from '../feed.helper';

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
  contentUrl: mediaFiles.contentUrl,
};

const publishedPublicWhere = and(
  eq(mediaFiles.visibility, CONTENT_VISIBILITY.PUBLIC),
  eq(mediaFiles.isPublished, true),
  eq(mediaFiles.isDeleted, false),
);

const activeCreatorJoin = and(
  eq(users.id, mediaFiles.creatorId),
  eq(users.isDeleted, false),
  publiclyVisibleCreatorWhere,
  creatorContentIsDiscoverable,
);

const trendingScore = sql<number>`(
  -- Purchases and rentals from user_content_access (primary weight)
  COALESCE((
    SELECT COUNT(*)::int
    FROM user_content_access uca
    WHERE uca.media_file_id = ${mediaFiles.id}
       OR uca.collection_id IN (
         SELECT ci.collection_id
         FROM collection_items ci
         WHERE ci.media_file_id = ${mediaFiles.id}
       )
  ), 0) * 100
  +
  -- Analytics purchases & rentals
  COALESCE((
    SELECT SUM(ads.purchases + ads.rentals)::int
    FROM analytics_daily_summary ads
    WHERE ads.media_file_id = ${mediaFiles.id}
  ), 0) * 50
  +
  -- Engagement (views and visits)
  COALESCE((
    SELECT SUM(ads.views + ads.visits)::int
    FROM analytics_daily_summary ads
    WHERE ads.media_file_id = ${mediaFiles.id}
  ), 0)
  +
  -- Priority to monetized buy/rent content
  (CASE WHEN ${mediaFiles.accessType} = 'paid' OR ${mediaFiles.buyPrice} IS NOT NULL OR ${mediaFiles.rentPrice} IS NOT NULL THEN 10 ELSE 0 END)
)`;

export const getTrendingContentService = async (limit = 10) => {
  try {
    const candidateLimit = Math.max(
      limit * RECENT_CANDIDATE_MULTIPLIER,
      RECENT_MIN_CANDIDATE_LIMIT,
    );

    const trendingIds = await db
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .innerJoin(users, activeCreatorJoin)
      .where(publishedPublicWhere)
      .orderBy(desc(trendingScore), desc(mediaFiles.createdAt))
      .limit(candidateLimit);

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
      .innerJoin(users, activeCreatorJoin)
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .leftJoin(
        mediaFileCategories,
        eq(mediaFileCategories.mediaFileId, mediaFiles.id),
      )
      .leftJoin(
        contentCategories,
        eq(contentCategories.id, mediaFileCategories.categoryId),
      )
      .where(and(inArray(mediaFiles.id, ids), publishedPublicWhere));

    const trendingContent = balanceFeedMediaByCreator(
      orderFeedMediaByIds(dedupeFeedMediaById(rows), ids),
      limit,
    );

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
