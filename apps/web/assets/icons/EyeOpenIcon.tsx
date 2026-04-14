import { SVG_XMLNS } from "@/utils/Constants";
import COLORS from "@repo/ui/colors";
import * as React from "react";

type EyeOpenIconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export default function EyeOpenIcon({
  width = 14,
  height = 9,
  color = COLORS.primary.BLACK,
  className,
}: EyeOpenIconProps) {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 14 9"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.90667 8C9.57333 8 11.88 6.52 13.0667 4.33333C11.88 2.14667 9.57333 0.666667 6.90667 0.666667C4.24 0.666667 1.93333 2.14667 0.746667 4.33333C1.93333 6.52 4.24 8 6.90667 8ZM6.90667 0C9.94667 0 12.5733 1.76667 13.8133 4.33333C12.5733 6.9 9.94667 8.66667 6.90667 8.66667C3.86667 8.66667 1.24 6.9 0 4.33333C1.24 1.76667 3.86667 0 6.90667 0ZM6.90667 1.33333C8.57333 1.33333 9.90667 2.66667 9.90667 4.33333C9.90667 6 8.57333 7.33333 6.90667 7.33333C5.24 7.33333 3.90667 6 3.90667 4.33333C3.90667 2.66667 5.24 1.33333 6.90667 1.33333ZM6.90667 2C6.28783 2 5.69434 2.24583 5.25675 2.68342C4.81917 3.121 4.57333 3.71449 4.57333 4.33333C4.57333 4.95217 4.81917 5.54566 5.25675 5.98325C5.69434 6.42083 6.28783 6.66667 6.90667 6.66667C7.52551 6.66667 8.119 6.42083 8.55658 5.98325C8.99417 5.54566 9.24 4.95217 9.24 4.33333C9.24 3.71449 8.99417 3.121 8.55658 2.68342C8.119 2.24583 7.52551 2 6.90667 2Z"
        fill={color}
      />
    </svg>
  );
}
