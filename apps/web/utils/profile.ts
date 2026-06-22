import type { ReactNode } from "react";
import type { TabbedHeroState } from "@/hooks/useTabbedHeroState";
import type { NavItem } from "@/utils/navItems";
import { TONE_DARK, TONE_LIGHT } from "@/utils/Constants";

export type HeroTabsProps = Pick<
  TabbedHeroState,
  | "profileTabs"
  | "activeTab"
  | "searchOpen"
  | "searchValue"
  | "handleTabChange"
  | "setSearchOpen"
  | "setSearchValue"
> & {
  centered?: boolean;
};
export type NavBarItem = NavItem & {
  label?: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

export type HeaderProps = {
  $position: "fixed" | "absolute";
  $topOffset: string;
  $navbarHeight?: string;
  $isMegaOpen?: boolean;
};

export type NavStyleProps = {
  $navPosition: "center" | "right";
  $textTone: typeof TONE_DARK | typeof TONE_LIGHT;
};

export type NavBarProps = {
  position?: "fixed" | "absolute";
  topOffset?: string;
  navbarHeight?: string;
  innerPadding?: string;
  tabletInnerPadding?: string;
  mobileInnerPadding?: string;
  innerMaxWidth?: string;
  navPosition?: "center" | "right";
  navTextTone?: typeof TONE_DARK | typeof TONE_LIGHT;
  items?: NavBarItem[];
  brand?: ReactNode;
  navBefore?: ReactNode;
  navAfter?: ReactNode;
  actions?: ReactNode;
  routeActiveItems?: boolean;
  hideHamburger?: boolean;
};

export const VIEWER_PROFILE_FIELDS = {
  NAME: "name",
  EMAIL: "email",
} as const;

export type ViewerProfileField =
  (typeof VIEWER_PROFILE_FIELDS)[keyof typeof VIEWER_PROFILE_FIELDS];
