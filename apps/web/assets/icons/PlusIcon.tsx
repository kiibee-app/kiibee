import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";
import type { IconProps } from "./types";

export const PlusIcon: React.FC<IconProps> = ({
  width = 16,
  height = 16,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <path d="M8 1V15V1ZM1 8H15H1Z" fill={color} />
      <path
        d="M8 1V15M1 8H15"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PlusIcon;
