import { SearchIcon } from "@/assets/icons/searchBarIcon";
import COLORS from "@repo/ui/colors";
import { ReactNode } from "react";

export type TabKey = "payout" | "notifications" | "export" | "search";

export const TABS: { key: TabKey; label: ReactNode }[] = [
  { key: "payout", label: "Payout" },
  { key: "notifications", label: "Notifications" },
  { key: "export", label: "Export" },
  {
    key: "search",
    label: <SearchIcon color={COLORS.primary.BLACK} />,
  },
];
