import type { StaticImageData } from "next/image";
import { isString } from "@/utils/Constants";

export type ImageSource = StaticImageData | string;

export type ImageBackgroundMeta = {
  src: string;
  aspect: number;
};

export const DEFAULT_CTA_BACKGROUND_ASPECT = 1440 / 682;

const REMOTE_IMAGE_PATTERN = /^https?:\/\//;

export function resolveImageUrl(image: ImageSource) {
  return isString(image) ? image : image.src;
}

export function isRemoteImageSource(image: ImageSource) {
  return isString(image) && REMOTE_IMAGE_PATTERN.test(image);
}

export function getStringImageBackgroundMeta(src: string): ImageBackgroundMeta {
  return {
    src,
    aspect: DEFAULT_CTA_BACKGROUND_ASPECT,
  };
}

export function getStaticImageBackgroundMeta(
  image: StaticImageData,
): ImageBackgroundMeta {
  return {
    src: image.src,
    aspect: image.width / image.height,
  };
}

export function getImageBackgroundMeta(
  bgImage: ImageSource | undefined,
): ImageBackgroundMeta | null {
  if (!bgImage) return null;

  if (isString(bgImage)) {
    return getStringImageBackgroundMeta(bgImage);
  }

  return getStaticImageBackgroundMeta(bgImage);
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

export function resolveMediaType(contentType?: string | null): MediaType {
  return String(contentType ?? "")
    .trim()
    .toLowerCase() === MEDIA_TYPE.EPUB
    ? MEDIA_TYPE.EPUB
    : MEDIA_TYPE.VIDEO;
}
