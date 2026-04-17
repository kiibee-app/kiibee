import type { ImageSource } from "@/utils/Constants";

export type CtaSectionProps = {
  bgImage?: ImageSource;
  title: string;
  subtitle?: string;
  subtitleLines?: string[];
  ctaText?: string;
  ctaHref?: string;
};
