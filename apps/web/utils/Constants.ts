import type { StaticImageData } from "next/image";

export const VARIANT = {
  PRIMARY: "primary",
  PRIMARY_LITE: "primary-lite",
  SECONDARY: "secondary",
  DANGER: "danger",
} as const;
export type ImageSource = StaticImageData | string;
export type Variant = (typeof VARIANT)[keyof typeof VARIANT];

export function resolveImageUrl(image: ImageSource) {
  return typeof image === "string" ? image : image.src;
}

export const SVG_XMLNS = "http://www.w3.org/2000/svg";
export const ICON_DEFAULT_COLOR = "currentColor";
export const CATEGORY_ICON_WIDTH = 18;
export const CATEGORY_ICON_HEIGHT = 18;
export const ICON_SVG_PROP_NAMES = ["width", "height", "color"] as const;
export const KEY_ENTER = "Enter";
export const DEFAULT_WINDOW_WIDTH = 1200;
export const MOBILE_BREAKPOINT = 860;
export const WINDOW_RESIZE_EVENT = "resize";
export const CURRENT_COLOR = "currentColor";
export const BG_GREEN = "green";
export const BG_WHITE = "white";
export type BgVariant = typeof BG_GREEN | typeof BG_WHITE;
export const REPEAT_PASSWORD = "repeatPassword";
export const PASSWORD = "password";
export const CONTENT_TAB = "tab";
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

export const SIZE = {
  LG: "lg",
  MD: "md",
  SM: "sm",
} as const;
export type SIZE = (typeof SIZE)[keyof typeof SIZE];
export const MEDIA_TYPE = {
  VIDEO: "video",
  EPUB: "epub",
} as const;
export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];
const KEY_SPACE = " ";
const KEY_SPACEBAR = "Spacebar";
export const FAQ_TOGGLE_KEYS = [KEY_ENTER, KEY_SPACE, KEY_SPACEBAR];
export const KEYDOWN = "keydown";
export const ESCAPE = "Escape";
export const BUTTON = "button";

export const INPUT_VARIANTS = {
  DEFAULT: "default",
  PRIMARY_GRAY: "primaryGray",
  SURFACE: "surface",
} as const;
export type InputVariant = (typeof INPUT_VARIANTS)[keyof typeof INPUT_VARIANTS];

export const SORT_DROPDOWN_VARIANT = {
  DEFAULT: "default",
  SURFACE: "surface",
  SUCCESS: "success",
} as const;
export type SortDropdownVariant =
  (typeof SORT_DROPDOWN_VARIANT)[keyof typeof SORT_DROPDOWN_VARIANT];

export const VIEW = "view";
export const APPEARANCE_DEFAULT_HEX_COLOR = "#674096";

export const SUBSCRIPTION_STEP = {
  PLAN: "plan",
  DETAILS: "details",
  PAYMENT: "payment",
} as const;
export const maxReceiptCharacters = 200;
export const maxDescriptionCharacters = 500;
export const maxLogoNameCharacters = 100;
