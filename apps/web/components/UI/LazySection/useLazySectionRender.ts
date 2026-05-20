"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type BrowserWindow, type ScheduledIds } from "@/types/lazySection";
import {
  BROWSER_API,
  INTERSECTION_OBSERVER_FALLBACK_DELAY_MS,
} from "@/utils/ui";

function cancelIfDefined<T>(
  id: T | undefined,
  cancel: (value: T) => void,
): void {
  if (id !== undefined) cancel(id);
}

function scheduleIdleRender(
  browserWindow: BrowserWindow,
  onRender: () => void,
): ScheduledIds {
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
  ids: ScheduledIds,
): void {
  cancelIfDefined(ids.timeoutId, clearTimeout);
  cancelIfDefined(ids.rafId, cancelAnimationFrame);
  cancelIfDefined(ids.idleId, (idleId) =>
    browserWindow.cancelIdleCallback?.(idleId),
  );
}

function hasIntersectionObserver(): boolean {
  return BROWSER_API.INTERSECTION_OBSERVER in window;
}

export function useLazySectionRender(rootMargin: string) {
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
      let scheduledIds: ScheduledIds = {};

      const fallbackId = setTimeout(() => {
        scheduledIds = scheduleIdleRender(browserWindow, triggerRender);
      }, INTERSECTION_OBSERVER_FALLBACK_DELAY_MS);

      return () => {
        clearTimeout(fallbackId);
        cleanupScheduled(browserWindow, scheduledIds);
      };
    }

    let scheduledIds: ScheduledIds = {};

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

  return { sectionRef, shouldRender };
}
