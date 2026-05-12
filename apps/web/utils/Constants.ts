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

export const CARD_BRANDS = {
  VISA: "visa",
  MASTERCARD: "mastercard",
} as const;

export type CardBrand = (typeof CARD_BRANDS)[keyof typeof CARD_BRANDS];
