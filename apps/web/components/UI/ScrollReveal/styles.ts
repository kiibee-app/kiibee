import { type CSSProperties } from "react";
import { SCROLL_REVEAL } from "@/utils/landingUtils";

export function getScrollRevealContainerStyle(
  style?: CSSProperties,
  withBlur = true,
): CSSProperties {
  return {
    visibility: SCROLL_REVEAL.initialVisibility,
    opacity: SCROLL_REVEAL.initialOpacity,
    willChange: withBlur
      ? SCROLL_REVEAL.willChange
      : SCROLL_REVEAL.willChangeWithoutBlur,
    ...style,
  };
}
