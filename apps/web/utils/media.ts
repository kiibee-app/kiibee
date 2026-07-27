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
const SPACES_HOST_PATTERN = /\.digitaloceanspaces\.com$/i;

function getMediaCdnBase(): string | null {
  const explicit = process.env.NEXT_PUBLIC_MEDIA_CDN_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const bucket = process.env.NEXT_PUBLIC_DO_BUCKET?.trim();
  const region = process.env.NEXT_PUBLIC_DO_REGION?.trim();
  if (bucket && region) {
    return `https://${bucket}.${region}.digitaloceanspaces.com`;
  }

  return null;
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

/**
 * DO Spaces object keys for legacy Umbraco media use Unicode NFD
 * (e.g. `e` + combining grave), not NFC (`è`). Percent-encode each segment
 * so browsers/Next Image hit the same key.
 */
export function encodeSpacesMediaPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return path
    .split("/")
    .map((segment) => {
      if (!segment) {
        return "";
      }

      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {
        // keep raw segment when it is not valid percent-encoding
      }

      return encodeURIComponent(decoded.normalize("NFD"));
    })
    .join("/");
}

function buildCdnMediaUrl(pathname: string): string | null {
  const cdnBase = getMediaCdnBase();
  if (!cdnBase) {
    return null;
  }

  return `${cdnBase}${encodeSpacesMediaPath(toCdnMediaPath(pathname))}`;
}

function isLegacyKiibeeMediaPath(pathname: string): boolean {
  return KIIBEE_MEDIA_PATH_PREFIX.test(pathname);
}

function resolveLegacyKiibeeMediaPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${KIIBEE_MEDIA_BASE_URL}${path}`;
}

function rewriteAbsoluteMediaUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const pathname = (() => {
      try {
        return decodeURIComponent(parsed.pathname);
      } catch {
        return parsed.pathname;
      }
    })();

    if (
      KIIBEE_MEDIA_HOSTS.has(parsed.hostname) &&
      isLegacyKiibeeMediaPath(pathname)
    ) {
      return (
        buildCdnMediaUrl(pathname) ?? `${KIIBEE_MEDIA_BASE_URL}${pathname}`
      );
    }

    if (SPACES_HOST_PATTERN.test(parsed.hostname)) {
      const cdnBase = getMediaCdnBase();
      const origin = cdnBase ?? `${parsed.protocol}//${parsed.host}`;
      return `${origin}${encodeSpacesMediaPath(pathname)}`;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[media.ts] Failed to rewrite Kiibee media URL:",
        url,
        error,
      );
    }
    return url;
  }

  return url;
}

export function resolveImageUrl(image: ImageSource) {
  return isString(image) ? image : image.src;
}

export function isStaticImageData(
  image: ImageSource | undefined,
): image is StaticImageData {
  return typeof image === "object" && image !== null && "src" in image;
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
    return rewriteAbsoluteMediaUrl(trimmed);
  }

  if (trimmed.startsWith("//")) {
    return rewriteAbsoluteMediaUrl(`https:${trimmed}`);
  }

  if (trimmed.startsWith("/")) {
    if (isLegacyKiibeeMediaPath(trimmed)) {
      return buildCdnMediaUrl(trimmed) ?? resolveLegacyKiibeeMediaPath(trimmed);
    }

    return buildCdnMediaUrl(trimmed) ?? resolveLegacyKiibeeMediaPath(trimmed);
  }

  if (/^media\//i.test(trimmed)) {
    return (
      buildCdnMediaUrl(`/${trimmed}`) ??
      resolveLegacyKiibeeMediaPath(`/${trimmed}`)
    );
  }

  return trimmed;
}

const CLOUDFLARE_THUMBNAIL_URL_PATTERN =
  /^(https?:\/\/(?:[^/]+\.)?(?:videodelivery\.net|cloudflarestream\.com))\/([a-f0-9]{32})\/thumbnails\/thumbnail\.jpg(?:\?.*)?$/i;

/** Expand Cloudflare stream thumbnail URLs into timed/height variants. */
export function expandCloudflareThumbnailCandidates(url: string): string[] {
  const match = url.trim().match(CLOUDFLARE_THUMBNAIL_URL_PATTERN);
  if (!match) {
    return [url];
  }

  const [, origin, videoId] = match;
  return [
    `${origin}/${videoId}/thumbnails/thumbnail.jpg?time=1s&height=600`,
    `${origin}/${videoId}/thumbnails/thumbnail.jpg?time=1s`,
    `${origin}/${videoId}/thumbnails/thumbnail.jpg`,
    `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=1s&height=600`,
    `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg?time=1s`,
    `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`,
  ];
}

function isCloudflareThumbnailHost(url: string): boolean {
  return /(?:videodelivery\.net|cloudflarestream\.com)/i.test(url);
}

