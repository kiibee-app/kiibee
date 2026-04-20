import type { SVGProps } from "react";

export type IconProps = Omit<
  SVGProps<SVGSVGElement>,
  "width" | "height" | "color"
> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
};
