import { and, desc, eq, gte, lte, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsDailySummary,
  collections,
  mediaFiles,
  orders,
} from 'src/database/schema';
import { ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import {
  NOTIFICATION_TYPE,
  NotificationFrequency,
} from 'src/utils/notification.constant';
import { buildTopContentRowsHtml } from './buildTopContentRowsHtml';
import {
  getFrequencyLabel,
  getReportDateRange,
  getReportTypeLabel,
} from './notification-report.helper';

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
};

export const buildOverviewReportVariables = async (
  creatorId: string,
  frequency: NotificationFrequency,
) => {
  const { startDate, endDate, periodLabel } = getReportDateRange(frequency);

  const [summaryRows, topContentRows, orderRows] = await Promise.all([
    db
      .select({
        views:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.views}), 0)`.mapWith(
            Number,
          ),
        visits:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.visits}), 0)`.mapWith(
            Number,
          ),
        downloads:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.downloads}), 0)`.mapWith(
            Number,
          ),
      })
      .from(analyticsDailySummary)
      .where(
        and(
          eq(analyticsDailySummary.creatorId, creatorId),
          gte(analyticsDailySummary.date, startDate),
          lte(analyticsDailySummary.date, endDate),
        ),
      ),
    db
      .select({
        name: mediaFiles.title,
        views:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.views}), 0)`.mapWith(
            Number,
          ),
        visits:
          sql<number>`COALESCE(SUM(${analyticsDailySummary.visits}), 0)`.mapWith(
            Number,
          ),
      })
      .from(mediaFiles)
      .leftJoin(
        analyticsDailySummary,
        and(
          eq(analyticsDailySummary.mediaFileId, mediaFiles.id),
          eq(analyticsDailySummary.creatorId, creatorId),
          gte(analyticsDailySummary.date, startDate),
          lte(analyticsDailySummary.date, endDate),
        ),
      )
      .where(
        and(
          eq(mediaFiles.creatorId, creatorId),
          eq(mediaFiles.isDeleted, false),
        ),
      )
      .groupBy(mediaFiles.id, mediaFiles.title)
      .orderBy(desc(sql`COALESCE(SUM(${analyticsDailySummary.views}), 0)`))
      .limit(5),
    db
      .select({ itemType: orders.itemType })
      .from(orders)
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(
        and(
          eq(orders.status, ORDER_STATUS.COMPLETED),
          or(
            eq(mediaFiles.creatorId, creatorId),
            eq(collections.creatorId, creatorId),
          ),
          gte(orders.createdAt, new Date(startDate)),
          lte(orders.createdAt, new Date(`${endDate}T23:59:59.999Z`)),
        ),
      ),
  ]);

  const summary = summaryRows[0] ?? { views: 0, visits: 0, downloads: 0 };
  const rentals = orderRows.filter(
    (order) => order.itemType === ORDER_TYPES.RENTAL,
  ).length;
  const purchases = orderRows.filter(
    (order) => order.itemType === ORDER_TYPES.PURCHASE,
  ).length;

  const topContent = topContentRows
    .filter((row) => row.views > 0 || row.visits > 0)
    .map((row) => ({
      name: row.name,
      views: String(row.views),
      visits: String(row.visits),
    }));

  const topContentRowsHtml = buildTopContentRowsHtml(topContent);

  return {
    periodLabel,
    frequencyLabel: getFrequencyLabel(frequency),
    reportTypeLabel: getReportTypeLabel(NOTIFICATION_TYPE.OVERVIEW),
    views: String(toNumber(summary.views)),
    visits: String(toNumber(summary.visits)),
    downloads: String(toNumber(summary.downloads)),
    rentals: String(rentals),
    purchases: String(purchases),
    topContent,
    topContentRowsHtml,
    topContentMessage:
      topContent.length > 0
        ? ''
        : 'No content activity recorded for this period yet.',
  };
};
