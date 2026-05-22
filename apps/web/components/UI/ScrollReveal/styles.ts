import { type CSSProperties } from "react";
import { SCROLL_REVEAL } from "@/utils/scrollReveal";

export function getScrollRevealContainerStyle(
  style?: CSSProperties,
): CSSProperties {
  return {
    visibility: SCROLL_REVEAL.initialVisibility,
    opacity: SCROLL_REVEAL.initialOpacity,
    willChange: SCROLL_REVEAL.willChange,
    ...style,
  };
}
