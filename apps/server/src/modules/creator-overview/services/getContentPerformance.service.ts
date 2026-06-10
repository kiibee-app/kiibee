import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsDailySummary,
  contentTypes,
  mediaFiles,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';

export const getContentPerformanceService = async (creatorId: string) => {
  try {
    const rows = await db
      .select({
        id: mediaFiles.id,
        name: mediaFiles.title,
        contentType: contentTypes.name,
        pageVisits:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.visits}), 0)`.mapWith(
            Number,
          ),
        clicks:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.clicks}), 0)`.mapWith(
            Number,
          ),
        views:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.views}), 0)`.mapWith(
            Number,
          ),
      })
      .from(mediaFiles)
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .leftJoin(
        analyticsDailySummary,
        and(
          eq(analyticsDailySummary.mediaFileId, mediaFiles.id),
          eq(analyticsDailySummary.creatorId, creatorId),
        ),
      )
      .where(
        and(
          eq(mediaFiles.creatorId, creatorId),
          eq(mediaFiles.isDeleted, false),
        ),
      )
      .groupBy(mediaFiles.id, mediaFiles.title, contentTypes.name)
      .orderBy(desc(sql`COALESCE(SUM(${analyticsDailySummary.visits}), 0)`));

    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      contentType: row.contentType ?? 'pdf',
      pageVisits: row.pageVisits,
      clicks: row.clicks,
      views: row.views,
    }));

    return success(
      items,
      'Content performance retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching content performance:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve content performance',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
