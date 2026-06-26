import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorChannels,
  creatorInfo,
  creatorPlans,
  emailSubscribers,
  mediaFiles,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getCreatorByIdService = async (creatorId: string) => {
  try {
    const uploadCountSql = sql<number>`
      COUNT(DISTINCT ${mediaFiles.id})::int
    `;
    const subscriberCountSql = sql<number>`
      COUNT(DISTINCT ${emailSubscribers.id})::int
    `;
    const planNameSql = sql<string | null>`MAX(${plans.name})`;

    const [creator] = await db
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
      .where(
        and(
          eq(users.id, creatorId),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
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
      .limit(1);

    if (!creator) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    return success(
      {
        ...creator,
        uploadCount: Number(creator.uploadCount ?? 0),
        subscriberCount: Number(creator.subscriberCount ?? 0),
      },
      'Creator fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creator',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
