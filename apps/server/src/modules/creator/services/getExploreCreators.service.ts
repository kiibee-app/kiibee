import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentAppearance,
  creatorChannels,
  emailSubscribers,
  mediaFiles,
  users,
  creatorInfo,
  contentSettings,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { CONTENT_VISIBILITY, ROLE, STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';

export type ExploreCreatorItem = {
  id: string;
  name: string;
  slug: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  category: string | null;
  uploadCount: number;
  subscriberCount: number;
  createdAt: string;
  contentDescription: string | null;
  exampleWorkLink: string | null;
  accessType: string | null;
  layout: string | null;
};

const subscriberCounts = db
  .select({
    creatorId: emailSubscribers.creatorId,
    subscriberCount: sql<number>`count(*)::int`.as('subscriber_count'),
  })
  .from(emailSubscribers)
  .where(eq(emailSubscribers.isActive, true))
  .groupBy(emailSubscribers.creatorId)
  .as('subscriber_counts');

const uploadCounts = db
  .select({
    creatorId: mediaFiles.creatorId,
    uploadCount: sql<number>`count(*)::int`.as('upload_count'),
  })
  .from(mediaFiles)
  .where(
    and(
      eq(mediaFiles.isDeleted, false),
      eq(mediaFiles.isPublished, true),
      eq(mediaFiles.visibility, CONTENT_VISIBILITY.PUBLIC),
    ),
  )
  .groupBy(mediaFiles.creatorId)
  .as('upload_counts');

const activeCreatorConditions = (): SQL[] => [
  eq(users.role, ROLE.CREATOR),
  eq(users.isDeleted, false),
  eq(users.isActive, true),
  eq(users.status, STATUS.ACTIVE),
];

const creatorDisplayNameSql = sql<string>`trim(coalesce(
  nullif(${creatorChannels.name}, ''),
  nullif(${users.fullName}, ''),
  nullif(concat(coalesce(${users.firstName}, ''), ' ', coalesce(${users.lastName}, '')), '')
))`;

const buildCreatorsQuery = (creatorId?: string, search?: string) => {
  const conditions = activeCreatorConditions();
  if (creatorId) {
    conditions.push(eq(users.id, creatorId));
  }

  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      or(
        ilike(users.fullName, searchTerm),
        ilike(users.firstName, searchTerm),
        ilike(users.lastName, searchTerm),
        ilike(creatorChannels.name, searchTerm),
        sql`${creatorDisplayNameSql} ILIKE ${searchTerm}`,
      )!,
    );
  }

  return db
    .select({
      id: users.id,
      name: creatorDisplayNameSql.as('name'),
      slug: creatorChannels.slug,
      profileImageUrl: sql<string | null>`coalesce(
          nullif(${creatorChannels.logoUrl}, ''),
          nullif(${users.avatarUrl}, '')
        )`.as('profile_image_url'),
      coverImageUrl: sql<string | null>`coalesce(
          nullif(${creatorChannels.coverImageUrl}, ''),
          nullif(${contentAppearance.desktopCoverImageUrl}, '')
        )`.as('cover_image_url'),
      category: sql<string | null>`null`.as('category'),
      uploadCount:
        sql<number>`coalesce(${uploadCounts.uploadCount}, 0)::int`.as(
          'upload_count',
        ),
      subscriberCount:
        sql<number>`coalesce(${subscriberCounts.subscriberCount}, 0)::int`.as(
          'subscriber_count',
        ),
      createdAt: users.createdAt,
      contentDescription: sql<string | null>`case
        when ${contentAppearance.userId} is not null then ${contentAppearance.description}
        else ${creatorInfo.contentDescription}
      end`.as('content_description'),
      exampleWorkLink: creatorInfo.exampleWorkLink,
      accessType: contentSettings.accessType,
      layout: contentAppearance.layout,
    })
    .from(users)
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .leftJoin(contentAppearance, eq(contentAppearance.userId, users.id))
    .leftJoin(uploadCounts, eq(uploadCounts.creatorId, users.id))
    .leftJoin(subscriberCounts, eq(subscriberCounts.creatorId, users.id))
    .leftJoin(creatorInfo, eq(creatorInfo.userId, users.id))
    .leftJoin(contentSettings, eq(contentSettings.userId, users.id))
    .where(and(...conditions))
    .orderBy(
      desc(sql`CASE 
        WHEN (${creatorChannels.coverImageUrl} IS NOT NULL AND trim(${creatorChannels.coverImageUrl}) <> '') 
          OR (${users.avatarUrl} IS NOT NULL AND trim(${users.avatarUrl}) <> '') 
        THEN 1 ELSE 0 
      END`),
      desc(sql`coalesce(${subscriberCounts.subscriberCount}, 0)`),
    );
};

const mapCreatorRow = (row: {
  id: string;
  name: string;
  slug: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  category: string | null;
  uploadCount: number;
  subscriberCount: number;
  createdAt: Date | string;
  contentDescription: string | null;
  exampleWorkLink: string | null;
  accessType: string | null;
  layout: string | null;
}): ExploreCreatorItem => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  profileImageUrl: row.profileImageUrl,
  coverImageUrl: row.coverImageUrl,
  category: row.category,
  uploadCount: row.uploadCount,
  subscriberCount: row.subscriberCount,
  createdAt:
    row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : String(row.createdAt),
  contentDescription: row.contentDescription,
  exampleWorkLink: row.exampleWorkLink,
  accessType: row.accessType,
  layout: row.layout,
});

export const getExploreCreatorsService = async (
  limit?: number,
  search?: string,
) => {
  try {
    let query = buildCreatorsQuery(undefined, search);

    if (limit != null) {
      const safeLimit = Math.min(Math.max(limit, 1), 100);
      query = query.limit(safeLimit) as typeof query;
    }

    const rows = await query;

    const creators: ExploreCreatorItem[] = rows
      .filter((row) => row.name.length > 0)
      .map(mapCreatorRow);

    return success(creators, 'Creators fetched successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error fetching explore creators:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creators',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getCreatorPublicProfileService = async (creatorId: string) => {
  try {
    const rows = await buildCreatorsQuery(creatorId).limit(1);
    const row = rows.find((item) => item.name.length > 0);

    if (!row) {
      throw new HttpException('Creator not found', HttpStatus.NOT_FOUND);
    }

    return success(
      mapCreatorRow(row),
      'Creator profile fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator public profile:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creator profile',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
