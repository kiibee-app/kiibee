import { SVG_XMLNS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import React from "react";

type SuccessArcIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

export default function SuccessArcIcon({
  width = 50,
  height = 50,
  color = COLORS.primary.GREEN_100,
}: SuccessArcIconProps) {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 50 50"
      fill="none"
    >
      <path
        d="M44.531 27.3446C42.9685 35.1571 37.0782 42.5122 28.8101 44.1569C20.5421 45.8016 12.1518 41.9556 8.00066 34.6184C3.8495 27.2814 4.87431 18.1088 10.5424 11.8688C16.2105 5.62868 25.781 3.90718 33.5935 7.03218"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.9688 24.2188L25.7812 32.0312L44.5312 11.7188"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
