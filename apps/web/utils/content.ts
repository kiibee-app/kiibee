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
