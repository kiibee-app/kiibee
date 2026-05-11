import type { ComponentType } from "react";
import {
  AudioIcon,
  EpubIcon,
  PdfIcon,
  VideoIcon,
  WebIcon,
} from "@/assets/icons";

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

export const UPLOAD_CONTENT_TYPES = ["video", "audio", "pdf", "epub"] as const;

export type UploadContentType = (typeof UPLOAD_CONTENT_TYPES)[number];

export const CONTENT_UPLOAD_CONFIG: Record<
  UploadContentType,
  { accept: string; extensions: readonly string[] }
> = {
  video: {
    accept: ".mp4,.mkv,.mov,.m4v",
    extensions: [".mp4", ".mkv", ".mov", ".m4v"],
  },
  audio: {
    accept: ".mp3,.m4a,.wav,.wma,.alac,.flac,.ogg,.aac",
    extensions: [
      ".mp3",
      ".m4a",
      ".wav",
      ".wma",
      ".alac",
      ".flac",
      ".ogg",
      ".aac",
    ],
  },
  pdf: {
    accept: ".pdf",
    extensions: [".pdf"],
  },
  epub: {
    accept: ".epub,.mobi,.azw",
    extensions: [".epub", ".mobi", ".azw"],
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
  PREVIEW: "preview",
} as const;

export type CouponStep = (typeof COUPON_STEPS)[keyof typeof COUPON_STEPS];

export const STEP_ORDER: CouponStep[] = [
  COUPON_STEPS.DETAILS,
  COUPON_STEPS.CODES,
  COUPON_STEPS.APPLICABLE_PRODUCTS,
  COUPON_STEPS.PREVIEW,
];
