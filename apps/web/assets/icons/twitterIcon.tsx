import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";
import { COLORS } from "../../../../packages/ui/src/colors";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const TwitterIcon: React.FC<IconProps> = ({
  width = 25,
  height = 25,
  color = COLORS.secondary.MEDIUM_GREEN,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns={SVG_XMLNS}
    >
      {/* background */}
      <circle cx="12.5" cy="12.5" r="12.5" fill={color} />

      {/* smaller twitter icon */}
      <path
        d="M19.633 9.196c.013.176.013.353.013.53 0 5.42-4.124 11.67-11.67 11.67-2.323 0-4.484-.68-6.305-1.86.33.038.66.05 1.003.05a8.25 8.25 0 0 0 5.11-1.76 4.13 4.13 0 0 1-3.85-2.86c.26.04.52.07.79.07.38 0 .75-.05 1.1-.14a4.12 4.12 0 0 1-3.3-4.04v-.05c.55.31 1.18.5 1.84.52a4.12 4.12 0 0 1-1.81-3.43c0-.76.2-1.47.55-2.08a11.7 11.7 0 0 0 8.49 4.31 4.6 4.6 0 0 1-.1-.94 4.12 4.12 0 0 1 7.12-2.82 8.1 8.1 0 0 0 2.61-1"
        fill="white"
        transform="translate(12.5 12.5) scale(0.6) translate(-12.5 -12.5)"
      />
    </svg>
  );
};
