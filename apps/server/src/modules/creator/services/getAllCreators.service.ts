import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, sql, and, asc, desc, inArray, ilike, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentAppearance,
  creatorChannels,
  emailSubscribers,
  mediaFiles,
  userContentCategory,
  users,
  contentCategories,
  featureCreators,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY, ROLE, SORT_DIRECTIONS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

type SortBy = 'name' | 'subscriberCount' | 'newest' | 'top' | 'featured';

const publishedMediaJoinCondition = and(
  eq(mediaFiles.creatorId, users.id),
  eq(mediaFiles.isDeleted, false),
  eq(mediaFiles.isPublished, true),
  eq(mediaFiles.visibility, CONTENT_VISIBILITY.PUBLIC),
);

const creatorDisplayNameSql = sql<string>`trim(coalesce(
  nullif(${creatorChannels.name}, ''),
  nullif(${users.fullName}, ''),
  nullif(concat(coalesce(${users.firstName}, ''), ' ', coalesce(${users.lastName}, '')), '')
))`;

export const allCreatorsService = async ({
  limit,
  sortBy = 'name',
  search,
}: {
  limit?: number;
  sortBy?: SortBy;
  search?: string;
}) => {
  try {
    const uploadCountSql = sql<number>`
      COUNT(DISTINCT ${mediaFiles.id})
    `;

    const subscriberCountSql = sql<number>`
      COUNT(DISTINCT ${emailSubscribers.id})
    `;

    const isFeaturedOnly = sortBy === 'featured';

    const hasSearch = !!search?.trim();

    const hasImageSql = sql<number>`
      CASE 
        WHEN ${creatorChannels.coverImageUrl} IS NOT NULL AND trim(${creatorChannels.coverImageUrl}) <> '' THEN 1
        WHEN ${users.avatarUrl} IS NOT NULL AND trim(${users.avatarUrl}) <> '' THEN 1
        ELSE 0
      END
    `;

    const primarySort = hasSearch
      ? desc(
          sql`
              CASE 
                WHEN ${creatorDisplayNameSql} ILIKE ${'%' + search + '%'} 
                THEN 1 ELSE 0 
              END
            `,
        )
      : sortBy === SORT_DIRECTIONS.SUBSCRIBER_COUNT
        ? desc(subscriberCountSql)
        : sortBy === SORT_DIRECTIONS.TOP
          ? desc(uploadCountSql)
          : sortBy === SORT_DIRECTIONS.NEWEST
            ? desc(users.createdAt)
            : asc(creatorDisplayNameSql);

    const orderCondition = [desc(hasImageSql), primarySort];

    const allCreators = await db
      .select({
        id: users.id,
        name: creatorDisplayNameSql.as('name'),
        profileImageUrl: users.avatarUrl,
        coverImageUrl: creatorChannels.coverImageUrl,
        createdAt: users.createdAt,
        uploadCount: uploadCountSql,
        subscriberCount: subscriberCountSql,
        layout: contentAppearance.layout,
        categoryIds: userContentCategory.categoryIds,
      })
      .from(users)
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .leftJoin(contentAppearance, eq(contentAppearance.userId, users.id))
      .leftJoin(mediaFiles, publishedMediaJoinCondition)
      .leftJoin(emailSubscribers, eq(emailSubscribers.creatorId, users.id))
      .leftJoin(userContentCategory, eq(userContentCategory.userId, users.id))
      .leftJoin(featureCreators, eq(featureCreators.creatorId, users.id))
      .where(
        and(
          eq(users.isActive, true),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),

          isFeaturedOnly
            ? sql`${featureCreators.creatorId} IS NOT NULL`
            : sql`TRUE`,

          hasSearch
            ? or(
                ilike(users.fullName, `%${search}%`),
                ilike(users.firstName, `%${search}%`),
                ilike(users.lastName, `%${search}%`),
                ilike(creatorChannels.name, `%${search}%`),
                sql`${creatorDisplayNameSql} ILIKE ${'%' + search + '%'}`,
              )
            : sql`TRUE`,
        ),
      )
      .groupBy(
        users.id,
        users.fullName,
        users.firstName,
        users.lastName,
        users.avatarUrl,
        users.createdAt,
        creatorChannels.name,
        creatorChannels.coverImageUrl,
        contentAppearance.layout,
        userContentCategory.categoryIds,
        featureCreators.creatorId,
      )
      .orderBy(...orderCondition)
      .limit(limit ?? 24);

    const allCategoryIds = allCreators
      .flatMap((creator) => creator.categoryIds || [])
      .filter((id, index, self) => self.indexOf(id) === index);

    const categoryNameMap = new Map<string, string>();

    if (allCategoryIds.length > 0) {
      const categories = await db
        .select({
          id: contentCategories.id,
          name: contentCategories.name,
        })
        .from(contentCategories)
        .where(inArray(contentCategories.id, allCategoryIds));

      for (const cat of categories) {
        categoryNameMap.set(cat.id, cat.name);
      }
    }

    const result = allCreators
      .map((creator) => ({
        id: creator.id,
        name: creator.name,
        profileImageUrl: creator.profileImageUrl,
        coverImageUrl: creator.coverImageUrl,
        createdAt: creator.createdAt,
        uploadCount: Number(creator.uploadCount ?? 0),
        subscriberCount: Number(creator.subscriberCount ?? 0),
        layout: creator.layout,
        contentCategory: (creator.categoryIds || [])
          .map((id) => categoryNameMap.get(id))
          .filter((name): name is string => !!name),
      }))
      .filter((creator) => creator.name.trim().length > 0);

    return success(result, 'All creators fetched successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to fetch all creators:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch all creators',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
