import { HttpStatus } from '@nestjs/common';
import { mediaFiles } from 'src/database/schema';
import type { SQL } from 'drizzle-orm';
import { sql, desc, eq, and } from 'drizzle-orm';
import { success, fail } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import {
  CONTENT_VISIBILITY,
  FIXED_LIMIT,
  SORT_DIRECTIONS,
} from 'src/utils/constant';

import { db } from 'src/database/db';
import {
  users,
  contentTypes,
  mediaFileCategories,
  contentCategories,
} from 'src/database/schema';

import { buildSearch, format } from '../content.helper';

const baseSelect = {
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
  sortOrder: mediaFiles.sortOrder,
  rating: mediaFiles.rating,
};

export type SortField = 'all' | 'new' | 'popular' | 'free';

export type GetAllContentsFilter = {
  search?: string;
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

  const cleaned = arr.filter(Boolean);

  return cleaned.length ? cleaned : undefined;
};

const cleanNumberValue = (val?: string | number | null) => {
  if (val === null || val === undefined || val === '') return undefined;

  const num = Number(val);

  return Number.isFinite(num) ? num : undefined;
};

export const getAllContentsService = async (
  limit = FIXED_LIMIT,
  search = '',
  sort: SortField = 'all',
  filter: GetAllContentsFilter = {},
) => {
  try {
    const minPrice = cleanNumberValue(filter.minPrice);
    const maxPrice = cleanNumberValue(filter.maxPrice);
    const rating = cleanNumberValue(filter.rating);

    const contentTypeIds = cleanArray(filter.contentTypeId);
    const creatorIds = cleanArray(filter.creatorId);
    const categoryIds = cleanArray(filter.categoryId);

    const searchCondition = buildSearch(search);

    const baseWhere: SQL[] = [
      sql`${mediaFiles.visibility} = ${CONTENT_VISIBILITY.PUBLIC}`,
      sql`${mediaFiles.isPublished} = true`,
      sql`${mediaFiles.isDeleted} = false`,
    ];

    if (sort === SORT_DIRECTIONS.FREE) {
      baseWhere.push(sql`${mediaFiles.buyPrice} IS NULL`);
    }

    if (contentTypeIds?.length) {
      baseWhere.push(
        sql`${mediaFiles.contentTypeId} IN (${sql.join(
          contentTypeIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      );
    }

    if (creatorIds?.length) {
      baseWhere.push(
        sql`${mediaFiles.creatorId} IN (${sql.join(
          creatorIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      );
    }

    if (categoryIds?.length) {
      baseWhere.push(
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
      baseWhere.push(sql`${mediaFiles.accessType} = ${filter.accessType}`);
    }

    if (minPrice !== undefined) {
      baseWhere.push(
        sql`CAST(${mediaFiles.buyPrice} AS NUMERIC) >= ${minPrice}`,
      );
    }

    if (maxPrice !== undefined) {
      baseWhere.push(
        sql`(
          CAST(${mediaFiles.buyPrice} AS NUMERIC) <= ${maxPrice}
          OR ${mediaFiles.buyPrice} IS NULL
        )`,
      );
    }

    if (rating !== undefined) {
      baseWhere.push(sql`CAST(${mediaFiles.rating} AS NUMERIC) >= ${rating}`);
    }

    if (searchCondition) {
      baseWhere.push(searchCondition);
    }

    const whereClause = and(...baseWhere);

    let orderBy;

    switch (sort) {
      case SORT_DIRECTIONS.NEW:
        orderBy = desc(mediaFiles.publishedAt);
        break;

      case SORT_DIRECTIONS.POPULAR:
        orderBy = sql`RANDOM()`;
        break;

      case SORT_DIRECTIONS.FREE:
        orderBy = desc(mediaFiles.publishedAt);
        break;

      case SORT_DIRECTIONS.ALL:
      default:
        orderBy = desc(mediaFiles.publishedAt);
        break;
    }

    const data = await db
      .select(baseSelect)
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
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit);

    const formatted = format(data);

    return success(
      formatted,
      'All contents fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to get all contents:', error);

    return fail(
      'Failed to retrieve contents',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
