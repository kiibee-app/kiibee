import { db } from 'src/database/db';
import {
  mediaFiles,
  users,
  contentTypes,
  mediaFileCategories,
  contentCategories,
  emailSubscribers,
} from 'src/database/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { ROLE } from 'src/utils/constant';

const baseSelect = {
  id: mediaFiles.id,
  title: mediaFiles.title,
  description: mediaFiles.description,
  thumbnailUrl: mediaFiles.thumbnailUrl,
  creatorId: mediaFiles.creatorId,
  creatorName: users.fullName,
  contentType: contentTypes.name,
  accessType: mediaFiles.accessType,
  categoryName: contentCategories.name,
  buyPrice: mediaFiles.buyPrice,
  rentPrice: mediaFiles.rentPrice,
  createdAt: mediaFiles.createdAt,
};

export const getTrendingQuery = (where: any, limit: number) =>
  db
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
    .where(where)
    .orderBy(desc(mediaFiles.sortOrder))
    .limit(limit);

export const getLatestQuery = (where: any, orderBy: any, limit: number) =>
  db
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
    .where(where)
    .orderBy(orderBy)
    .limit(limit);

export const getRecentQuery = (where: any, limit: number) =>
  db
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
    .where(where)
    .orderBy(desc(mediaFiles.createdAt))
    .limit(limit);

export const getTopCreatorsQuery = () =>
  db
    .select({
      id: users.id,
      name: users.fullName,
      profileImageUrl: users.avatarUrl,
      createdAt: users.createdAt,
      uploadCount: sql<number>`COUNT(DISTINCT media_files.id)`,
      subscriberCount: sql<number>`COUNT(DISTINCT email_subscribers.id)`,
    })
    .from(users)
    .leftJoin(mediaFiles, eq(mediaFiles.creatorId, users.id))
    .leftJoin(emailSubscribers, eq(emailSubscribers.creatorId, users.id))
    .where(
      and(
        eq(users.isActive, true),
        eq(users.role, ROLE.CREATOR),
        eq(users.isDeleted, false),
      ),
    )
    .groupBy(users.id, users.fullName, users.avatarUrl, users.createdAt)
    .orderBy(desc(sql`COUNT(DISTINCT media_files.id)`))
    .limit(10);
