"use client";

import { RefObject, useEffect } from "react";
import { CLICK, MOUSE_DOWN } from "@/utils/common";

type ClickOutsideRef = RefObject<HTMLElement | null>;

type UseClickOutsideParams = {
  ref?: ClickOutsideRef;
  refs?: ClickOutsideRef[];
  handler: (event: MouseEvent) => void;
  enabled?: boolean;
  eventType?: typeof MOUSE_DOWN | typeof CLICK;
};

export function useClickOutside({
  ref,
  refs,
  handler,
  enabled = true,
  eventType = MOUSE_DOWN,
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
