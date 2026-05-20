"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { t } from "i18next";
import GenericLoader from "@/components/UI/GenericLoader";
import {
  BROWSER_API,
  INTERSECTION_OBSERVER_FALLBACK_DELAY_MS,
  LOADER_SIZE,
  LOADER_VARIANT,
} from "@/utils/ui";
import { LazySectionRoot } from "./styles";

type LazySectionProps = {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
};

type BrowserWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

function scheduleIdleRender(
  browserWindow: BrowserWindow,
  onRender: () => void,
): {
  rafId?: number;
  timeoutId?: ReturnType<typeof setTimeout>;
  idleId?: number;
} {
  if (browserWindow.requestIdleCallback) {
    const idleId = browserWindow.requestIdleCallback(onRender, {
      timeout: 200,
    });
    return { idleId };
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const rafId = window.requestAnimationFrame(() => {
    timeoutId = setTimeout(onRender, 0);
  });

  return { rafId, timeoutId };
}

function cleanupScheduled(
  browserWindow: BrowserWindow,
  ids: {
    rafId?: number;
    timeoutId?: ReturnType<typeof setTimeout>;
    idleId?: number;
  },
): void {
  if (ids.timeoutId !== undefined) clearTimeout(ids.timeoutId);
  if (ids.rafId !== undefined) cancelAnimationFrame(ids.rafId);
  if (ids.idleId !== undefined) browserWindow.cancelIdleCallback?.(ids.idleId);
}

function hasIntersectionObserver(): boolean {
  return BROWSER_API.INTERSECTION_OBSERVER in window;
}

export default function LazySection({
  children,
  minHeight = 320,
  rootMargin = "120px 0px",
}: LazySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const triggerRender = useCallback(() => {
    startTransition(() => setShouldRender(true));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || shouldRender) return;

    const browserWindow = window as BrowserWindow;

    if (!hasIntersectionObserver()) {
      let scheduledIds: ReturnType<typeof scheduleIdleRender> = {};

      const fallbackId = setTimeout(() => {
        scheduledIds = scheduleIdleRender(browserWindow, triggerRender);
      }, INTERSECTION_OBSERVER_FALLBACK_DELAY_MS);

      return () => {
        clearTimeout(fallbackId);
        cleanupScheduled(browserWindow, scheduledIds);
      };
    }

    let scheduledIds: ReturnType<typeof scheduleIdleRender> = {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        scheduledIds = scheduleIdleRender(browserWindow, triggerRender);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      cleanupScheduled(browserWindow, scheduledIds);
    };
  }, [rootMargin, shouldRender, triggerRender]);

  return (
    <LazySectionRoot ref={sectionRef} $minHeight={minHeight}>
      {shouldRender ? (
        children
      ) : (
        <GenericLoader
          variant={LOADER_VARIANT.INLINE}
          size={LOADER_SIZE.SM}
          label={t("common.loading")}
        />
      )}
    </LazySectionRoot>
  );
}
