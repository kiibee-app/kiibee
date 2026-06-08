export const USER_TAB_KEYS = {
  registrations: "registrations",
  sales: "sales",
} as const;

export type UserTabKey = (typeof USER_TAB_KEYS)[keyof typeof USER_TAB_KEYS];

export const USER_TABS = [
  {
    key: USER_TAB_KEYS.registrations,
    labelKey: "users.tabs.registrations",
  },
  { key: USER_TAB_KEYS.sales, labelKey: "users.tabs.sales" },
] as const;
