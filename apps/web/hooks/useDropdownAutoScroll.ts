"use client";

import { RefObject, useEffect } from "react";
import {
  SCROLL_NEAREST_OPTIONS,
  DROPDOWN_AUTO_SCROLL_DELAY_MS,
} from "@/utils/Constants";

type UseDropdownAutoScrollParams = {
  open: boolean;
  ref: RefObject<HTMLElement | null>;
  delayMs?: number;
};

export function useDropdownAutoScroll({
  open,
  ref,
  delayMs = DROPDOWN_AUTO_SCROLL_DELAY_MS,
}: UseDropdownAutoScrollParams) {
  useEffect(() => {
    if (open && ref.current) {
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView(SCROLL_NEAREST_OPTIONS);
      }, delayMs);
      return () => clearTimeout(timer);
    }
  }, [open, ref, delayMs]);
}
