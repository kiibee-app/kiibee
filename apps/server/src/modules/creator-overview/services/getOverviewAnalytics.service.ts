import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, gte, lte, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsDailySummary,
  analyticsEvents,
  collections,
  mediaFiles,
  orders,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';

const OVERVIEW_RANGES = {
  Day: 'Day',
  Week: 'Week',
  Month: 'Month',
  Year: 'Year',
} as const;

type OverviewRange = (typeof OVERVIEW_RANGES)[keyof typeof OVERVIEW_RANGES];

type OverviewActivityPoint = {
  label: string;
  rentals: number;
  purchases: number;
  views: number;
  visits: number;
  downloads: number;
};

const RANGE_KEYS: OverviewRange[] = [
  OVERVIEW_RANGES.Day,
  OVERVIEW_RANGES.Week,
  OVERVIEW_RANGES.Month,
  OVERVIEW_RANGES.Year,
];

const toOverviewRange = (value?: string): OverviewRange => {
  if (value && RANGE_KEYS.includes(value as OverviewRange)) {
    return value as OverviewRange;
  }

  return OVERVIEW_RANGES.Day;
};

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const getRangeWindow = (range: OverviewRange, now = new Date()) => {
  if (range === OVERVIEW_RANGES.Day) {
    return {
      start: startOfDay(now),
      end: endOfDay(now),
    };
  }

  if (range === OVERVIEW_RANGES.Week) {
    const current = startOfDay(now);
    const day = current.getDay();
    const diffToMonday = (day + 6) % 7;
    const start = addDays(current, -diffToMonday);
    const end = endOfDay(addDays(start, 6));

    return { start, end };
  }

  if (range === OVERVIEW_RANGES.Month) {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));

    return { start, end };
  }

  const start = new Date(now.getFullYear(), 0, 1);
  const end = endOfDay(new Date(now.getFullYear(), 11, 31));

  return { start, end };
};

const getEmptyActivity = (range: OverviewRange): OverviewActivityPoint[] => {
  if (range === OVERVIEW_RANGES.Day) {
    return Array.from({ length: 24 }, (_, hour) => ({
      label: `${String(hour).padStart(2, '0')}:00`,
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    }));
  }

  if (range === OVERVIEW_RANGES.Week) {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels.map((label) => ({
      label,
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    }));
  }

  if (range === OVERVIEW_RANGES.Month) {
    const labels = ['W1', 'W2', 'W3', 'W4', 'W5'];
    return labels.map((label) => ({
      label,
      rentals: 0,
      purchases: 0,
      views: 0,
      visits: 0,
      downloads: 0,
    }));
  }

  const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return labels.map((label) => ({
    label,
    rentals: 0,
    purchases: 0,
    views: 0,
    visits: 0,
    downloads: 0,
  }));
};

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
};

type SummaryRow = {
  views: number;
  visits: number;
  clicks: number;
  downloads: number;
};

const buildActivityKey = (range: OverviewRange, date: Date) => {
  if (range === OVERVIEW_RANGES.Day) {
    return `${String(date.getHours()).padStart(2, '0')}:00`;
  }

  if (range === OVERVIEW_RANGES.Week) {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  }

  if (range === OVERVIEW_RANGES.Month) {
    const week = Math.min(5, Math.floor((date.getDate() - 1) / 7) + 1);
    return `W${week}`;
  }

  return [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][date.getMonth()];
};

export const getOverviewAnalyticsService = async (
  creatorId: string,
  rangeParam?: string,
) => {
  try {
    const range = toOverviewRange(rangeParam);
    const { start, end } = getRangeWindow(range);

    const [summaryRows, dailyRows, eventRows, orderRows] = await Promise.all([
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
          clicks:
            sql<number>`COALESCE(SUM(${analyticsDailySummary.clicks}), 0)`.mapWith(
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
            gte(analyticsDailySummary.date, start.toISOString().slice(0, 10)),
            lte(analyticsDailySummary.date, end.toISOString().slice(0, 10)),
          ),
        ),
      db
        .select({
          date: analyticsDailySummary.date,
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
            gte(analyticsDailySummary.date, start.toISOString().slice(0, 10)),
            lte(analyticsDailySummary.date, end.toISOString().slice(0, 10)),
          ),
        )
        .groupBy(analyticsDailySummary.date),
      range === OVERVIEW_RANGES.Day
        ? db
            .select({
              createdAt: analyticsEvents.createdAt,
              eventType: analyticsEvents.eventType,
            })
            .from(analyticsEvents)
            .where(
              and(
                eq(analyticsEvents.creatorId, creatorId),
                gte(analyticsEvents.createdAt, start),
                lte(analyticsEvents.createdAt, end),
              ),
            )
        : Promise.resolve([]),
      db
        .select({
          createdAt: orders.createdAt,
          itemType: orders.itemType,
        })
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
            gte(orders.createdAt, start),
            lte(orders.createdAt, end),
          ),
        ),
    ]);

    const summary = (summaryRows[0] as SummaryRow | undefined) ?? {
      views: 0,
      visits: 0,
      clicks: 0,
      downloads: 0,
    };

    const chart = getEmptyActivity(range);
    const chartIndex = new Map(chart.map((item) => [item.label, item]));

    if (range === OVERVIEW_RANGES.Day) {
      for (const event of eventRows as Array<{
        createdAt: Date;
        eventType:
          | 'view'
          | 'visit'
          | 'click'
          | 'download'
          | 'play_start'
          | 'play_complete'
          | 'rent'
          | 'purchase';
      }>) {
        const key = buildActivityKey(range, new Date(event.createdAt));
        const point = chartIndex.get(key);
        if (!point) continue;

        if (event.eventType === 'view') point.views += 1;
        if (event.eventType === 'visit') point.visits += 1;
        if (event.eventType === 'download') point.downloads += 1;
      }
    } else {
      for (const row of dailyRows as Array<{
        date: string;
        views: number;
        visits: number;
        downloads: number;
      }>) {
        const date = new Date(row.date);
        const key = buildActivityKey(range, date);
        const point = chartIndex.get(key);
        if (!point) continue;
        point.views += toNumber(row.views);
        point.visits += toNumber(row.visits);
        point.downloads += toNumber(row.downloads);
      }
    }

    for (const order of orderRows as Array<{
      createdAt: Date;
      itemType: string;
    }>) {
      const key = buildActivityKey(range, new Date(order.createdAt));
      const point = chartIndex.get(key);
      if (!point) continue;

      if (order.itemType === ORDER_TYPES.RENTAL) {
        point.rentals += 1;
      } else if (order.itemType === ORDER_TYPES.PURCHASE) {
        point.purchases += 1;
      }
    }

    const rentals = (orderRows as Array<{ itemType: string }>).filter(
      (order) => order.itemType === ORDER_TYPES.RENTAL,
    ).length;
    const purchases = (orderRows as Array<{ itemType: string }>).filter(
      (order) => order.itemType === ORDER_TYPES.PURCHASE,
    ).length;

    const stats = {
      total:
        rentals +
        purchases +
        toNumber(summary.views) +
        toNumber(summary.visits) +
        toNumber(summary.downloads),
      rentals,
      purchases,
      views: toNumber(summary.views),
      visits: toNumber(summary.visits),
      downloads: toNumber(summary.downloads),
    };

    return success(
      {
        range,
        stats,
        chart,
      },
      'Overview analytics retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching overview analytics:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve overview analytics',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
