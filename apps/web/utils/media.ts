import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";
import { isString } from "@/utils/Constants";

export type ImageSource = StaticImageData | string;

export type ImageBackgroundMeta = {
  src: string;
  aspect: number;
};

export const DEFAULT_CTA_BACKGROUND_ASPECT = 1440 / 682;

const REMOTE_IMAGE_PATTERN = /^https?:\/\//;
const KIIBEE_MEDIA_BASE_URL = "https://kiibee.dk";
const KIIBEE_MEDIA_HOSTS = new Set(["kiibee.dk", "www.kiibee.dk"]);
const KIIBEE_MEDIA_PATH_PREFIX = /^\/media\//;

function getMediaCdnBase(): string | null {
  const base = process.env.NEXT_PUBLIC_MEDIA_CDN_URL?.trim();
  return base ? base.replace(/\/$/, "") : null;
}

function getMediaCdnStripPrefix(): string {
  return process.env.NEXT_PUBLIC_MEDIA_CDN_STRIP_PREFIX?.trim() || "media";
}

function toCdnMediaPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const stripPrefix = getMediaCdnStripPrefix();
  const mediaPrefix = `/${stripPrefix}`;

  if (stripPrefix && path.startsWith(`${mediaPrefix}/`)) {
    return path.slice(mediaPrefix.length);
  }

  return path;
}

function buildCdnMediaUrl(pathname: string): string | null {
  const cdnBase = getMediaCdnBase();
  if (!cdnBase) {
    return null;
  }

  return `${cdnBase}${toCdnMediaPath(pathname)}`;
}

function isLegacyKiibeeMediaPath(pathname: string): boolean {
  return KIIBEE_MEDIA_PATH_PREFIX.test(pathname);
}

function resolveLegacyKiibeeMediaPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${KIIBEE_MEDIA_BASE_URL}${path}`;
}

function rewriteKiibeeMediaUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      KIIBEE_MEDIA_HOSTS.has(parsed.hostname) &&
      isLegacyKiibeeMediaPath(parsed.pathname)
    ) {
      // Umbraco media is served from kiibee.dk; keep the working legacy origin.
      return url;
    }
  } catch {
    return url;
  }

  return url;
}

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

export function resolvePublicMediaUrl(url?: string | null): string | null {
  if (typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (REMOTE_IMAGE_PATTERN.test(trimmed)) {
    return rewriteKiibeeMediaUrl(trimmed);
  }

  if (trimmed.startsWith("//")) {
    return rewriteKiibeeMediaUrl(`https:${trimmed}`);
  }

  if (trimmed.startsWith("/")) {
    if (isLegacyKiibeeMediaPath(trimmed)) {
      return resolveLegacyKiibeeMediaPath(trimmed);
    }

    return buildCdnMediaUrl(trimmed) ?? resolveLegacyKiibeeMediaPath(trimmed);
  }

  if (/^media\//i.test(trimmed)) {
    return resolveLegacyKiibeeMediaPath(`/${trimmed}`);
  }

  return trimmed;
}

export function isStaticImageData(
  image: ImageSource | undefined,
): image is StaticImageData {
  return typeof image === "object" && image !== null && "src" in image;
}

type ContentThumbnailOptions = {
  preferLandscape?: boolean;
};

export function resolveContentThumbnailCandidates(
  thumbnailUrl?: string | null,
  thumbnailLandscapeUrl?: string | null,
  options?: ContentThumbnailOptions,
): string[] {
  const primary = options?.preferLandscape
    ? thumbnailLandscapeUrl
    : thumbnailUrl;
  const secondary = options?.preferLandscape
    ? thumbnailUrl
    : thumbnailLandscapeUrl;

  const candidates = [primary, secondary]
    .map((url) => resolvePublicMediaUrl(url))
    .filter((url): url is string => Boolean(url));

  return [...new Set(candidates)];
}

export function resolveContentThumbnailUrl(
  thumbnailUrl?: string | null,
  thumbnailLandscapeUrl?: string | null,
  options?: ContentThumbnailOptions,
): string | null {
  return (
    resolveContentThumbnailCandidates(
      thumbnailUrl,
      thumbnailLandscapeUrl,
      options,
    )[0] ?? null
  );
}

export function resolveCreatorMediaCandidates(
  ...urls: Array<string | null | undefined>
): string[] {
  const candidates = urls
    .map((url) => resolvePublicMediaUrl(url))
    .filter((url): url is string => Boolean(url));

  return [...new Set(candidates)];
}

export function resolveCreatorMediaUrl(
  ...urls: Array<string | null | undefined>
): string | null {
  return resolveCreatorMediaCandidates(...urls)[0] ?? null;
}

export const REMOTE_COVER_IMAGE_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
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
    const hostname = new URL(trimmed).hostname;
    return (
      hostname === "iframe.cloudflarestream.com" ||
      hostname.endsWith(".cloudflarestream.com")
    );
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

const YOUTUBE_HOST_PATTERN = /(?:youtube\.com|youtu\.be)/i;
const URL_PATTERN = /^https?:\/\/.+/i;

function safeParseUrl(url: string): URL | null {
  if (!URL_PATTERN.test(url)) return null;
  return new URL(url);
}

export function isYouTubeUrl(url?: string | null): boolean {
  const parsed = safeParseUrl(url?.trim() ?? "");
  return parsed ? YOUTUBE_HOST_PATTERN.test(parsed.hostname) : false;
}

export function getYouTubeEmbedUrl(url: string): string {
  const parsed = safeParseUrl(url);
  if (!parsed) return url;
  const videoId =
    parsed.hostname === "youtu.be"
      ? parsed.pathname.replace(/^\/+/, "").split("/")[0]
      : parsed.searchParams.get("v") || "";
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

const VIMEO_HOST_PATTERN = /vimeo\.com/i;

export function isVimeoUrl(url?: string | null): boolean {
  const parsed = safeParseUrl(url?.trim() ?? "");
  return parsed ? VIMEO_HOST_PATTERN.test(parsed.hostname) : false;
}

export function getVimeoEmbedUrl(url: string): string {
  const parsed = safeParseUrl(url);
  if (!parsed) return url;
  const videoId = parsed.pathname.replace(/^\/+/, "").split("/")[0];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
}

export function isThirdPartyVideoUrl(src: string): boolean {
  return isYouTubeUrl(src) || isVimeoUrl(src);
}

export function getThirdPartyEmbedUrl(src: string): string {
  if (isYouTubeUrl(src)) return `${getYouTubeEmbedUrl(src)}?autoplay=1`;
  if (isVimeoUrl(src)) return `${getVimeoEmbedUrl(src)}?autoplay=1`;
  return src;
}
