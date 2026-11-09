import { publicCreatorName } from 'src/utils/publicCreatorName';
import { db } from 'src/database/db';
import {
  mediaFiles,
  users,
  contentTypes,
  mediaFileCategories,
  contentCategories,
  emailSubscribers,
  creatorChannels,
} from 'src/database/schema';
import { eq, desc, and, sql, inArray } from 'drizzle-orm';
import {
  CONTENT_VISIBILITY,
  RECENT_CANDIDATE_MULTIPLIER,
  RECENT_MIN_CANDIDATE_LIMIT,
  ROLE,
} from 'src/utils/constant';
import {
  creatorContentIsDiscoverable,
  publiclyVisibleCreatorWhere,
} from 'src/utils/publicCreatorVisibility';
import {
  balanceFeedMediaByCreator,
  dedupeFeedMediaByCreator,
  dedupeFeedMediaById,
  orderFeedMediaByIds,
} from './feed.helper';

const baseSelect = {
  id: mediaFiles.id,
  slug: mediaFiles.slug,
  title: mediaFiles.title,
  description: mediaFiles.description,
  thumbnailUrl: mediaFiles.thumbnailUrl,
  thumbnailLandscapeUrl: mediaFiles.thumbnailLandscapeUrl,
  creatorId: mediaFiles.creatorId,
  creatorName: publicCreatorName,
  creatorSlug: creatorChannels.slug,
  contentType: contentTypes.name,
  accessType: mediaFiles.accessType,
  categoryName: contentCategories.name,
  buyPrice: mediaFiles.buyPrice,
  rentPrice: mediaFiles.rentPrice,
  collectionId: sql<string | null>`(
    SELECT ci.collection_id FROM collection_items ci
    INNER JOIN collections c ON c.id = ci.collection_id AND c.is_deleted = false
    WHERE ci.media_file_id = media_files.id
    LIMIT 1
  )`,
  collectionSlug: sql<string | null>`(
    SELECT c.slug FROM collection_items ci
    INNER JOIN collections c ON c.id = ci.collection_id AND c.is_deleted = false
    WHERE ci.media_file_id = media_files.id
    LIMIT 1
  )`,
  collectionName: sql<string | null>`(
    SELECT c.name FROM collection_items ci
    INNER JOIN collections c ON c.id = ci.collection_id AND c.is_deleted = false
    WHERE ci.media_file_id = media_files.id
    LIMIT 1
  )`,
  createdAt: mediaFiles.createdAt,
  contentUrl: mediaFiles.contentUrl,
};

async function fetchMediaFilesByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const rows = await db
    .select(baseSelect)
    .from(mediaFiles)
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
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .where(
      and(
        inArray(mediaFiles.id, ids),
        eq(mediaFiles.isDeleted, false),
        creatorContentIsDiscoverable,
      ),
    );

  return orderFeedMediaByIds(dedupeFeedMediaById(rows), ids);
}

// Aggregate once instead of rescanning access and analytics for every candidate.
// COUNT(DISTINCT access_id) preserves the old OR semantics when an access row
// references both the media file and a collection containing that file.
const trendingAccessCounts = sql`(
  SELECT access_routes.media_file_id, COUNT(DISTINCT access_routes.access_id)::int AS access_count
  FROM (
    SELECT uca.id AS access_id, uca.media_file_id
    FROM user_content_access uca WHERE uca.media_file_id IS NOT NULL
    UNION
    SELECT uca.id AS access_id, ci.media_file_id
    FROM user_content_access uca
    INNER JOIN collection_items ci ON ci.collection_id = uca.collection_id
  ) access_routes
  GROUP BY access_routes.media_file_id
) AS trending_access`;

const trendingAnalytics = sql`(
  SELECT media_file_id,
    SUM(purchases + rentals)::int AS conversion_count,
    SUM(views + visits)::int AS engagement_count
  FROM analytics_daily_summary
  GROUP BY media_file_id
) AS trending_analytics`;

