import { notificationSettings } from 'src/database/schema';
import {
  NOTIFICATION_DASHBOARD,
  NOTIFICATION_MAIL_SUBJECT_PREFIX,
  NOTIFICATION_RECIPIENT,
  NOTIFICATION_TEMPLATE,
  NOTIFICATION_TYPE,
  type NotificationFrequency,
  type NotificationRecipient,
  type NotificationType,
} from 'src/utils/notification.constant';
import { buildFormReportVariables } from './buildFormReportVariables';
import { buildOverviewReportVariables } from './buildOverviewReportVariables';
import { buildSalesReportVariables } from './buildSalesReportVariables';
import { getReportTypeLabel } from './notification-report.helper';

const getDashboardLink = (type: NotificationType) => {
  const base = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '');
  const dashboardPath = NOTIFICATION_DASHBOARD.CREATOR_PATH;

  if (type === NOTIFICATION_TYPE.SALES) {
    return `${base}${dashboardPath}?view=${NOTIFICATION_DASHBOARD.USERS_VIEW}&tab=${NOTIFICATION_DASHBOARD.SALES_TAB}`;
  }

  if (type === NOTIFICATION_TYPE.FORM) {
    return `${base}${dashboardPath}?view=${NOTIFICATION_DASHBOARD.USERS_VIEW}&tab=${NOTIFICATION_DASHBOARD.REGISTRATIONS_TAB}`;
  }

  return `${base}${dashboardPath}`;
};

export const buildNotificationReportVariables = async (
  creatorId: string,
  type: NotificationType,
  frequency: NotificationFrequency,
  displayName: string,
) => {
  const dashboardLink = getDashboardLink(type);
  const base = { name: displayName, dashboardLink };

  if (type === NOTIFICATION_TYPE.SALES) {
    return {
      ...base,
      ...(await buildSalesReportVariables(creatorId, frequency)),
    };
  }

  if (type === NOTIFICATION_TYPE.FORM) {
    return {
      ...base,
      ...(await buildFormReportVariables(creatorId, frequency)),
    };
  }

  return {
    ...base,
    ...(await buildOverviewReportVariables(creatorId, frequency)),
  };
};

export const resolveNotificationRecipientEmail = (
  recipient: NotificationRecipient,
  accountEmail: string,
  otherEmail: string | null | undefined,
) => {
  if (recipient === NOTIFICATION_RECIPIENT.OTHER_EMAIL) {
    const trimmedOtherEmail = otherEmail?.trim();
    if (!trimmedOtherEmail) {
      return null;
    }

    return trimmedOtherEmail;
  }

  return accountEmail.trim();
};

export const getNotificationTemplateName = (type: NotificationType) => {
  if (type === NOTIFICATION_TYPE.SALES) {
    return NOTIFICATION_TEMPLATE.SALES;
  }

  if (type === NOTIFICATION_TYPE.FORM) {
    return NOTIFICATION_TEMPLATE.FORM;
  }

  return NOTIFICATION_TEMPLATE.OVERVIEW;
};

export const getNotificationMailSubject = (
  type: NotificationType,
  periodLabel: string,
) => {
  const label = getReportTypeLabel(type);
  return `${NOTIFICATION_MAIL_SUBJECT_PREFIX} ${label} Report — ${periodLabel}`;
};

export type NotificationSettingsRow = typeof notificationSettings.$inferSelect;
