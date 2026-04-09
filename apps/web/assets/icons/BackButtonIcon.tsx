import COLORS from "@repo/ui/colors";
import * as React from "react";

type BackButtonIconProps = {
  size?: number;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
};

export default function BackButtonIcon({
  size = 40,
  backgroundColor = COLORS.neutral.GRAY_200,
  strokeColor = COLORS.primary.BLACK,
  strokeWidth = 2,
  className,
}: BackButtonIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill={backgroundColor} />
      <path
        d="M19 26L13 20L19 14M13.8333 20H26"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
