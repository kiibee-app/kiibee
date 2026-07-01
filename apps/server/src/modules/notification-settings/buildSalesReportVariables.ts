import { and, desc, eq, gte, lte, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  mediaFiles,
  orders,
  payments,
  users,
} from 'src/database/schema';
import {
  formatDisplayDate,
  formatSalePrice,
  formatSaleType,
  formatUserDisplayName,
} from 'src/modules/creator-users/creator-users.helper';
import { ORDER_STATUS } from 'src/utils/constant';
import {
  NOTIFICATION_TYPE,
  NotificationFrequency,
} from 'src/utils/notification.constant';
import { buildSalesRowsHtml } from './buildSalesRowsHtml';
import {
  getFrequencyLabel,
  getReportDateRange,
  getReportTypeLabel,
} from './notification-report.helper';

export const buildSalesReportVariables = async (
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
      price: payments.amount,
      currency: orders.currency,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .innerJoin(payments, eq(payments.orderId, orders.id))
    .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
    .leftJoin(collections, eq(orders.collectionId, collections.id))
    .where(
      and(
        eq(orders.status, ORDER_STATUS.COMPLETED),
        eq(payments.status, ORDER_STATUS.COMPLETED),
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

  const salesRowsHtml = buildSalesRowsHtml(sales);

  return {
    periodLabel,
    frequencyLabel: getFrequencyLabel(frequency),
    reportTypeLabel: getReportTypeLabel(NOTIFICATION_TYPE.SALES),
    salesCount: String(rows.length),
    sales,
    salesRowsHtml,
    salesMessage:
      sales.length > 0
        ? ''
        : 'No completed sales were recorded for this period.',
  };
};
