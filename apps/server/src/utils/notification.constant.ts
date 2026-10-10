export const NOTIFICATION_TYPE = {
  OVERVIEW: 'overview',
  FORM: 'form',
  SALES: 'sales',
} as const;

export const NOTIFICATION_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export const NOTIFICATION_RECIPIENT = {
  ACCOUNT_EMAIL: 'account_email',
  OTHER_EMAIL: 'other_email',
} as const;

export const NOTIFICATION_SETTING_TYPES = [
  NOTIFICATION_TYPE.OVERVIEW,
  NOTIFICATION_TYPE.FORM,
  NOTIFICATION_TYPE.SALES,
] as const;

export const NOTIFICATION_FREQUENCIES = [
  NOTIFICATION_FREQUENCY.MONTHLY,
  NOTIFICATION_FREQUENCY.WEEKLY,
  NOTIFICATION_FREQUENCY.DAILY,
] as const;

export const NOTIFICATION_RECIPIENTS = [
  NOTIFICATION_RECIPIENT.ACCOUNT_EMAIL,
  NOTIFICATION_RECIPIENT.OTHER_EMAIL,
] as const;

export const NOTIFICATION_TEMPLATE = {
  OVERVIEW: 'overviewReport',
  SALES: 'salesReport',
  FORM: 'formReport',
} as const;

export const NOTIFICATION_FREQUENCY_LABEL = {
  [NOTIFICATION_FREQUENCY.DAILY]: 'Daglig',
  [NOTIFICATION_FREQUENCY.WEEKLY]: 'Ugentlig',
  [NOTIFICATION_FREQUENCY.MONTHLY]: 'Månedlig',
} as const;

export const NOTIFICATION_TYPE_LABEL = {
  [NOTIFICATION_TYPE.OVERVIEW]: 'Oversigt',
  [NOTIFICATION_TYPE.SALES]: 'Salg',
  [NOTIFICATION_TYPE.FORM]: 'Formular',
} as const;

export const NOTIFICATION_DASHBOARD = {
  CREATOR_PATH: '/dashboard/creators',
  USERS_VIEW: 'Users',
  SALES_TAB: 'sales',
  REGISTRATIONS_TAB: 'registrations',
} as const;

export const NOTIFICATION_MAIL_SUBJECT_PREFIX = 'Din Kiibee';

export type NotificationSettingType =
  (typeof NOTIFICATION_SETTING_TYPES)[number];
export type NotificationFrequency = (typeof NOTIFICATION_FREQUENCIES)[number];
export type NotificationRecipient = (typeof NOTIFICATION_RECIPIENTS)[number];
export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
