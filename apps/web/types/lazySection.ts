import { type ReactNode } from "react";

export type LazySectionProps = {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
};

export type BrowserWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

export type ScheduledIds = {
  rafId?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
  idleId?: number;
};
