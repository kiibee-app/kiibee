import { type HTMLAttributes, type ReactNode } from "react";

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
