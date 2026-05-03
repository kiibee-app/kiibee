import * as React from "react";
import { CURRENT_COLOR } from "@/utils/Constants";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
};

/** Audio purchase / library — document with note (file-style). */
export default function AudioFileIcon({
  width = 22,
  height = 22,
  color = CURRENT_COLOR,
  title,
  ...props
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 15 19"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M14.1258 4.95917L9.69833 0.531667C9.35917 0.1925 8.89167 0 8.40583 0H1.83333C0.825 0 0.00916688 0.825 0.00916688 1.83333L0 16.5C0 17.5083 0.815833 18.3333 1.82417 18.3333H12.8333C13.8417 18.3333 14.6667 17.5083 14.6667 16.5V6.26083C14.6667 5.775 14.4742 5.3075 14.1258 4.95917ZM10.0833 10.0833H8.25V13.3925C8.25 14.5658 7.33333 15.6017 6.16 15.5833C5.83968 15.5785 5.52485 15.4993 5.24026 15.3522C4.95568 15.2051 4.70908 14.994 4.51986 14.7355C4.33065 14.477 4.20396 14.1781 4.14976 13.8624C4.09556 13.5467 4.11532 13.2226 4.2075 12.9158C4.4 12.2558 4.94083 11.715 5.61 11.5317C6.25167 11.3575 6.85667 11.4858 7.33333 11.7975V9.16667C7.33333 8.6625 7.74583 8.25 8.25 8.25H10.0833C10.5875 8.25 11 8.6625 11 9.16667C11 9.67083 10.5875 10.0833 10.0833 10.0833ZM9.16667 6.41667C8.6625 6.41667 8.25 6.00417 8.25 5.5V1.375L13.2917 6.41667H9.16667Z"
        fill={color}
      />
    </svg>
  );
}
