import { HttpStatus } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsEvents,
  contentTypes,
  mediaFiles,
  orders,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getAdminCreatorContentsService = async (creatorId: string) => {
  try {
    const purchaseCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${orders.itemType} = ${ORDER_TYPES.PURCHASE}
          AND ${orders.status} = ${ORDER_STATUS.COMPLETED}
        THEN ${orders.id}
      END)::int
    `;
    const rentalCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${orders.itemType} = ${ORDER_TYPES.RENTAL}
          AND ${orders.status} = ${ORDER_STATUS.COMPLETED}
        THEN ${orders.id}
      END)::int
    `;
    const downloadCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${analyticsEvents.eventType} = 'download'
        THEN ${analyticsEvents.id}
      END)::int
    `;

    const rows = await db
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
        createdAt: mediaFiles.createdAt,
        publishedAt: mediaFiles.publishedAt,
        purchaseCount: purchaseCountSql,
        rentalCount: rentalCountSql,
        downloadCount: downloadCountSql,
      })
      .from(mediaFiles)
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .leftJoin(orders, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(analyticsEvents, eq(analyticsEvents.mediaFileId, mediaFiles.id))
      .where(
        and(
          eq(mediaFiles.creatorId, creatorId),
          eq(mediaFiles.isDeleted, false),
        ),
      )
      .groupBy(mediaFiles.id, contentTypes.name)
      .orderBy(desc(mediaFiles.createdAt));

    return success(
      rows.map((row) => ({
        ...row,
        purchaseCount: Number(row.purchaseCount ?? 0),
        rentalCount: Number(row.rentalCount ?? 0),
        downloadCount: Number(row.downloadCount ?? 0),
      })),
      'Creator contents fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch admin creator contents:', error);
    return fail(
      'Failed to fetch creator contents',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
