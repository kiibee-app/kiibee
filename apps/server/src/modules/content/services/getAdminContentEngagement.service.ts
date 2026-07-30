import { HttpStatus } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsEvents,
  contentAccessRequests,
  contentDownloadCount,
  contentTypes,
  mediaFiles,
  orders,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, ORDER_TYPES, STATUS } from 'src/utils/constant';
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
        contentTypeId: mediaFiles.contentTypeId,
        accessType: mediaFiles.accessType,
        visibility: mediaFiles.visibility,
        isPublished: mediaFiles.isPublished,
        buyPrice: mediaFiles.buyPrice,
        rentPrice: mediaFiles.rentPrice,
        fileKey: mediaFiles.fileKey,
        contentUrl: mediaFiles.contentUrl,
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

    const [
      orderPurchases,
      emailAccessRows,
      rentalRows,
      downloadEvents,
      downloadCountRows,
    ] = await Promise.all([
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
          id: contentAccessRequests.id,
          userId: users.id,
          fullName: users.fullName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: contentAccessRequests.viewerEmail,
          createdAt: contentAccessRequests.createdAt,
        })
        .from(contentAccessRequests)
        .leftJoin(
          users,
          sql`lower(${users.email}) = lower(${contentAccessRequests.viewerEmail})`,
        )
        .where(
          and(
            eq(contentAccessRequests.contentId, contentId),
            eq(contentAccessRequests.status, STATUS.APPROVED),
          ),
        )
        .orderBy(desc(contentAccessRequests.createdAt)),
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
      db
        .select({
          id: contentDownloadCount.id,
          userId: users.id,
          fullName: users.fullName,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          downloadCount: contentDownloadCount.downloadCount,
          createdAt: contentDownloadCount.updatedAt,
        })
        .from(contentDownloadCount)
        .innerJoin(users, eq(users.id, contentDownloadCount.userId))
        .where(eq(contentDownloadCount.contentId, contentId))
        .orderBy(desc(contentDownloadCount.updatedAt)),
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
      downloadCount?: number;
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
      downloadCount: row.downloadCount,
    });

    const purchases = orderPurchases.map(mapUser);
    const emailRegistrations = emailAccessRows.map(mapUser);
    const rentals = rentalRows.map(mapUser);

    // Compute per-user download counts
    const userDownloadCountsMap = new Map<string, number>();
    downloadCountRows.forEach((r) => {
      if (r.userId) {
        userDownloadCountsMap.set(
          r.userId,
          (userDownloadCountsMap.get(r.userId) ?? 0) + (r.downloadCount ?? 1),
        );
      }
    });
    downloadEvents.forEach((r) => {
      if (r.userId && !userDownloadCountsMap.has(r.userId)) {
        userDownloadCountsMap.set(
          r.userId,
          (userDownloadCountsMap.get(r.userId) ?? 0) + 1,
        );
      }
    });

    const combinedDownloadRows = [...downloadCountRows, ...downloadEvents];
    const seenUserIds = new Set<string>();
    const uniqueDownloadRows = combinedDownloadRows.filter((row) => {
      if (!row.userId) return true;
      if (seenUserIds.has(row.userId)) return false;
      seenUserIds.add(row.userId);
      return true;
    });

    const downloads = uniqueDownloadRows.map((row) => {
      const user = mapUser(row);
      if (row.userId && userDownloadCountsMap.has(row.userId)) {
        user.downloadCount = userDownloadCountsMap.get(row.userId);
      }
      return user;
    });

    const totalFromCounts = downloadCountRows.reduce(
      (sum, row) => sum + (row.downloadCount ?? 0),
      0,
    );
    const totalDownloadCount = Math.max(downloadEvents.length, totalFromCounts);

    return success(
      {
        content,
        purchases,
        emailRegistrations,
        rentals,
        downloads,
        stats: {
          purchaseCount: purchases.length,
          emailRegisteredCount: emailRegistrations.length,
          rentalCount: rentals.length,
          downloadCount: totalDownloadCount,
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
