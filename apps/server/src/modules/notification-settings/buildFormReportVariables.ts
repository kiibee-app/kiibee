import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from 'src/database/db';
import { emailSubscribers } from 'src/database/schema';
import { formatDisplayDate } from 'src/modules/creator-users/creator-users.helper';
import {
  NOTIFICATION_TYPE,
  NotificationFrequency,
} from 'src/utils/notification.constant';
import { buildRegistrationRowsHtml } from './buildRegistrationRowsHtml';
import {
  getFrequencyLabel,
  getReportDateRange,
  getReportTypeLabel,
} from './notification-report.helper';

export const buildFormReportVariables = async (
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

  const registrationRowsHtml = buildRegistrationRowsHtml(registrations);

  return {
    periodLabel,
    frequencyLabel: getFrequencyLabel(frequency),
    reportTypeLabel: getReportTypeLabel(NOTIFICATION_TYPE.FORM),
    registrationCount: String(rows.length),
    registrations,
    registrationRowsHtml,
    registrationsMessage:
      registrations.length > 0
        ? ''
        : 'No email signups were recorded for this period.',
  };
};
