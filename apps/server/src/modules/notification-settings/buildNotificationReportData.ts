import { and, desc, eq, gte, lte, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsDailySummary,
  collections,
  emailSubscribers,
  mediaFiles,
  notificationSettings,
  orders,
  users,
} from 'src/database/schema';
import {
  formatDisplayDate,
  formatSalePrice,
  formatSaleType,
  formatUserDisplayName,
} from 'src/modules/creator-users/creator-users.helper';
import { ORDER_STATUS, ORDER_TYPES } from 'src/utils/constant';
import {
  getFrequencyLabel,
  getReportDateRange,
  getReportTypeLabel,
} from './notification-report.helper';

type NotificationType = 'overview' | 'sales' | 'form';
type NotificationFrequency = 'daily' | 'weekly' | 'monthly';

const getDashboardLink = (type: NotificationType) => {
  const base = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '');
  const dashboardPath = '/dashboard/creators';

  if (type === 'sales') {
    return `${base}${dashboardPath}?view=Users&tab=sales`;
  }

  if (type === 'form') {
    return `${base}${dashboardPath}?view=Users&tab=registrations`;
  }

  return `${base}${dashboardPath}`;
};

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
};

const buildOverviewVariables = async (
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

  const topContentRowsHtml =
    topContent.length > 0
      ? topContent
          .map(
            (row) => `<tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.name}</td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; text-align: right; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.views}</td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; text-align: right; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.visits}</td>
                  </tr>`,
          )
          .join('')
      : `<tr>
                  <td colspan="3" style="padding: 28px 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #444444;">No activity yet</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #888888;">No content activity recorded for this period. Share your channel to start collecting views.</p>
                  </td>
                </tr>`;

  return {
    periodLabel,
    frequencyLabel: getFrequencyLabel(frequency),
    reportTypeLabel: getReportTypeLabel('overview'),
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

const buildSalesVariables = async (
  creatorId: string,
  frequency: NotificationFrequency,
) => {
  const { startDate, endDate, periodLabel } = getReportDateRange(frequency);

  const rows = await db
    .select({
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      itemType: orders.itemType,
      price: orders.price,
      currency: orders.currency,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
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
    )
    .orderBy(desc(orders.createdAt))
    .limit(10);

  const sales = rows.map((row) => ({
    name: formatUserDisplayName(row),
    itemType: formatSaleType(row.itemType),
    price: formatSalePrice(row.price, row.currency),
    date: formatDisplayDate(row.createdAt),
  }));

  const salesRowsHtml =
    sales.length > 0
      ? sales
          .map(
            (row) => `<tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.name}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #53baa9; border-top: 1px solid #eef0f3; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.itemType}</td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; text-align: right; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.price}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #666666; border-top: 1px solid #eef0f3; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.date}</td>
                  </tr>`,
          )
          .join('')
      : `<tr>
                  <td colspan="4" style="padding: 28px 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #444444;">No sales yet</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #888888;">No completed sales were recorded for this period.</p>
                  </td>
                </tr>`;

  return {
    periodLabel,
    frequencyLabel: getFrequencyLabel(frequency),
    reportTypeLabel: getReportTypeLabel('sales'),
    salesCount: String(rows.length),
    sales,
    salesRowsHtml,
    salesMessage:
      sales.length > 0
        ? ''
        : 'No completed sales were recorded for this period.',
  };
};

const buildFormVariables = async (
  creatorId: string,
  frequency: NotificationFrequency,
) => {
  const { startDate, endDate, periodLabel } = getReportDateRange(frequency);

  const rows = await db
    .select({
      name: emailSubscribers.name,
      email: emailSubscribers.email,
      subscribedAt: emailSubscribers.subscribedAt,
    })
    .from(emailSubscribers)
    .where(
      and(
        eq(emailSubscribers.creatorId, creatorId),
        eq(emailSubscribers.isActive, true),
        gte(emailSubscribers.subscribedAt, new Date(startDate)),
        lte(
          emailSubscribers.subscribedAt,
          new Date(`${endDate}T23:59:59.999Z`),
        ),
      ),
    )
    .orderBy(desc(emailSubscribers.subscribedAt));

  const registrations = rows.slice(0, 10).map((row) => ({
    name: row.name?.trim() || row.email,
    email: row.email,
    date: formatDisplayDate(row.subscribedAt),
  }));

  const registrationRowsHtml =
    registrations.length > 0
      ? registrations
          .map(
            (row) => `<tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.name}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #666666; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.email}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #666666; border-top: 1px solid #eef0f3; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.date}</td>
                  </tr>`,
          )
          .join('')
      : `<tr>
                  <td colspan="3" style="padding: 28px 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #444444;">No signups yet</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #888888;">No email signups were recorded for this period. When viewers submit your email-gated forms, they will appear here.</p>
                  </td>
                </tr>`;

  return {
    periodLabel,
    frequencyLabel: getFrequencyLabel(frequency),
    reportTypeLabel: getReportTypeLabel('form'),
    registrationCount: String(rows.length),
    registrations,
    registrationRowsHtml,
    registrationsMessage:
      registrations.length > 0
        ? ''
        : 'No email signups were recorded for this period.',
  };
};

export const buildNotificationReportVariables = async (
  creatorId: string,
  type: NotificationType,
  frequency: NotificationFrequency,
  displayName: string,
) => {
  const dashboardLink = getDashboardLink(type);
  const base = { name: displayName, dashboardLink };

  if (type === 'sales') {
    return {
      ...base,
      ...(await buildSalesVariables(creatorId, frequency)),
    };
  }

  if (type === 'form') {
    return {
      ...base,
      ...(await buildFormVariables(creatorId, frequency)),
    };
  }

  return {
    ...base,
    ...(await buildOverviewVariables(creatorId, frequency)),
  };
};

export const resolveNotificationRecipientEmail = (
  recipient: 'account_email' | 'other_email',
  accountEmail: string,
  otherEmail: string | null | undefined,
) => {
  if (recipient === 'other_email') {
    const trimmedOtherEmail = otherEmail?.trim();
    if (!trimmedOtherEmail) {
      return null;
    }

    return trimmedOtherEmail;
  }

  return accountEmail.trim();
};

export const getNotificationTemplateName = (type: NotificationType) => {
  if (type === 'sales') return 'salesReport';
  if (type === 'form') return 'formReport';
  return 'overviewReport';
};

export const getNotificationMailSubject = (
  type: NotificationType,
  periodLabel: string,
) => {
  const label = getReportTypeLabel(type);
  return `Your Kiibee ${label} Report — ${periodLabel}`;
};

export type NotificationSettingsRow = typeof notificationSettings.$inferSelect;
