import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";
import { COLORS } from "@repo/ui/colors";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function LinkedInIcon({
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
        d="M8.5 10H10.5V17H8.5V10ZM9.5 7C8.84 7 8.3 7.54 8.3 8.2C8.3 8.86 8.84 9.4 9.5 9.4C10.16 9.4 10.7 8.86 10.7 8.2C10.7 7.54 10.16 7 9.5 7ZM12 10H13.9V10.98C14.2 10.45 14.85 9.95 15.9 9.95C18 9.95 18.5 11.3 18.5 13.1V17H16.5V13.8C16.5 13.04 16.48 12.06 15.44 12.06C14.38 12.06 14.22 12.89 14.22 13.74V17H12.22V10H12Z"
        fill={COLORS.primary.WHITE}
      />
    </svg>
  );
}
