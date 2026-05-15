import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";
import { COLORS } from "@repo/ui/colors";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function InstagramIcon({
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
      <path
        d="M12.5 0 A12.5 12.5 0 1 1 12.5 25 A12.5 12.5 0 1 1 12.5 0Z"
        fill={color}
      />

      <path
        d="M9.8 6.8 H15.2 C17.2 6.8 18.2 7.8 18.2 9.8 V15.2 C18.2 17.2 17.2 18.2 15.2 18.2 H9.8 C7.8 18.2 6.8 17.2 6.8 15.2 V9.8 C6.8 7.8 7.8 6.8 9.8 6.8Z"
        stroke={COLORS.primary.WHITE}
        strokeWidth="1.8"
      />

      <path
        d="M12.5 10 A2.5 2.5 0 1 1 12.5 15 A2.5 2.5 0 1 1 12.5 10Z"
        fill={COLORS.primary.WHITE}
      />

      <circle cx="15.5" cy="9.5" r="1" fill={COLORS.primary.WHITE} />
    </svg>
  );
}
