import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";
import { COLORS } from "@repo/ui/colors";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function FacebookIcon({
  width = 25,
  height = 25,
  color = COLORS.secondary.MEDIUM_GREEN,
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns={SVG_XMLNS}
    >
      <circle cx="12.5" cy="12.5" r="12.5" fill={color} />
      <path
        d="M12.3231 13.7924H13.867L14.4846 11.082H12.3231V9.7268C12.3231 9.02887 12.3231 8.3716 13.5583 8.3716H14.4846V6.09486C13.5231 6.06573 12.7202 6 12.7202 6C11.0435 6 9.85275 7.12278 9.85275 9.18472V11.082H8V13.7924H9.85275V19.552H12.3231V13.7924Z"
        fill={COLORS.primary.WHITE}
      />
    </svg>
  );
}
