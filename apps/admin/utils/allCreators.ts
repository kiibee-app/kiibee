export const ALL_CREATORS_TAB_KEYS = {
  CREATORS: "creators",
  SETTINGS: "settings",
} as const;

export const ALL_CREATORS_TABS = [
  { key: ALL_CREATORS_TAB_KEYS.CREATORS, label: "All Creators" },
  { key: ALL_CREATORS_TAB_KEYS.SETTINGS, label: "Creator Settings" },
] as const;

export type AllCreatorsTab = (typeof ALL_CREATORS_TABS)[number]["key"];

export const DEFAULT_ALL_CREATORS_TAB: AllCreatorsTab =
  ALL_CREATORS_TAB_KEYS.CREATORS;
export const ALL_CREATORS_TABLIST_LABEL = "Creator management views";

export const CREATOR_DOWNLOAD_LIMIT_OPTIONS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

export type CreatorDownloadLimit =
  (typeof CREATOR_DOWNLOAD_LIMIT_OPTIONS)[number];

export const DEFAULT_CREATOR_DOWNLOAD_LIMIT: CreatorDownloadLimit = "0";

export const CREATOR_SETTINGS_TEXT = {
  TITLE: "Download limit",
  DESCRIPTION: "Set maximum number of times creator content can be downloaded.",
  FIELD_LABEL: "Maximum download limit",
  SAVE_BUTTON: "Save",
  SAVING_BUTTON: "Saving...",
  SUCCESS_MESSAGE: "Download limit saved successfully",
  ERROR_MESSAGE: "Failed to save download limit",
} as const;
