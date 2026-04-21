import { SearchIcon } from "@/assets/icons/searchBarIcon";
import COLORS from "@repo/ui/colors";
import { ReactNode } from "react";

export const TAB_KEYS = {
  payout: "payout",
  notifications: "notifications",
  export: "export",
  search: "search",
} as const;

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

export type TabItem = {
  key: TabKey;
  labelKey?: string;
  icon?: ReactNode;
};

export const TABS: TabItem[] = [
  {
    key: TAB_KEYS.payout,
    labelKey: "settings.tabs.payout",
  },
  {
    key: TAB_KEYS.notifications,
    labelKey: "settings.tabs.notifications",
  },
  {
    key: TAB_KEYS.export,
    labelKey: "settings.tabs.export",
  },
  {
    key: TAB_KEYS.search,
    icon: <SearchIcon color={COLORS.primary.BLACK} />,
  },
];
