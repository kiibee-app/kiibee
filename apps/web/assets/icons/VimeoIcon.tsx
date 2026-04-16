import * as React from "react";
import { CURRENT_COLOR } from "@/utils/Constants";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  strokeWidth?: number | string;
  title?: string;
};

export default function VimeoIcon({
  width = 22,
  height = 22,
  color = CURRENT_COLOR,
  strokeWidth = 1.5,
  title,
  ...props
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M19.5671 4.26607C17.4506 2.58582 14.1726 5.17357 13.3796 6.53299C14.5722 6.81257 16.9583 6.91432 14.6666 11.0247C13.75 12.5482 11.6416 14.497 10.5416 10.1117C9.16665 4.62999 9.16665 0.519652 1.83331 6.91432C2.26965 7.78332 3.45215 7.87224 4.3459 7.48907C5.15898 7.14074 5.99773 7.27915 6.41665 8.74215C7.33331 11.9386 7.79165 18.3213 11 18.3213C14.3311 18.7742 22.4226 6.53299 19.5671 4.26607Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
