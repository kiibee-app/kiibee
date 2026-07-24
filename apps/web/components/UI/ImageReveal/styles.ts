import { type CSSProperties } from "react";
import { IMAGE_REVEAL_DEFAULTS } from "@/utils/landingShared";

export function getImageRevealContainerStyle(
  noClip: boolean,
  variant: string,
  style?: CSSProperties,
): CSSProperties {
  return {
    // Next/Image `fill` requires a positioned parent (not static).
    position: "relative",
    visibility:
      variant === IMAGE_REVEAL_DEFAULTS.clipRevealVariant
        ? "visible"
        : "hidden",
    opacity: variant === IMAGE_REVEAL_DEFAULTS.clipRevealVariant ? 1 : 0,
    overflow: noClip ? undefined : "hidden",
    ...style,
  };
}
