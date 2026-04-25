export const USER_TABS = [
  { key: "registrations", label: "Registrations (11)" },
  { key: "salest", label: "Salest (50)" },
] as const;

export type UserTabKey = (typeof USER_TABS)[number]["key"];
