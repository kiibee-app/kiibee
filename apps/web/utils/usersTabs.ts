export const USER_TABS = [
  { key: "registrations", labelKey: "users.tabs.registrations" },
  { key: "sales", labelKey: "users.tabs.sales" },
] as const;

export type UserTabKey = (typeof USER_TABS)[number]["key"];
