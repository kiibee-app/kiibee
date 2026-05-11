import * as React from "react";
import { CURRENT_COLOR, SVG_XMLNS } from "@/utils/Constants";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
};

export default function PlayCircleIcon({
  width = 19,
  height = 19,
  color = CURRENT_COLOR,
  title,
  ...props
}: Props) {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.16667 18.3333C14.2294 18.3333 18.3333 14.2294 18.3333 9.16667C18.3333 4.10392 14.2294 0 9.16667 0C4.10392 0 0 4.10392 0 9.16667C0 14.2294 4.10392 18.3333 9.16667 18.3333ZM7.9695 12.6922L12.2962 10.1374C13.0121 9.71392 13.0121 8.61942 12.2962 8.19592L7.9695 5.64117C7.27283 5.2305 6.41667 5.76583 6.41667 6.61283V11.7214C6.41667 12.5675 7.27283 13.1028 7.9695 12.6922Z"
        fill={color}
      />
    </svg>
  );
}
