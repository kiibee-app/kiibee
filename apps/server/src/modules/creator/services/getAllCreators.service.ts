import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, sql, and, asc, desc, inArray, ilike } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  emailSubscribers,
  mediaFiles,
  userContentCategory,
  users,
  contentCategories,
  featureCreators,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE, SORT_DIRECTIONS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

type SortBy = 'name' | 'subscriberCount' | 'newest' | 'top' | 'featured';

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

    const orderCondition = hasSearch
      ? desc(
          sql`
              CASE 
                WHEN ${users.fullName} ILIKE ${'%' + search + '%'} 
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
            : asc(users.fullName);

    const allCreators = await db
      .select({
        id: users.id,
        name: users.fullName,
        profileImageUrl: users.avatarUrl,
        createdAt: users.createdAt,
        uploadCount: uploadCountSql,
        subscriberCount: subscriberCountSql,
        categoryIds: userContentCategory.categoryIds,
      })
      .from(users)
      .leftJoin(mediaFiles, eq(mediaFiles.creatorId, users.id))
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

          hasSearch ? ilike(users.fullName, `%${search}%`) : sql`TRUE`,
        ),
      )
      .groupBy(
        users.id,
        users.fullName,
        users.avatarUrl,
        users.createdAt,
        userContentCategory.categoryIds,
        featureCreators.creatorId,
      )
      .orderBy(orderCondition)
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

    const result = allCreators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      profileImageUrl: creator.profileImageUrl,
      createdAt: creator.createdAt,
      uploadCount: creator.uploadCount,
      subscriberCount: creator.subscriberCount,
      contentCategory: (creator.categoryIds || [])
        .map((id) => categoryNameMap.get(id))
        .filter((name): name is string => !!name),
    }));

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
