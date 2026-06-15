import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";

type IconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
};

const CheckIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "currentColor",
}) => {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 6L7 17L2 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 6L11 17L9 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;
