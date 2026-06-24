import { type ImageProps, type StaticImageData } from "next/image";
import { type HTMLAttributes, type ReactNode } from "react";
import { type ImageSource } from "@/utils/Constants";
import type { DiscoverContentItem } from "@/utils/discoverContent";

export const IMAGE_SIZES = {
  fullViewport: "100vw",
  securePayment: "(max-width: 1024px) 100vw, 42vw",
  discoverCard: "(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw",
  genericCard: "(max-width: 767px) 100vw, 50vw",
} as const;

export const IMAGE_REVEAL_DEFAULTS = {
  variant: "fade-scale",
  delay: 0,
  duration: 1.4,
  start: "top 88%",
  clipRevealVariant: "clip-reveal",
  toggleActions: "play none none none",
  kenBurnsScaleFrom: 1.06,
  scaleDefaultFrom: 0.96,
} as const;

export type ValueStatementProps = {
  bgImage?: ImageSource;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};

export interface SmoothScrollProviderProps {
  children: ReactNode;
}

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  once?: boolean;
  sequence?: boolean;
}

export type SafeImageSrc = string | StaticImageData;

export type SafeImageProps = Omit<ImageProps, "src"> & {
  src: SafeImageSrc;
  fallback?: SafeImageSrc;
};

export type CtaImageCard = {
  src: ImageSource;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
};

export type ImageRevealVariant =
  | "fade-scale"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "ken-burns"
  | "clip-reveal";

export interface ImageRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: ImageRevealVariant;
  delay?: number;
  duration?: number;
  start?: string;
  noClip?: boolean;
}

export type DiscoverCardProps = {
  item: DiscoverContentItem;
  lng?: string;
};
