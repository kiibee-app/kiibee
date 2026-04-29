export const ALERT = "alert";

export const COLLECTIONS = "collections";
export const APPEARANCE = "appearance";
export const SETTINGS = "settings";
export const COUPONS = "coupons";
export const HELP = "Help";

type ContentTabItem = {
  key: ContentTab;
  labelKey: string;
  descriptionKey?: string;
  description?: string;
};

export type ContentTab = "collections" | "appearance" | "settings" | "coupons";

export const CONTENT_TABS: readonly ContentTabItem[] = [
  {
    key: COLLECTIONS,
    labelKey: "contents.tabs.collections",
    descriptionKey: "Collections content will appear here",
  },
  {
    key: APPEARANCE,
    labelKey: "contents.tabs.appearance",
    descriptionKey: "Appearance content will appear here",
  },
  {
    key: SETTINGS,
    labelKey: "contents.tabs.settings",
    descriptionKey: "Settings content will appear here",
  },
  {
    key: COUPONS,
    labelKey: "contents.tabs.coupons",
    description: "Coupons content will appear here.",
  },
] as const;
