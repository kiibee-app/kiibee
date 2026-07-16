import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorChannels,
  creatorInfo,
  creatorPlans,
  contentAppearance,
  emailSubscribers,
  mediaFiles,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import {
  DEFAULT_LIMIT,
  getSafePositiveInteger,
  MAX_LIMIT,
} from 'src/utils/pagination';
import { reconcileMissingCreatorChannels } from 'src/database/seed/reconcileCreatorChannels.seed';

export const getAdminCreatorsService = async ({
  search,
  plan,
  page,
  limit,
}: {
  search?: string;
  plan?: string;
  page?: number;
  limit?: number;
} = {}) => {
  try {
    await reconcileMissingCreatorChannels();
    const uploadCountSql = sql<number>`
      COUNT(DISTINCT ${mediaFiles.id})::int
    `;
    const subscriberCountSql = sql<number>`
      COUNT(DISTINCT ${emailSubscribers.id})::int
    `;
    const planNameSql = sql<string | null>`
      MAX(${plans.name})
    `;
    const searchTerm = search?.trim();
    const searchPattern = searchTerm ? `%${searchTerm}%` : undefined;
    const planTerm = plan?.trim();
    const requestedPage = getSafePositiveInteger(page, 1);
    const pageSize = getSafePositiveInteger(limit, DEFAULT_LIMIT, MAX_LIMIT);
    const filters = [eq(users.role, ROLE.CREATOR), eq(users.isDeleted, false)];

    if (searchPattern) {
      const searchFilter = or(
        ilike(users.firstName, searchPattern),
        ilike(users.lastName, searchPattern),
        ilike(users.fullName, searchPattern),
        ilike(users.email, searchPattern),
      );

      if (searchFilter) {
        filters.push(searchFilter);
      }
    }

    if (planTerm) {
      filters.push(ilike(plans.name, planTerm));
    }

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${users.id})::int` })
      .from(users)
      .leftJoin(creatorPlans, eq(creatorPlans.creatorId, users.id))
      .leftJoin(plans, eq(plans.id, creatorPlans.planId))
      .where(and(...filters));

    const totalItems = Number(totalResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * pageSize;

    const creators = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
        isEmailVerified: users.isEmailVerified,
        isActive: users.isActive,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        companyName: creatorInfo.companyName,
        phone: creatorInfo.phone,
        city: creatorInfo.city,
        cvr: creatorInfo.cvr,
        channelName: creatorChannels.name,
        channelSlug: creatorChannels.slug,
        isPublished: creatorChannels.isPublished,
        layout: contentAppearance.layout,
        planName: planNameSql,
        uploadCount: uploadCountSql,
        subscriberCount: subscriberCountSql,
      })
      .from(users)
      .leftJoin(creatorInfo, eq(creatorInfo.userId, users.id))
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .leftJoin(contentAppearance, eq(contentAppearance.userId, users.id))
      .leftJoin(creatorPlans, eq(creatorPlans.creatorId, users.id))
      .leftJoin(plans, eq(plans.id, creatorPlans.planId))
      .leftJoin(mediaFiles, eq(mediaFiles.creatorId, users.id))
      .leftJoin(
        emailSubscribers,
        and(
          eq(emailSubscribers.creatorId, users.id),
          eq(emailSubscribers.isActive, true),
        ),
      )
      .where(and(...filters))
      .groupBy(
        users.id,

        creatorInfo.companyName,
        creatorInfo.phone,
        creatorInfo.city,
        creatorInfo.cvr,
        creatorChannels.name,
        creatorChannels.slug,
        creatorChannels.isPublished,
        contentAppearance.layout,
      )
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset(offset);

    return success(
      {
        items: creators.map((creator) => ({
          ...creator,
          uploadCount: Number(creator.uploadCount ?? 0),
          subscriberCount: Number(creator.subscriberCount ?? 0),
        })),
        pagination: {
          page: currentPage,
          limit: pageSize,
          totalItems,
          totalPages,
        },
      },
      'Creators fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching existing creators:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creators',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
