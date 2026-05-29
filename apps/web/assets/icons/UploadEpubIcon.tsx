import * as React from "react";
import { CURRENT_COLOR, SVG_XMLNS } from "@/utils/Constants";
import type { IconProps } from "./types";
import COLORS from "@repo/ui/colors";

export default function UploadEpubIcon({
  width = 64,
  height = 64,
  color = CURRENT_COLOR,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill={color}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      <path
        d="M14.6786 6C13.1725 6 11.7282 6.59828 10.6632 7.66322C9.59828 8.72816 9 10.1725 9 11.6786V53.3214C9 54.8275 9.59828 56.2718 10.6632 57.3368C11.7282 58.4017 13.1725 59 14.6786 59H48.75C50.256 59 51.7004 58.4017 52.7653 57.3368C53.8303 56.2718 54.4286 54.8275 54.4286 53.3214V24.9286C54.429 24.6798 54.3804 24.4334 54.2856 24.2035C54.1907 23.9735 54.0515 23.7645 53.8758 23.5884L36.8401 6.55272C36.664 6.37705 36.455 6.23782 36.2251 6.14298C35.9951 6.04814 35.7487 5.99956 35.5 6H14.6786Z"
        fill={COLORS.primary.BLUE}
        fillOpacity={0.5}
      />
      <path
        d="M54.4286 24.9286C54.429 24.6798 54.3804 24.4334 54.2856 24.2035C54.1908 23.9735 54.0515 23.7645 53.8759 23.5884L36.8401 6.55272C36.664 6.37705 36.455 6.23782 36.2251 6.14298C35.9951 6.04814 35.7487 5.99956 35.5 6V23.0357C35.5 23.5377 35.6994 24.0192 36.0544 24.3742C36.4094 24.7291 36.8908 24.9286 37.3929 24.9286H54.4286Z"
        fill={COLORS.primary.BLUE}
      />
    </svg>
  );
}
