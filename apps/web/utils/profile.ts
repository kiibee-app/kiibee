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
  { key: "nav.profile.home", href: "/" },
  { key: "nav.profile.collections", href: "/explore" },
  { key: "nav.profile.about", href: "/about-kiibee" },
];

export const VIEWER_PROFILE_FIELDS = {
  NAME: "name",
  EMAIL: "email",
} as const;

export type ViewerProfileField =
  (typeof VIEWER_PROFILE_FIELDS)[keyof typeof VIEWER_PROFILE_FIELDS];
