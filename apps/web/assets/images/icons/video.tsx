import type { SVGProps } from "react";
import React from "react";
import { COLORS } from "../../../../../packages/ui/src/colors";
import { ICON_SVG_PROP_NAMES, SVG_XMLNS } from "@/utils/Constants";

type VideoIconBaseProps = Omit<
  SVGProps<SVGSVGElement>,
  (typeof ICON_SVG_PROP_NAMES)[number]
>;

export interface VideoIconProps extends VideoIconBaseProps {
  width?: number;
  height?: number;
  color?: string;
}

export const VideoIcon: React.FC<VideoIconProps> = ({
  width = 19,
  height = 17,
  color,
  className,
  ...rest
}) => {
  const iconColor = color ?? COLORS.primary.BLACK;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 19 17"
      fill="none"
      xmlns={SVG_XMLNS}
      className={className}
      aria-label="Video"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.83333 0C1.3471 0 0.880787 0.193154 0.536971 0.536971C0.193154 0.880787 0 1.3471 0 1.83333V14.6667C0 15.1529 0.193154 15.6192 0.536971 15.963C0.880787 16.3068 1.3471 16.5 1.83333 16.5H16.5C16.9862 16.5 17.4525 16.3068 17.7964 15.963C18.1402 15.6192 18.3333 15.1529 18.3333 14.6667V1.83333C18.3333 1.3471 18.1402 0.880787 17.7964 0.536971C17.4525 0.193154 16.9862 0 16.5 0H1.83333ZM6.07292 5.16083C6.09326 4.98558 6.15428 4.81751 6.25111 4.67003C6.34794 4.52255 6.4779 4.39974 6.63062 4.31141C6.78334 4.22307 6.95459 4.17165 7.13071 4.16125C7.30683 4.15085 7.48294 4.18175 7.645 4.2515C8.107 4.4495 9.08233 4.895 10.318 5.60817C11.1864 6.10448 12.0251 6.65114 12.8297 7.24533C12.9711 7.3506 13.086 7.48748 13.1652 7.64504C13.2443 7.80261 13.2856 7.9765 13.2856 8.15283C13.2856 8.32917 13.2443 8.50306 13.1652 8.66062C13.086 8.81819 12.9711 8.95507 12.8297 9.06033C12.025 9.6539 11.1864 10.1999 10.318 10.6957C9.45423 11.2002 8.56171 11.6538 7.645 12.0542C7.48296 12.1241 7.3068 12.1552 7.13061 12.1449C6.95442 12.1346 6.78308 12.0832 6.63031 11.9948C6.47753 11.9064 6.34755 11.7835 6.25077 11.6359C6.15398 11.4884 6.09308 11.3202 6.07292 11.1448C5.96293 10.1513 5.90907 9.15241 5.91158 8.15283C5.91158 6.73108 6.01425 5.66042 6.07292 5.16083Z"
        fill={iconColor}
      />
    </svg>
  );
};

export default VideoIcon;
