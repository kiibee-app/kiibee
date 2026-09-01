export const CONTENT_FORMAT = {
  VIDEO: "video",
  AUDIO: "audio",
  PDF: "pdf",
  EPUB: "epub",
  WEB: "web",
} as const;

export type ContentFormat =
  (typeof CONTENT_FORMAT)[keyof typeof CONTENT_FORMAT];

export function normalizeContentFormat(
  contentType?: string | null,
  contentTypeId?: string | null,
): ContentFormat {
  const raw = `${contentTypeId ?? ""} ${contentType ?? ""}`
    .trim()
    .toLowerCase();

  if (raw.includes("audio")) return CONTENT_FORMAT.AUDIO;
  if (raw.includes("pdf")) return CONTENT_FORMAT.PDF;
  if (raw.includes("epub")) return CONTENT_FORMAT.EPUB;
  if (raw.includes("web")) return CONTENT_FORMAT.WEB;
  return CONTENT_FORMAT.VIDEO;
}

function normalizeAbsoluteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  if (
    /^(www\.)?(youtube\.com|youtu\.be|m\.youtube\.com)\//i.test(trimmed) ||
    /^(player\.)?vimeo\.com\//i.test(trimmed)
  ) {
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }
  return trimmed;
}

function parsePreviewUrl(value: string): URL | null {
  try {
    return new URL(normalizeAbsoluteUrl(value));
  } catch {
    return null;
  }
}

function youtubeVideoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] || null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] || null;
    }
    return url.searchParams.get("v");
  }
  return null;
}

function vimeoVideoId(url: URL): string | null {
  if (!/vimeo\.com$/i.test(url.hostname.replace(/^www\./, ""))) {
    return null;
  }
  const segments = url.pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  if (segments[0] === "video") return segments[1] || null;
  return segments[0] || null;
}

export function toEmbeddablePreviewUrl(url: string): string {
  const parsed = parsePreviewUrl(url);
  if (!parsed) return url.trim();

  const youtubeId = youtubeVideoId(parsed);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const vimeoId = vimeoVideoId(parsed);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return parsed.toString();
}

export function isThirdPartyVideoPreviewUrl(url?: string | null): boolean {
  const parsed = parsePreviewUrl(url?.trim() ?? "");
  if (!parsed) return false;
  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  return (
    host === "vimeo.com" ||
    host === "player.vimeo.com" ||
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be"
  );
}

export function isHlsPreviewUrl(url?: string | null): boolean {
  const parsed = parsePreviewUrl(url?.trim() ?? "");
  if (!parsed) return false;
  return parsed.pathname.toLowerCase().includes(".m3u8");
}

export function isCloudflarePreviewUrl(url?: string | null): boolean {
  const parsed = parsePreviewUrl(url?.trim() ?? "");
  if (!parsed) return false;
  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  return (
    host === "iframe.cloudflarestream.com" ||
    host.endsWith(".cloudflarestream.com") ||
    host.endsWith(".videodelivery.net")
  );
}

export function canIframePreviewUrl(url?: string | null): boolean {
  const embedUrl = toEmbeddablePreviewUrl(url?.trim() ?? "");
  const parsed = parsePreviewUrl(embedUrl);
  if (!parsed) return false;
  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  if (isHlsPreviewUrl(embedUrl)) return false;
  if (host === "player.vimeo.com") return true;
  if (
    (host === "youtube.com" || host === "m.youtube.com") &&
    parsed.pathname.startsWith("/embed/")
  ) {
    return true;
  }
  if (isCloudflarePreviewUrl(embedUrl) && parsed.pathname.includes("/iframe")) {
    return true;
  }
  if (host === "iframe.cloudflarestream.com") return true;
  if (host === "vimeo.com" || host === "youtu.be") return false;
  if (host === "youtube.com") return false;
  if (parsed.pathname.toLowerCase().endsWith(".pdf")) return true;
  return false;
}

export function getContentExternalUrl(content: {
  contentUrl?: string | null;
  fileKey?: string | null;
  content_url?: string | null;
}): string | null {
  const value = content.contentUrl?.trim() || content.content_url?.trim() || "";
  if (value) return value;

  const fileKey = content.fileKey?.trim() || "";
  return /^https?:\/\//i.test(fileKey) ? fileKey : null;
}

export function canPreviewContent(params: {
  contentType?: string | null;
  contentTypeId?: string | null;
  fileKey?: string | null;
  contentUrl?: string | null;
}) {
  const format = normalizeContentFormat(
    params.contentType,
    params.contentTypeId,
  );

  if (format === CONTENT_FORMAT.WEB) {
    return Boolean(params.contentUrl?.trim());
  }

  return Boolean(params.fileKey?.trim() || params.contentUrl?.trim());
}
