import { type HTMLAttributes, type ReactNode } from "react";

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
}