export function resolveContentThumbnailCandidates(
  thumbnailUrl?: string | null,
  thumbnailLandscapeUrl?: string | null,
  options?: { preferLandscape?: boolean },
): string[] {
  const primary = options?.preferLandscape
    ? thumbnailLandscapeUrl
    : thumbnailUrl;
  const secondary = options?.preferLandscape
    ? thumbnailUrl
    : thumbnailLandscapeUrl;

  const candidates = [primary, secondary]
    .map((url) => resolvePublicMediaUrl(url))
    .filter((url): url is string => Boolean(url))
    .flatMap(expandCloudflareThumbnailCandidates);

  // Prefer durable media URLs — many legacy Cloudflare stream IDs 404.
  const durable: string[] = [];
  const cloudflare: string[] = [];
  for (const candidate of candidates) {
    if (isCloudflareThumbnailHost(candidate)) {
      cloudflare.push(candidate);
    } else {
      durable.push(candidate);
    }
  }

  return [...new Set([...durable, ...cloudflare])];
}

export function resolveContentThumbnailUrl(
  thumbnailUrl?: string | null,
  thumbnailLandscapeUrl?: string | null,
  options?: { preferLandscape?: boolean },
): string | null {
  return (
    resolveContentThumbnailCandidates(
      thumbnailUrl,
      thumbnailLandscapeUrl,
      options,
    )[0] ?? null
  );
}

export const REMOTE_COVER_IMAGE_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
};

export const REMOTE_CONTAIN_IMAGE_STYLE: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  objectPosition: "center",
  padding: "14% 8%",
  boxSizing: "border-box",
};

/** Content cards — fill frame, keep poster title/top visible. */
export const CONTENT_POSTER_IMAGE_STYLE: CSSProperties = {
  ...REMOTE_COVER_IMAGE_STYLE,
  objectPosition: "center top",
};

/** Single content / wide hero — center the subject in landscape frames. */
export const CONTENT_HERO_IMAGE_STYLE: CSSProperties = {
  ...REMOTE_COVER_IMAGE_STYLE,
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[media.ts] Failed to extract Cloudflare stream video ID from URL:",
        trimmedUrl,
        error,
      );
    }
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
const YOUTUBE_PATH_ID_MARKERS = new Set(["shorts", "embed", "live", "v", "e"]);
const URL_PATTERN = /^https?:\/\/.+/i;

function safeParseUrl(url: string): URL | null {
  if (!URL_PATTERN.test(url)) return null;
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function isYouTubeUrl(url?: string | null): boolean {
  const parsed = safeParseUrl(url?.trim() ?? "");
  return parsed ? YOUTUBE_HOST_PATTERN.test(parsed.hostname) : false;
}

/** Extract a YouTube video id from watch, shorts, embed, live, or youtu.be URLs. */
export function extractYouTubeVideoId(url?: string | null): string | null {
  const parsed = safeParseUrl(url?.trim() ?? "");
  if (!parsed || !YOUTUBE_HOST_PATTERN.test(parsed.hostname)) {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
  if (host === "youtu.be") {
    const id = parsed.pathname.replace(/^\/+/, "").split("/")[0];
    return id || null;
  }

  const fromQuery = parsed.searchParams.get("v")?.trim();
  if (fromQuery) {
    return fromQuery;
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (
    segments.length >= 2 &&
    YOUTUBE_PATH_ID_MARKERS.has(segments[0].toLowerCase())
  ) {
    return segments[1].split("?")[0] || null;
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url);
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
  const segments = parsed.pathname
    .replace(/^\/+/, "")
    .split("/")
    .filter(Boolean);
  // /123456 or /video/123456
  const videoId = segments[0] === "video" ? segments[1] : segments[0];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
}

export function isThirdPartyVideoUrl(src: string): boolean {
  return isYouTubeUrl(src) || isVimeoUrl(src);
}

function withAutoplay(embedUrl: string): string {
  const separator = embedUrl.includes("?") ? "&" : "?";
  return `${embedUrl}${separator}autoplay=1`;
}

export function getThirdPartyEmbedUrl(src: string): string {
  if (isYouTubeUrl(src)) return withAutoplay(getYouTubeEmbedUrl(src));
  if (isVimeoUrl(src)) return withAutoplay(getVimeoEmbedUrl(src));
  return src;
}

export function getFallbackThumbnailUrl(
  previewUrl?: string | null,
): string | null {
  if (!previewUrl) return null;
  const cfVideoId = extractCloudflareStreamVideoId(undefined, previewUrl);
  if (cfVideoId) {
    return `https://videodelivery.net/${cfVideoId}/thumbnails/thumbnail.jpg?time=1s&height=600`;
  }
  return null;
}
