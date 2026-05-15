import * as React from "react";
import { CURRENT_COLOR, SVG_XMLNS } from "@/utils/Constants";
import type { IconProps } from "./types";

export default function UploadAudioIcon({
  width = 64,
  height = 64,
  color = CURRENT_COLOR,
  title,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns={SVG_XMLNS}
      width={width}
      height={height}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M32 4C26.4621 4 21.0486 5.64217 16.444 8.71885C11.8395 11.7955 8.25064 16.1685 6.13139 21.2849C4.01213 26.4012 3.45764 32.0311 4.53802 37.4625C5.61841 42.894 8.28515 47.8831 12.201 51.799C16.1169 55.7149 21.106 58.3816 26.5375 59.462C31.969 60.5424 37.5988 59.9879 42.7151 57.8686C47.8315 55.7494 52.2045 52.1605 55.2812 47.556C58.3578 42.9514 60 37.5379 60 32C60 24.5739 57.05 17.452 51.799 12.201C46.548 6.94999 39.4261 4 32 4ZM44 24H36V40C36 41.5822 35.5308 43.129 34.6518 44.4446C33.7727 45.7602 32.5233 46.7855 31.0615 47.391C29.5997 47.9965 27.9911 48.155 26.4393 47.8463C24.8874 47.5376 23.462 46.7757 22.3432 45.6569C21.2243 44.538 20.4624 43.1126 20.1537 41.5607C19.845 40.0089 20.0035 38.4003 20.609 36.9385C21.2145 35.4767 22.2399 34.2273 23.5555 33.3482C24.871 32.4692 26.4178 32 28 32C29.4083 32.0078 30.7891 32.3909 32 33.11V16H44V24Z"
        fill={color}
      />
    </svg>
  );
}
