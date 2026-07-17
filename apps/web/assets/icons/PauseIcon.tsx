import * as React from "react";
import { CURRENT_COLOR } from "@/utils/Constants";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number | string;
  title?: string;
  bg?: string;
  fg?: string;
};

export default function PauseIcon({
  width = 24,
  height = 24,
  color = CURRENT_COLOR,
  title,
  bg,
  fg,
  ...props
}: Props) {
  const fgColor = fg ?? color;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {bg ? <circle cx="12" cy="12" r="12" fill={bg} /> : null}
      <rect x="6" y="5" width="4" height="14" rx="1" fill={fgColor} />
      <rect x="14" y="5" width="4" height="14" rx="1" fill={fgColor} />
    </svg>
  );
}
