export const ALERT = "alert";

export const COLLECTIONS = "collections";
export const SETTINGS = "settings";

type ContentTabItem = {
  key: ContentTab;
  labelKey: string;
  descriptionKey?: string;
  description?: string;
};

export type ContentTab = "collections" | "appearance" | "settings" | "coupons";

export const CONTENT_TABS: readonly ContentTabItem[] = [
  {
    key: "collections",
    labelKey: "contents.tabs.collections",
    descriptionKey: "Collections content will appear here",
  },
  {
    key: "appearance",
    labelKey: "contents.tabs.appearance",
    descriptionKey: "Appearance content will appear here",
  },
  {
    key: SETTINGS,
    labelKey: "contents.tabs.settings",
    descriptionKey: "Settings content will appear here",
  },
  {
    key: "coupons",
    labelKey: "contents.tabs.coupons",
    description: "Coupons content will appear here.",
  },
] as const;
