import type { ReactNode } from "react";
import type { NavItem } from "@/utils/navItems";
export type NavBarItem = NavItem & {
  label?: ReactNode;
};

export type HeaderProps = {
  $position: "fixed" | "absolute";
  $topOffset: string;
};

export type NavStyleProps = {
  $navPosition: "center" | "right";
};

export type NavBarProps = {
  position?: "fixed" | "absolute";
  topOffset?: string;
  innerPadding?: string;
  tabletInnerPadding?: string;
  mobileInnerPadding?: string;
  innerMaxWidth?: string;
  navPosition?: "center" | "right";
  items?: NavBarItem[];
  brand?: ReactNode;
  navBefore?: ReactNode;
  navAfter?: ReactNode;
  actions?: ReactNode;
};

export const PROFILE_NAV_ITEMS: NavBarItem[] = [
  { key: "nav.profile.home", href: "/create-profile" },
  { key: "nav.profile.collections", href: "/create-profile/collections" },
  { key: "nav.profile.about", href: "/create-profile/about" },
];
