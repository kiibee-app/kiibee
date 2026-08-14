import type { Ref } from "react";
import { ImageSource } from "@/utils/Constants";

export type CtaSectionProps = {
  bgImage?: ImageSource;
  bgVideo?: string;
  title: string;
  subtitle?: string;
  subtitleLines?: string[];
  ctaText?: string;
  ctaHref?: string;
  sectionRef?: Ref<HTMLElement>;
};
