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
