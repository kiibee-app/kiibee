import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from 'src/database/db';
import { analyticsDailySummary } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';

export const exportViewsService = async (
  creatorId: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    const conditions = [eq(analyticsDailySummary.creatorId, creatorId)];

    if (startDate) conditions.push(gte(analyticsDailySummary.date, startDate));
    if (endDate) conditions.push(lte(analyticsDailySummary.date, endDate));

    const rows = await db
      .select({
        date: analyticsDailySummary.date,
        views: analyticsDailySummary.views,
        visits: analyticsDailySummary.visits,
        clicks: analyticsDailySummary.clicks,
        downloads: analyticsDailySummary.downloads,
        rentals: analyticsDailySummary.rentals,
        purchases: analyticsDailySummary.purchases,
        revenue: analyticsDailySummary.revenue,
      })
      .from(analyticsDailySummary)
      .where(and(...conditions))
      .orderBy(desc(analyticsDailySummary.date));

    const data = rows.map((row) => ({
      Date: row.date,
      Views: row.views,
      Visits: row.visits,
      Clicks: row.clicks,
      Downloads: row.downloads,
      Rentals: row.rentals,
      Purchases: row.purchases,
      Revenue: row.revenue,
    }));

    return success(data, 'Export generated successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error generating views export:', error);

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      'Failed to generate views export',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
