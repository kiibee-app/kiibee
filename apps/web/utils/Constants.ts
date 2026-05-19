export * from "./variants";
export * from "./media";
export * from "./keyboard";
export * from "@/lib/subscription/constants";

export const SVG_XMLNS = "http://www.w3.org/2000/svg";
export const DEFAULT_WINDOW_WIDTH = 1200;
export const MOBILE_BREAKPOINT = 860;
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
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const WEBSITE = "website";
export const OPEN_GRAPH_LOCALE_EN_US = "en_US";
export const TWITTER_CARD_SUMMARY_LARGE_IMAGE = "summary_large_image";
export const KIIBEE_LANDING_PAGE_PREVIEW_ALT = "Kiibee landing page preview";

export const CARD_BRANDS = {
  VISA: "visa",
  MASTERCARD: "mastercard",
} as const;

export const DASHBOARD_HEADER_TEXT = {
  CREATOR_PROFILE_ARIA_LABEL: "Creator profile",
  VIEWER_PROFILE_ARIA_LABEL: "Viewer profile",
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

export type CouponAction =
  | typeof COUPON_ACTION_EDIT
  | typeof COUPON_ACTION_STATUS
  | typeof COUPON_ACTION_DELETE;

export const USER_ROLES = {
  CREATOR: "creator",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
