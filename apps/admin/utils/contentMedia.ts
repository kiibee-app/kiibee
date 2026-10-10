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

export function isCloudflareStreamVideoId(key?: string | null): boolean {
  const trimmed = key?.trim() ?? "";
  return /^[a-f0-9]{32}$/i.test(trimmed) && !trimmed.includes("/");
}

function parsePreviewUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function toEmbeddablePreviewUrl(url: string): string {
  const parsed = parsePreviewUrl(url.trim());
  if (!parsed) {
    return url;
  }

  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();

  if (host === "youtu.be") {
    const videoId = parsed.pathname.replace(/^\/+/, "").split("/")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  if (host === "youtube.com") {
    const fromQuery = parsed.searchParams.get("v")?.trim();
    if (fromQuery) {
      return `https://www.youtube.com/embed/${fromQuery}`;
    }
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (
      segments.length >= 2 &&
      ["shorts", "embed", "live", "v", "e"].includes(segments[0].toLowerCase())
    ) {
      return `https://www.youtube.com/embed/${segments[1].split("?")[0]}`;
    }
  }

  if (host === "vimeo.com") {
    const segments = parsed.pathname
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean);
    const videoId = segments[0] === "video" ? segments[1] : segments[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
  }

  return url;
}

export function isEmbedVideoUrl(url: string): boolean {
  const parsed = parsePreviewUrl(url);
  if (!parsed) {
    return false;
  }
  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
  return (
    host === "player.vimeo.com" ||
    host.endsWith("youtube.com") ||
    host === "youtu.be" ||
    host === "vimeo.com" ||
    host.endsWith("cloudflarestream.com")
  );
}
