import { HttpStatus } from '@nestjs/common';
import { mediaFileCategories, mediaFiles } from 'src/database/schema';
import type { SQL } from 'drizzle-orm';
import { and, sql, desc } from 'drizzle-orm';
import { success, fail } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY, FIXED_LIMIT } from 'src/utils/constant';
import { ExploreType } from '../dto/exploreQuery.dto';

import { buildSearch, format, cleanNumber } from '../feed.helper';
import {
  getTrendingQuery,
  getLatestQuery,
  getRecentQuery,
  getTopCreatorsQuery,
} from '../feed.query';

type ExploreFilter = {
  contentTypeId?: string | string[];
  creatorId?: string | string[];
  categoryId?: string | string[];
  accessType?: string;
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  rating?: string | number | null;
};

const cleanArray = (val?: string[] | string | null) => {
  if (!val) return undefined;

  const arr = Array.isArray(val) ? val : [val];
  const cleaned = arr.filter((item) => item && item !== 'all');

  return cleaned.length ? cleaned : undefined;
};

const getExploreOrderBy = (type?: ExploreType) => {
  switch (type) {
    case ExploreType.TRENDING:
      return desc(mediaFiles.sortOrder);

    case ExploreType.CREATED_FOR_YOU:
      return desc(mediaFiles.createdAt);

    case ExploreType.NEW:
    default:
      return desc(mediaFiles.publishedAt);
  }
};

export const exploreService = async (
  limit?: number,
  search?: string,
  filter: ExploreFilter = {},
  type?: ExploreType,
) => {
  try {
    const searchCondition = buildSearch(search);
    const minPrice = cleanNumber(filter.minPrice);
    const maxPrice = cleanNumber(filter.maxPrice);
    const rating = cleanNumber(filter.rating);
    const contentTypeIds = cleanArray(filter.contentTypeId);
    const creatorIds = cleanArray(filter.creatorId);
    const categoryIds = cleanArray(filter.categoryId);

    const baseWhereParts: SQL[] = [
      sql`${mediaFiles.visibility} = ${CONTENT_VISIBILITY.PUBLIC}`,
      sql`${mediaFiles.isPublished} = true`,
      sql`${mediaFiles.isDeleted} = false`,
    ];
    const baseWhere = and(...baseWhereParts);

    const [trending, recent, topCreators] = await Promise.all([
      getTrendingQuery(baseWhere, FIXED_LIMIT),
      getRecentQuery(baseWhere, FIXED_LIMIT),
      getTopCreatorsQuery(),
    ]);

    const extra: SQL[] = [];

    if (contentTypeIds?.length) {
      extra.push(
        sql`${mediaFiles.contentTypeId} IN (${sql.join(
          contentTypeIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      );
    }

    if (creatorIds?.length) {
      extra.push(
        sql`${mediaFiles.creatorId} IN (${sql.join(
          creatorIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      );
    }

    if (categoryIds?.length) {
      extra.push(
        sql`${mediaFiles.id} IN (
          SELECT ${mediaFileCategories.mediaFileId}
          FROM ${mediaFileCategories}
          WHERE ${mediaFileCategories.categoryId} IN (${sql.join(
            categoryIds.map((id) => sql`${id}`),
            sql`, `,
          )})
        )`,
      );
    }

    if (filter.accessType) {
      extra.push(sql`${mediaFiles.accessType} = ${filter.accessType}`);
    }

    if (minPrice !== undefined) {
      extra.push(sql`CAST(${mediaFiles.buyPrice} AS NUMERIC) >= ${minPrice}`);
    }

    if (maxPrice !== undefined) {
      extra.push(
        sql`(
      CAST(${mediaFiles.buyPrice} AS NUMERIC) <= ${maxPrice}
      OR ${mediaFiles.buyPrice} IS NULL
    )`,
      );
    }

    if (rating !== undefined) {
      extra.push(sql`CAST(${mediaFiles.rating} AS NUMERIC) >= ${rating}`);
    }

    const latestWhereParts = [...baseWhereParts];

    if (searchCondition) {
      latestWhereParts.push(searchCondition);
    }

    if (extra.length) {
      latestWhereParts.push(...extra);
    }

    const latest = await getLatestQuery(
      and(...latestWhereParts),
      getExploreOrderBy(type),
      limit ?? FIXED_LIMIT,
    );

    return success(
      {
        trending: format(trending),
        latest: format(latest),
        recent: format(recent),
        topCreators,
      },
      'Explore content fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to get explore content:', error);

    return fail(
      'Failed to retrieve explore content',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