const trendingScore = sql<number>`(
  COALESCE(trending_access.access_count, 0) * 100
  + COALESCE(trending_analytics.conversion_count, 0) * 50
  + COALESCE(trending_analytics.engagement_count, 0)
  + (CASE WHEN ${mediaFiles.accessType} = 'paid' OR ${mediaFiles.buyPrice} IS NOT NULL OR ${mediaFiles.rentPrice} IS NOT NULL THEN 10 ELSE 0 END)
)`;

export const getTrendingQuery = async (where: any, limit: number) => {
  const candidateLimit = Math.max(
    limit * RECENT_CANDIDATE_MULTIPLIER,
    RECENT_MIN_CANDIDATE_LIMIT,
  );

  const idRows = await db
    .select({ id: mediaFiles.id })
    .from(mediaFiles)
    .innerJoin(
      users,
      and(
        eq(users.id, mediaFiles.creatorId),
        eq(users.isDeleted, false),
        publiclyVisibleCreatorWhere,
      ),
    )
    .leftJoin(
      trendingAccessCounts,
      sql`trending_access.media_file_id = ${mediaFiles.id}`,
    )
    .leftJoin(
      trendingAnalytics,
      sql`trending_analytics.media_file_id = ${mediaFiles.id}`,
    )
    .where(where)
    .orderBy(desc(trendingScore), desc(mediaFiles.createdAt))
    .limit(candidateLimit);

  const candidates = await fetchMediaFilesByIds(idRows.map((row) => row.id));

  return balanceFeedMediaByCreator(candidates, limit);
};

export const getLatestQuery = async (
  where: any,
  orderBy: any,
  limit: number,
) => {
  const idRows = await db
    .select({ id: mediaFiles.id })
    .from(mediaFiles)
    .innerJoin(
      users,
      and(
        eq(users.id, mediaFiles.creatorId),
        eq(users.isDeleted, false),
        publiclyVisibleCreatorWhere,
      ),
    )
    .where(where)
    .orderBy(orderBy)
    .limit(limit);

  return fetchMediaFilesByIds(idRows.map((row) => row.id));
};

export const getRecentQuery = async (where: any, limit: number) => {
  const candidateLimit = Math.max(
    limit * RECENT_CANDIDATE_MULTIPLIER,
    RECENT_MIN_CANDIDATE_LIMIT,
  );

  const idRows = await db
    .select({ id: mediaFiles.id })
    .from(mediaFiles)
    .innerJoin(
      users,
      and(
        eq(users.id, mediaFiles.creatorId),
        eq(users.isDeleted, false),
        publiclyVisibleCreatorWhere,
      ),
    )
    .where(where)
    .orderBy(desc(mediaFiles.createdAt))
    .limit(candidateLimit);

  const candidates = await fetchMediaFilesByIds(idRows.map((row) => row.id));

  return dedupeFeedMediaByCreator(candidates, limit);
};

export const getTopCreatorsQuery = (limit = 10) =>
  db
    .select({
      id: users.id,
      name: publicCreatorName,
      profileImageUrl: users.avatarUrl,
      createdAt: users.createdAt,
      uploadCount: sql<number>`COUNT(DISTINCT media_files.id)`,
      subscriberCount: sql<number>`COUNT(DISTINCT email_subscribers.id)`,
      slug: creatorChannels.slug,
    })
    .from(users)
    .leftJoin(
      mediaFiles,
      and(
        eq(mediaFiles.creatorId, users.id),
        eq(mediaFiles.isDeleted, false),
        eq(mediaFiles.isPublished, true),
        eq(mediaFiles.visibility, CONTENT_VISIBILITY.PUBLIC),
      ),
    )
    .leftJoin(emailSubscribers, eq(emailSubscribers.creatorId, users.id))
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .where(
      and(
        eq(users.isActive, true),
        eq(users.role, ROLE.CREATOR),
        eq(users.isDeleted, false),
        publiclyVisibleCreatorWhere,
      ),
    )
    .groupBy(
      users.id,
      users.fullName,
      users.avatarUrl,
      users.createdAt,
      creatorChannels.slug,
    )
    .orderBy(desc(sql`COUNT(DISTINCT media_files.id)`))
    .limit(limit);
