import { HttpStatus } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsEvents,
  contentTypes,
  mediaFiles,
  orders,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import {
  formatDisplayDate,
  formatUserDisplayName,
} from '../../creator-users/creator-users.helper';

export const getAdminContentEngagementService = async (contentId: string) => {
  try {
    const [content] = await db
      .select({
        id: mediaFiles.id,
        title: mediaFiles.title,
        description: mediaFiles.description,
        thumbnailUrl: mediaFiles.thumbnailUrl,
        contentType: contentTypes.name,
        accessType: mediaFiles.accessType,
        visibility: mediaFiles.visibility,
        isPublished: mediaFiles.isPublished,
        buyPrice: mediaFiles.buyPrice,
        rentPrice: mediaFiles.rentPrice,
        creatorId: mediaFiles.creatorId,
        createdAt: mediaFiles.createdAt,
        publishedAt: mediaFiles.publishedAt,
      })
      .from(mediaFiles)
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .where(and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)))
      .limit(1);

    if (!content) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    const [purchaseRows, rentalRows, downloadRows] = await Promise.all([
      db
        .select({
          id: orders.id,
          userId: users.id,
          fullName: users.fullName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .innerJoin(users, eq(users.id, orders.userId))
        .where(
          and(
            eq(orders.mediaFileId, contentId),
            eq(orders.itemType, ORDER_TYPES.PURCHASE),
            eq(orders.status, ORDER_STATUS.COMPLETED),
          ),
        )
        .orderBy(desc(orders.createdAt)),
      db
        .select({
          id: orders.id,
          userId: users.id,
          fullName: users.fullName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          createdAt: orders.createdAt,
          rentExpiresAt: orders.rentExpiresAt,
        })
        .from(orders)
        .innerJoin(users, eq(users.id, orders.userId))
        .where(
          and(
            eq(orders.mediaFileId, contentId),
            eq(orders.itemType, ORDER_TYPES.RENTAL),
            eq(orders.status, ORDER_STATUS.COMPLETED),
          ),
        )
        .orderBy(desc(orders.createdAt)),
      db
        .select({
          id: analyticsEvents.id,
          userId: users.id,
          fullName: users.fullName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          createdAt: analyticsEvents.createdAt,
        })
        .from(analyticsEvents)
        .leftJoin(users, eq(users.id, analyticsEvents.userId))
        .where(
          and(
            eq(analyticsEvents.mediaFileId, contentId),
            eq(analyticsEvents.eventType, 'download'),
          ),
        )
        .orderBy(desc(analyticsEvents.createdAt)),
    ]);

    const mapUser = (row: {
      id: string;
      userId: string | null;
      fullName: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      createdAt: Date;
      rentExpiresAt?: Date | null;
    }) => ({
      id: row.id,
      userId: row.userId,
      name: formatUserDisplayName({
        fullName: row.fullName,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email ?? 'Unknown user',
      }),
      email: row.email ?? 'Unknown',
      date: row.createdAt,
      displayDate: formatDisplayDate(row.createdAt),
      rentExpiresAt: row.rentExpiresAt ?? null,
      rentExpiresDisplay: row.rentExpiresAt
        ? formatDisplayDate(row.rentExpiresAt)
        : null,
    });

    const purchases = purchaseRows.map(mapUser);
    const rentals = rentalRows.map(mapUser);
    const downloads = downloadRows.map(mapUser);

    return success(
      {
        content,
        purchases,
        rentals,
        downloads,
        stats: {
          purchaseCount: purchases.length,
          rentalCount: rentals.length,
          downloadCount: downloads.length,
        },
      },
      'Content engagement fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch admin content engagement:', error);
    return fail(
      'Failed to fetch content engagement',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
