import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";

export type ImageSource = StaticImageData | string;
const REMOTE_IMAGE_PATTERN = /^https?:\/\//;
const KIIBEE_MEDIA_BASE_URL = "https://kiibee.dk";

export function resolveImageUrl(image: ImageSource) {
  return typeof image === "string" ? image : image.src;
}

export function isRemoteImageSource(image: ImageSource) {
  return typeof image === "string" && REMOTE_IMAGE_PATTERN.test(image);
}

export function resolvePublicMediaUrl(url?: string | null): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (REMOTE_IMAGE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${KIIBEE_MEDIA_BASE_URL}${trimmed}`;
  }

  return trimmed;
}

export const REMOTE_COVER_IMAGE_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

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

const CLOUDFLARE_STREAM_VIDEO_ID_PATTERN = /^[a-f0-9]{32}$/i;
const CLOUDFLARE_STREAM_HOST_PATTERN =
  /(?:videodelivery\.net|cloudflarestream\.com|iframe\.cloudflarestream\.com)/i;

export function extractCloudflareStreamVideoId(
  fileKey?: string | null,
  contentUrl?: string | null,
): string | null {
  const trimmedKey = fileKey?.trim();
  if (
    trimmedKey &&
    CLOUDFLARE_STREAM_VIDEO_ID_PATTERN.test(trimmedKey) &&
    !trimmedKey.includes("/")
  ) {
    return trimmedKey;
  }

  const trimmedUrl = contentUrl?.trim();
  if (!trimmedUrl || !CLOUDFLARE_STREAM_HOST_PATTERN.test(trimmedUrl)) {
    return null;
  }

  try {
    const { hostname, pathname } = new URL(trimmedUrl);
    if (hostname === "iframe.cloudflarestream.com") {
      const iframeId = pathname.replace(/^\/+/, "").split("/")[0];
      return iframeId || null;
    }

    const pathId = pathname.replace(/^\/+/, "").split("/")[0];
    return pathId || null;
  } catch {
    return null;
  }
}

export function getCloudflareStreamEmbedUrl(videoId: string): string {
  return `https://iframe.cloudflarestream.com/${videoId.trim()}`;
}

export function isCloudflareStreamEmbedUrl(url?: string | null): boolean {
  const trimmed = url?.trim();
  if (!trimmed) {
    return false;
  }

  try {
    return new URL(trimmed).hostname === "iframe.cloudflarestream.com";
  } catch {
    return false;
  }
}

export function resolveCloudflareStreamPlaybackUrl(
  fileKey?: string | null,
  contentUrl?: string | null,
): string | null {
  const videoId = extractCloudflareStreamVideoId(fileKey, contentUrl);
  return videoId ? getCloudflareStreamEmbedUrl(videoId) : null;
}
