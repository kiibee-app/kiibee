import type { StaticImageData } from "next/image";

export type CtaSectionProps = {
  bgImage?: StaticImageData;
  title: string;
  subtitle?: string;
  subtitleLines?: string[];
  ctaText?: string;
  ctaHref?: string;
};
