import { type CSSProperties } from "react";
import { IMAGE_REVEAL_DEFAULTS } from "@/utils/imageReveal";

export function getImageRevealContainerStyle(
  noClip: boolean,
  variant: string,
  style?: CSSProperties,
): CSSProperties {
  return {
    visibility:
      variant === IMAGE_REVEAL_DEFAULTS.clipRevealVariant
        ? "visible"
        : "hidden",
    opacity: variant === IMAGE_REVEAL_DEFAULTS.clipRevealVariant ? 1 : 0,
    willChange: IMAGE_REVEAL_DEFAULTS.willChange,
    overflow: noClip ? undefined : "hidden",
    ...style,
  };
}
