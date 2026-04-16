import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
};

export default function PlayCircleIcon({
  width = 22,
  height = 22,
  color = "currentColor",
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
        d="M11 20.1666C16.0628 20.1666 20.1667 16.0627 20.1667 10.9999C20.1667 5.93717 16.0628 1.83325 11 1.83325C5.93725 1.83325 1.83334 5.93717 1.83334 10.9999C1.83334 16.0627 5.93725 20.1666 11 20.1666ZM9.80284 14.5254L14.1295 11.9707C14.8454 11.5472 14.8454 10.4527 14.1295 10.0292L9.80284 7.47442C9.10617 7.06375 8.25 7.59909 8.25 8.44608V13.5547C8.25 14.4008 9.10617 14.9361 9.80284 14.5254Z"
        fill={color}
      />
    </svg>
  );
}
