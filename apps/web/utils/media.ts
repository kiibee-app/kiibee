import type { StaticImageData } from "next/image";

export type ImageSource = StaticImageData | string;

export function resolveImageUrl(image: ImageSource) {
  return typeof image === "string" ? image : image.src;
}

export const ICON_DEFAULT_COLOR = "currentColor";
export const CURRENT_COLOR = "currentColor";
export const CATEGORY_ICON_WIDTH = 18;
export const CATEGORY_ICON_HEIGHT = 18;
export const ICON_SVG_PROP_NAMES = ["width", "height", "color"] as const;

export const MEDIA_TYPE = {
  VIDEO: "video",
  EPUB: "epub",
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];
