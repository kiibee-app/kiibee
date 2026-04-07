import { SVG_XMLNS } from "@/utils/Constants";
import { Direction, Directions } from "@/utils/ui";
import React from "react";
import COLORS from "../../../../packages/ui/src/colors";

type ArrowIconProps = {
  width?: number | string;
  height?: number | string;
  color?: string;
  direction?: Direction;
};

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  width = 12,
  height = 6,
  direction = Directions.LEFT,
}) => {
  const rotationMap: Record<Direction, string> = {
    [Directions.DOWN]: "0deg",
    [Directions.UP]: "180deg",
    [Directions.RIGHT]: "-90deg",
    [Directions.LEFT]: "90deg",
  };

  const rotation = rotationMap[direction] || "0deg";

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
        fill={COLORS.primary.BLACK}
      />
    </svg>
  );
};
