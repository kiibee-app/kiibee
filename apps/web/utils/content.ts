import type { ComponentType } from "react";
import {
  AudioIcon,
  EpubIcon,
  PdfIcon,
  VideoIcon,
  WebIcon,
} from "@/assets/icons";
import { FORMAT_TYPE, FormatType } from "./types";
import { FILE_EXTENSION, MIME_TYPE } from "./common";
import { TFunction } from "i18next";

export type ContentType = "video" | "audio" | "pdf" | "epub" | "web";

export type IconComponent = ComponentType<{
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
}>;

export type ContentTypeOption = {
  key: ContentType;
  labelKey: string;
  Icon: IconComponent;
};

export const API_CONTENT_TYPE = {
  ...FORMAT_TYPE,
  WEB_LINK: "web-link",
} as const;

export const CONTENT_TYPE_BY_API_VALUE: Record<string, ContentType> = {
  [API_CONTENT_TYPE.VIDEO]: FORMAT_TYPE.VIDEO,
  [API_CONTENT_TYPE.AUDIO]: FORMAT_TYPE.AUDIO,
  [API_CONTENT_TYPE.PDF]: FORMAT_TYPE.PDF,
  [API_CONTENT_TYPE.EPUB]: FORMAT_TYPE.EPUB,
  [API_CONTENT_TYPE.WEB]: FORMAT_TYPE.WEB,
  [API_CONTENT_TYPE.WEB_LINK]: FORMAT_TYPE.WEB,
};

export const DEFAULT_CONTENT_TYPE = FORMAT_TYPE.PDF;

export const CONTENT_UPLOAD_MODE = {
  CREATE: "create",
  EDIT: "edit",
} as const;

export const CONTENT_MODAL_KEY_FALLBACK = "create-content";

export type ContentUploadMode =
  (typeof CONTENT_UPLOAD_MODE)[keyof typeof CONTENT_UPLOAD_MODE];

export const UPLOAD_CONTENT_TYPES = ["video", "audio", "pdf", "epub"] as const;

export type UploadContentType = (typeof UPLOAD_CONTENT_TYPES)[number];

export type MediaUploadFileType = "documents" | "audio" | "ebooks";

export const MEDIA_UPLOAD_FILE_TYPE_MAP: Record<
  Exclude<UploadContentType, "video">,
  MediaUploadFileType
> = {
  audio: "audio",
  pdf: "documents",
  epub: "ebooks",
};

export const CONTENT_UPLOAD_CONFIG: Record<
  UploadContentType,
  { accept: string; extensions: readonly string[] }
> = {
  video: {
    accept: ".mp4",
    extensions: [".mp4"],
  },
  audio: {
    accept: ".mp3,.wav,.ogg",
    extensions: [".mp3", ".wav", ".ogg"],
  },
  pdf: {
    accept: ".pdf",
    extensions: [".pdf"],
  },
  epub: {
    accept: ".epub",
    extensions: [".epub"],
  },
} as const;

export const isUploadContentType = (
  contentType: ContentType,
): contentType is UploadContentType =>
  UPLOAD_CONTENT_TYPES.includes(contentType as UploadContentType);

export const resolveUploadContentType = (
  contentType: ContentType | null,
): UploadContentType => {
  if (!contentType) return "video";
  return isUploadContentType(contentType) ? contentType : "video";
};

export const normalizeContentTypeValue = (
  value?: string | null,
): ContentType => {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, "-");

  if (!normalized) return DEFAULT_CONTENT_TYPE;

  return CONTENT_TYPE_BY_API_VALUE[normalized] ?? DEFAULT_CONTENT_TYPE;
};

export const getContentTypeLabel = (contentType: ContentType) =>
  contentType.toUpperCase();

export const CONTENT_TYPE_OPTIONS: readonly ContentTypeOption[] = [
  {
    key: "video",
    labelKey: "contents.contentTypeModal.options.video",
    Icon: VideoIcon,
  },
  {
    key: "audio",
    labelKey: "contents.contentTypeModal.options.audio",
    Icon: AudioIcon,
  },
  {
    key: "pdf",
    labelKey: "contents.contentTypeModal.options.pdf",
    Icon: PdfIcon,
  },
  {
    key: "epub",
    labelKey: "contents.contentTypeModal.options.epub",
    Icon: EpubIcon,
  },
  {
    key: "web",
    labelKey: "contents.contentTypeModal.options.web",
    Icon: WebIcon,
  },
] as const;

export const COUPON_STEPS = {
  DETAILS: "details",
  CODES: "codes",
  APPLICABLE_PRODUCTS: "applicable-products",
  VALIDITY: "validity",
  PREVIEW: "preview",
} as const;

export type CouponStep = (typeof COUPON_STEPS)[keyof typeof COUPON_STEPS];

export const STEP_ORDER: CouponStep[] = [
  COUPON_STEPS.DETAILS,
  COUPON_STEPS.CODES,
  COUPON_STEPS.APPLICABLE_PRODUCTS,
  COUPON_STEPS.VALIDITY,
  COUPON_STEPS.PREVIEW,
];

export const FILE_TYPE_CHECKERS: Record<FormatType, (file: File) => boolean> = {
  [FORMAT_TYPE.VIDEO]: (file) => file.type.startsWith(MIME_TYPE.VIDEO),
  [FORMAT_TYPE.AUDIO]: (file) => file.type.startsWith(MIME_TYPE.AUDIO),
  [FORMAT_TYPE.PDF]: (file) => file.type === MIME_TYPE.PDF,
  [FORMAT_TYPE.EPUB]: (file) =>
    file.name.toLowerCase().endsWith(FILE_EXTENSION.EPUB),
  [FORMAT_TYPE.WEB]: () => false,
};

export const TRAILER_VISIBILITY = {
  PUBLIC: "public",
  HIDDEN: "hidden",
  DRAFT: "draft",
} as const;

export type TrailerVisibility =
  (typeof TRAILER_VISIBILITY)[keyof typeof TRAILER_VISIBILITY];

export const FIELD_KEYS = {
  PUBLISHED_YEAR: "publishedYear",
  DURATION: "duration",
  CATEGORY: "category",
} as const;
export type FormKey = (typeof FIELD_KEYS)[keyof typeof FIELD_KEYS];

export const CATEGORY_KEYS = {
  EDUCATION: "education",
  FOOD: "food",
  ART: "art",
  DESIGN: "design",
} as const;

export type CategoryKey = (typeof CATEGORY_KEYS)[keyof typeof CATEGORY_KEYS];

export const getCategoryOptions = (t: TFunction) => [
  {
    value: CATEGORY_KEYS.EDUCATION,
    label: t("contents.metadata.category.education"),
  },
  { value: CATEGORY_KEYS.FOOD, label: t("contents.metadata.category.food") },
  { value: CATEGORY_KEYS.ART, label: t("contents.metadata.category.art") },
  {
    value: CATEGORY_KEYS.DESIGN,
    label: t("contents.metadata.category.design"),
  },
];

export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};

export const COUPON_MODE = {
  PREVIEW: "preview",
  DETAILS: "details",
} as const;

export type CouponMode = (typeof COUPON_MODE)[keyof typeof COUPON_MODE];
export const POST_METHOD = "POST";
