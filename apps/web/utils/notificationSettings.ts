import type { TFunction } from "i18next";

export const NOTIFICATION_TYPE = {
  OVERVIEW: "overview",
  FORM: "form",
  SALES: "sales",
} as const;

export const NOTIFICATION_FREQUENCY = {
  MONTHLY: "monthly",
  WEEKLY: "weekly",
  DAILY: "daily",
} as const;

export const NOTIFICATION_RECIPIENT = {
  ACCOUNT_EMAIL: "account_email",
  OTHER_EMAIL: "other_email",
} as const;

export const NOTIFICATION_FIELD = {
  TYPE: "type",
  FREQUENCY: "frequency",
  RECIPIENT: "recipient",
} as const;

type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
type NotificationFrequency =
  (typeof NOTIFICATION_FREQUENCY)[keyof typeof NOTIFICATION_FREQUENCY];
type NotificationRecipient =
  (typeof NOTIFICATION_RECIPIENT)[keyof typeof NOTIFICATION_RECIPIENT];

export type SettingItem = {
  key: (typeof NOTIFICATION_FIELD)[keyof typeof NOTIFICATION_FIELD];
  title: string;
  description: string;
  value: string;
};

export type NotificationSettingKey = SettingItem["key"];
export type NotificationValues = {
  type: NotificationType;
  frequency: NotificationFrequency;
  recipient: NotificationRecipient;
  otherEmail: string;
};

export const notificationSettings: SettingItem[] = [
  {
    key: NOTIFICATION_FIELD.TYPE,
    title: "settings.notifications.type",
    description: "settings.notifications.typeDesc",
    value: NOTIFICATION_TYPE.OVERVIEW,
  },
  {
    key: NOTIFICATION_FIELD.FREQUENCY,
    title: "settings.notifications.frequency",
    description: "settings.notifications.frequencyDesc",
    value: NOTIFICATION_FREQUENCY.MONTHLY,
  },
  {
    key: NOTIFICATION_FIELD.RECIPIENT,
    title: "settings.notifications.recipient",
    description: "settings.notifications.recipientDesc",
    value: NOTIFICATION_RECIPIENT.ACCOUNT_EMAIL,
  },
];

export const DEFAULT_NOTIFICATION_VALUES: NotificationValues = {
  type: NOTIFICATION_TYPE.OVERVIEW,
  frequency: NOTIFICATION_FREQUENCY.MONTHLY,
  recipient: NOTIFICATION_RECIPIENT.ACCOUNT_EMAIL,
  otherEmail: "",
};

export const NOTIFICATION_OPTIONS: Record<
  NotificationSettingKey,
  (t: TFunction) => { label: string; value: string }[]
> = {
  type: (t: TFunction) => [
    {
      label: t("settings.notifications.overview"),
      value: NOTIFICATION_TYPE.OVERVIEW,
    },
    { label: t("settings.notifications.form"), value: NOTIFICATION_TYPE.FORM },
    {
      label: t("settings.notifications.sales"),
      value: NOTIFICATION_TYPE.SALES,
    },
  ],

  frequency: (t: TFunction) => [
    {
      label: t("settings.notifications.monthly"),
      value: NOTIFICATION_FREQUENCY.MONTHLY,
    },
    {
      label: t("settings.notifications.weekly"),
      value: NOTIFICATION_FREQUENCY.WEEKLY,
    },
    {
      label: t("settings.notifications.daily"),
      value: NOTIFICATION_FREQUENCY.DAILY,
    },
  ],

  recipient: (t: TFunction) => [
    {
      label: t("settings.notifications.accountEmail"),
      value: NOTIFICATION_RECIPIENT.ACCOUNT_EMAIL,
    },
    {
      label: t("settings.notifications.otherEmail"),
      value: NOTIFICATION_RECIPIENT.OTHER_EMAIL,
    },
  ],
};
