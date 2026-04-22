export type SettingItem = {
  title: string;
  description: string;
  value: string;
};

export const notificationSettings: SettingItem[] = [
  {
    title: "settings.notifications.type",
    description: "settings.notifications.typeDesc",
    value: "settings.notifications.overview",
  },
  {
    title: "settings.notifications.frequency",
    description: "settings.notifications.frequencyDesc",
    value: "settings.notifications.monthly",
  },
  {
    title: "settings.notifications.recipient",
    description: "settings.notifications.recipientDesc",
    value: "settings.notifications.accountEmail",
  },
];
