"use client";

import { RefObject, useEffect } from "react";

type ClickOutsideRef = RefObject<HTMLElement | null>;

type UseClickOutsideParams = {
  ref?: ClickOutsideRef;
  refs?: ClickOutsideRef[];
  handler: (event: MouseEvent) => void;
  enabled?: boolean;
  eventType?: "mousedown" | "click";
};

export function useClickOutside({
  ref,
  refs,
  handler,
  enabled = true,
  eventType = "mousedown",
}: UseClickOutsideParams) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const targetRefs = refs ?? (ref ? [ref] : []);

    if (targetRefs.length === 0) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const isInside = targetRefs.some((targetRef) =>
        targetRef.current?.contains(target),
      );

      if (!isInside) {
        handler(event);
      }
    };

    document.addEventListener(eventType, handleClickOutside);

    return () => {
      document.removeEventListener(eventType, handleClickOutside);
    };
  }, [enabled, eventType, handler, ref, refs]);
}
