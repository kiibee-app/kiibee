import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  creatorChannels,
  creatorInfo,
  creatorPlans,
  emailSubscribers,
  mediaFiles,
  orders,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';

export const getAllExistingCreatorsService = async ({
  search,
  plan,
}: {
  search?: string;
  plan?: string;
} = {}) => {
  try {
    const uploadCountSql = sql<number>`
      COUNT(DISTINCT ${mediaFiles.id})::int
    `;
    const subscriberCountSql = sql<number>`
      COUNT(DISTINCT ${emailSubscribers.id})::int
    `;
    const planNameSql = sql<string | null>`
      MAX(${plans.name})
    `;
    const totalSoldSql = sql<number>`
      (
        SELECT COALESCE(COUNT(*), 0)::int
        FROM ${orders}
        LEFT JOIN ${mediaFiles} ON ${orders.mediaFileId} = ${mediaFiles.id}
        LEFT JOIN ${collections} ON ${orders.collectionId} = ${collections.id}
        WHERE ${orders.status} = 'completed'
          AND (${mediaFiles.creatorId} = ${users.id} OR ${collections.creatorId} = ${users.id})
      )
    `;
    const totalEarnedSql = sql<number>`
      (
        SELECT COALESCE(SUM(${orders.price}), 0)::float
        FROM ${orders}
        LEFT JOIN ${mediaFiles} ON ${orders.mediaFileId} = ${mediaFiles.id}
        LEFT JOIN ${collections} ON ${orders.collectionId} = ${collections.id}
        WHERE ${orders.status} = 'completed'
          AND (${mediaFiles.creatorId} = ${users.id} OR ${collections.creatorId} = ${users.id})
      )
    `;
    const searchTerm = search?.trim();
    const searchPattern = searchTerm ? `%${searchTerm}%` : undefined;
    const planTerm = plan?.trim();
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
        planName: planNameSql,
        uploadCount: uploadCountSql,
        subscriberCount: subscriberCountSql,
        totalSold: totalSoldSql,
        totalEarned: totalEarnedSql,
      })
      .from(users)
      .leftJoin(creatorInfo, eq(creatorInfo.userId, users.id))
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
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
      )
      .orderBy(desc(users.createdAt));

    return success(
      creators.map((creator) => ({
        ...creator,
        uploadCount: Number(creator.uploadCount ?? 0),
        subscriberCount: Number(creator.subscriberCount ?? 0),
        totalSold: Number(creator.totalSold ?? 0),
        totalEarned: Number(creator.totalEarned ?? 0),
      })),
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
