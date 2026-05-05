"use client";

import { SVG_XMLNS } from "@/utils/Constants";
import { Direction, Directions } from "@/utils/ui";
import { useDirection } from "@/hooks/ui/useDirection";
import COLORS from "@repo/ui/colors";
import React from "react";

type ArrowIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
  direction?: Direction;
};

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  width = 12,
  height = 6,
  color,
  direction = Directions.LEFT,
}) => {
  const rotation = useDirection(direction);

  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 12 6"
      fill="none"
      style={{
        transform: `rotate(${rotation})`,
        transition: "transform 0.25s ease",
      }}
    >
      <path
        d="M0 0.660378L6 6L12 0.660378L11.2474 0L6 4.66981L0.75265 0L0 0.660378Z"
        fill={color ?? COLORS.primary.BLACK}
      />
    </svg>
  );
};
