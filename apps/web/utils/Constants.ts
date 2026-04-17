export type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
};

export const VARIANT = {
  PRIMARY: "primary",
  PRIMARY_LITE: "primary-lite",
  SECONDARY: "secondary",
} as const;

export type Variant = (typeof VARIANT)[keyof typeof VARIANT];

export function resolveImageUrl(image: string | StaticImageData) {
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
