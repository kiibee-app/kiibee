export type StaticImageData = {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
};

export type Variant = "primary" | "primary-lite" | "secondary";

export function resolveImageUrl(image: string | StaticImageData) {
  return typeof image === "string" ? image : image.src;
}

export const SVG_XMLNS = "http://www.w3.org/2000/svg";
export const CATEGORY_ICON_WIDTH = 18;
export const CATEGORY_ICON_HEIGHT = 18;
export const ICON_SVG_PROP_NAMES = ["width", "height", "color"] as const;
export const KEY_ENTER = "Enter";
