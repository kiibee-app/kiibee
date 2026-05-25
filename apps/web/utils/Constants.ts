import type { typography } from "@repo/ui/typography";
import { COLLECTIONS, HOME } from "./common";
import { NavBarProps } from "./profile";

export const CREATOR_CHANNEL_AVATAR_TEXT = {
  HERO: "Heading2",
  NAVBAR: "H4_SemiBold",
  COMPACT: "Heading3",
} as const satisfies Record<string, keyof typeof typography>;

export type CreatorChannelAvatarTextUse =
  (typeof CREATOR_CHANNEL_AVATAR_TEXT)[keyof typeof CREATOR_CHANNEL_AVATAR_TEXT];

export * from "./variants";
export * from "./media";
export * from "./keyboard";
export * from "@/lib/subscription/constants";

export const SVG_XMLNS = "http://www.w3.org/2000/svg";
export const DEFAULT_WINDOW_WIDTH = 1200;
export const MOBILE_BREAKPOINT = 860;
export const DASHBOARD_SIDEBAR_COLLAPSE_BREAKPOINT = 1024;
export const REPEAT_PASSWORD = "repeatPassword";
export const PASSWORD = "password";
export const CONTENT_TAB = "tab";
export const BILLING_TAB = "billingTab";
export const LEGACY_DASHBOARD_TAB_QUERY_KEYS = [
  "settingsTab",
  "usersTab",
] as const;

export const PASSWORD_VISIBILITY_KEY = {
  PASSWORD,
  REPEAT_PASSWORD,
} as const;

export type PasswordVisibilityKey =
  (typeof PASSWORD_VISIBILITY_KEY)[keyof typeof PASSWORD_VISIBILITY_KEY];

export const STRING = "string";
export const VIEW = "view";
export const ROLE_CREATOR = "creator";
export const ROLE_VIEWER = "viewer";
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const WEBSITE = "website";
export const OPEN_GRAPH_LOCALE_EN_US = "en_US";
export const TWITTER_CARD_SUMMARY_LARGE_IMAGE = "summary_large_image";
export const KIIBEE_LANDING_PAGE_PREVIEW_ALT = "Kiibee landing page preview";

export const CARD_BRANDS = {
  VISA: "visa",
  MASTERCARD: "mastercard",
} as const;

export type CardBrand = (typeof CARD_BRANDS)[keyof typeof CARD_BRANDS];

export function isString(value: unknown): value is string {
  return typeof value === STRING;
}

export function toTrimmedString(value: unknown): string {
  return isString(value) ? value.trim() : "";
}

export const COUPON_ACTION_EDIT = "edit";
export const COUPON_ACTION_STATUS = "status";
export const COUPON_ACTION_DELETE = "delete";
export type ProfileHomeSectionKey = "latestUpload" | "about";

export type CouponAction =
  | typeof COUPON_ACTION_EDIT
  | typeof COUPON_ACTION_STATUS
  | typeof COUPON_ACTION_DELETE;

export const profileNavShellProps = {
  position: "absolute",
  innerPadding: "15px 110px",
  tabletInnerPadding: "12px 24px",
  mobileInnerPadding: "10px 14px",
  innerMaxWidth: "1600px",
  navPosition: "right",
  navbarHeight: "74px",
} satisfies Pick<
  NavBarProps,
  | "position"
  | "innerPadding"
  | "tabletInnerPadding"
  | "mobileInnerPadding"
  | "innerMaxWidth"
  | "navPosition"
  | "navbarHeight"
>;

export const PROFILE_LAYOUT_PAGE = {
  HOME,
  COLLECTIONS,
} as const;

export type ProfileLayoutPageKind =
  (typeof PROFILE_LAYOUT_PAGE)[keyof typeof PROFILE_LAYOUT_PAGE];
