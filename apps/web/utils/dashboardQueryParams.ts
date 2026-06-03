import { ADD_CONTENT_TABS, CONTENT_TABS } from "@/utils/common";
import {
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
  CONTENT_LAST_EDITED_STORAGE_KEY,
  CONTENT_TAB,
  LEGACY_DASHBOARD_TAB_QUERY_KEYS,
} from "@/utils/Constants";
import { CREATORS_LABELS } from "@/utils/SidebarItems";
import { TAB_KEYS } from "@/utils/settingsTabs";
import { storage } from "@/utils/storage";
import { USER_TABS } from "@/utils/usersTabs";

export const CONTENTS_VIEW_QUERY_KEYS = [
  CONTENT_COLLECTION_QUERY_KEY,
  CONTENT_ITEM_QUERY_KEY,
] as const;

const USERS_TAB_KEYS = new Set(USER_TABS.map((tab) => tab.key));
const SETTINGS_TAB_KEYS = new Set<string>([
  TAB_KEYS.payout,
  TAB_KEYS.notifications,
  TAB_KEYS.export,
]);
const CONTENTS_TAB_KEYS = new Set<string>([
  ...CONTENT_TABS.map((tab) => tab.key),
  ...Object.values(ADD_CONTENT_TABS),
]);

function getValidTabsForView(view: string): Set<string> | null {
  switch (view) {
    case CREATORS_LABELS.USERS:
      return USERS_TAB_KEYS;
    case CREATORS_LABELS.CONTENTS:
      return CONTENTS_TAB_KEYS;
    case CREATORS_LABELS.SETTINGS:
      return SETTINGS_TAB_KEYS;
    default:
      return null;
  }
}

export function stripContentsViewQueryParams(params: URLSearchParams): boolean {
  let changed = false;

  for (const key of CONTENTS_VIEW_QUERY_KEYS) {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }

  if (changed) {
    storage.remove(CONTENT_LAST_EDITED_STORAGE_KEY);
  }

  return changed;
}

export function sanitizeDashboardQueryParams(
  params: URLSearchParams,
  view: string,
): boolean {
  let changed = false;

  if (view !== CREATORS_LABELS.CONTENTS) {
    changed = stripContentsViewQueryParams(params);
  }

  for (const key of LEGACY_DASHBOARD_TAB_QUERY_KEYS) {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }

  const validTabs = getValidTabsForView(view);
  const tab = params.get(CONTENT_TAB);

  if (validTabs === null) {
    if (tab) {
      params.delete(CONTENT_TAB);
      changed = true;
    }
  } else if (tab && !validTabs.has(tab)) {
    params.delete(CONTENT_TAB);
    changed = true;
  }

  return changed;
}
