import * as React from "react";
import { CURRENT_COLOR } from "@/utils/Constants";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
};

export default function CalendarIcon({
  width = 20,
  height = 20,
  color = CURRENT_COLOR,
  title,
  ...props
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      <g clipPath="url(#clip0)">
        <path
          d="M15 3.33594H5C3.15905 3.33594 1.66667 4.82832 1.66667 6.66927V15.0026C1.66667 16.8436 3.15905 18.3359 5 18.3359H15C16.841 18.3359 18.3333 16.8436 18.3333 15.0026V6.66927C18.3333 4.82832 16.841 3.33594 15 3.33594Z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66667 1.66797V5.0013M13.3333 1.66797V5.0013M1.66667 8.33464H18.3333"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <defs>
        <clipPath id="clip0">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
