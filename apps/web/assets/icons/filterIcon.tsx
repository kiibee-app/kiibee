import { SVG_XMLNS } from "@/utils/Constants";
import React from "react";
import COLORS from "../../../../packages/ui/src/colors";

type IconProps = {
  width?: number | string;
  height?: number | string;
};

export const FilterIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
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
        d="M4.5 7H19.5M7 12H17M10 17H14"
        stroke={COLORS.primary.BLACK}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
