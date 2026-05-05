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
