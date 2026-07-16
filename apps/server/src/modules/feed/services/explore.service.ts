import { HttpStatus } from '@nestjs/common';
import { mediaFiles, mediaFileCategories } from 'src/database/schema';
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

const cleanArray = (value?: string[] | string | null) => {
  if (!value) return [];

  const values = Array.isArray(value) ? value : [value];

  return values.filter((item): item is string => Boolean(item));
};

const pushCondition = (
  conditions: SQL[],
  column: typeof mediaFiles.contentTypeId | typeof mediaFiles.creatorId,
  values: string[],
) => {
  if (!values.length) return;

  conditions.push(
    sql`${column} IN (${sql.join(
      values.map((id) => sql`${id}`),
      sql`, `,
    )})`,
  );
};

export const exploreService = async (
  limit?: number,
  search?: string,
  filter?: any,
) => {
  try {
    const resolvedLimit = limit ?? FIXED_LIMIT;
    const searchCondition = buildSearch(search);
    const contentTypeIds = cleanArray(filter?.contentTypeId);
    const creatorIds = cleanArray(filter?.creatorId);
    const categoryIds = cleanArray(filter?.categoryId);
    const minPrice = cleanNumber(filter?.minPrice) || undefined;
    const maxPrice = cleanNumber(filter?.maxPrice) || undefined;
    const baseConditions: SQL[] = [
      sql`${mediaFiles.visibility} = ${CONTENT_VISIBILITY.PUBLIC}`,
      sql`${mediaFiles.isPublished} = true`,
      sql`${mediaFiles.isDeleted} = false`,
    ];
    const extra: SQL[] = [];

    if (searchCondition) {
      baseConditions.push(searchCondition);
    }

    pushCondition(extra, mediaFiles.contentTypeId, contentTypeIds);
    pushCondition(extra, mediaFiles.creatorId, creatorIds);

    if (categoryIds.length) {
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

    const baseWhere = sql.join(baseConditions, sql` AND `);
    const latestWhere = extra.length
      ? sql`${baseWhere} AND ${sql.join(extra, sql` AND `)}`
      : baseWhere;

    const [trending, recent, latest, topCreators] = await Promise.all([
      getTrendingQuery(baseWhere, resolvedLimit),
      getRecentQuery(baseWhere, resolvedLimit),
      getLatestQuery(latestWhere, desc(mediaFiles.publishedAt), resolvedLimit),
      getTopCreatorsQuery(),
    ]);

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
