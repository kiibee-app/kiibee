import * as React from "react";
import { CURRENT_COLOR } from "@/utils/Constants";

type Props = React.SVGProps<SVGSVGElement> & {
  width?: number | string;
  height?: number | string;
  color?: string;
  title?: string;
};

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
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M17.7925 6.79242L13.365 2.36492C13.0258 2.02575 12.5583 1.83325 12.0725 1.83325H5.49999C4.49166 1.83325 3.67582 2.65825 3.67582 3.66659L3.66666 18.3333C3.66666 19.3416 4.48249 20.1666 5.49082 20.1666H16.5C17.5083 20.1666 18.3333 19.3416 18.3333 18.3333V8.09409C18.3333 7.60825 18.1408 7.14075 17.7925 6.79242ZM13.75 11.9166H11.9167V15.2258C11.9167 16.3991 11 17.4349 9.82666 17.4166C9.50633 17.4117 9.19151 17.3326 8.90692 17.1855C8.62233 17.0384 8.37574 16.8273 8.18652 16.5688C7.9973 16.3103 7.87061 16.0114 7.81641 15.6957C7.76222 15.3799 7.78198 15.0559 7.87416 14.7491C8.06666 14.0891 8.60749 13.5483 9.27666 13.3649C9.91832 13.1908 10.5233 13.3191 11 13.6308V10.9999C11 10.4958 11.4125 10.0833 11.9167 10.0833H13.75C14.2542 10.0833 14.6667 10.4958 14.6667 10.9999C14.6667 11.5041 14.2542 11.9166 13.75 11.9166ZM12.8333 8.24992C12.3292 8.24992 11.9167 7.83742 11.9167 7.33325V3.20825L16.9583 8.24992H12.8333Z"
        fill={color}
      />
    </svg>
  );
}
