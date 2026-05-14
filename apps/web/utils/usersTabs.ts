export const USER_TABS = [
  { key: "registrations", labelKey: "users.tabs.registrations" },
  { key: "salest", labelKey: "users.tabs.salest" },
] as const;

export type UserTabKey = (typeof USER_TABS)[number]["key"];
