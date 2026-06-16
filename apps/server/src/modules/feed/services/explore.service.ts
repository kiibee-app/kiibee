import { HttpStatus } from '@nestjs/common';
import { mediaFiles } from 'src/database/schema';
import type { SQL } from 'drizzle-orm';
import { sql, desc } from 'drizzle-orm';
import { success, fail } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY, FIXED_LIMIT } from 'src/utils/constant';

import { buildSearch, format, cleanNumber } from '../feed.helper';
import {
  getTrendingQuery,
  getLatestQuery,
  getRecentQuery,
  getTopCreatorsQuery,
} from '../feed.query';

export const exploreService = async (
  limit?: number,
  search?: string,
  filter?: any,
) => {
  try {
    const searchCondition = buildSearch(search);
    const minPrice = cleanNumber(filter?.minPrice) || undefined;
    const maxPrice = cleanNumber(filter?.maxPrice) || undefined;

    const baseWhere = sql`
      ${mediaFiles.visibility} = ${CONTENT_VISIBILITY.PUBLIC}
      AND ${mediaFiles.isPublished} = true
      AND ${mediaFiles.isDeleted} = false
    `;

    const resolvedLimit = limit ?? FIXED_LIMIT;

    const [trending, recent, topCreators] = await Promise.all([
      getTrendingQuery(baseWhere, resolvedLimit),
      getRecentQuery(baseWhere, resolvedLimit),
      getTopCreatorsQuery(),
    ]);

    const extra: SQL[] = [];

    if (filter?.contentTypeId) {
      const ids = (
        Array.isArray(filter.contentTypeId)
          ? filter.contentTypeId
          : [filter.contentTypeId]
      ).filter(Boolean);

      if (ids.length) {
        extra.push(
          sql`${mediaFiles.contentTypeId} IN (${sql.join(
            ids.map((id) => sql`${id}`),
            sql`, `,
          )})`,
        );
      }
    }

    if (filter?.creatorId) {
      const ids = (
        Array.isArray(filter.creatorId) ? filter.creatorId : [filter.creatorId]
      ).filter(Boolean);

      if (ids.length) {
        extra.push(
          sql`${mediaFiles.creatorId} IN (${sql.join(
            ids.map((id) => sql`${id}`),
            sql`, `,
          )})`,
        );
      }
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

    let latestWhere = baseWhere;

    if (searchCondition) {
      latestWhere = sql`${latestWhere} AND ${searchCondition}`;
    }

    if (extra.length) {
      latestWhere = sql`${latestWhere} AND ${sql.join(extra, sql` AND `)}`;
    }

    const latest = await getLatestQuery(
      latestWhere,
      desc(mediaFiles.publishedAt),
      resolvedLimit,
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
