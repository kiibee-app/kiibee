import * as React from "react";
import { CURRENT_COLOR, SVG_XMLNS } from "@/utils/Constants";
import type { IconProps } from "./types";

export default function UploadEpubIcon({
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
      viewBox="0 0 46 53"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M5.67857 3.01908e-06C4.17252 3.01908e-06 2.72815 0.598279 1.66321 1.66322C0.598276 2.72816 0 4.17252 0 5.67857V47.3214C0 48.8275 0.598276 50.2718 1.66321 51.3368C2.72815 52.4017 4.17252 53 5.67857 53H39.75C41.256 53 42.7004 52.4017 43.7653 51.3368C44.8303 50.2718 45.4286 48.8275 45.4286 47.3214V18.9286C45.429 18.6798 45.3804 18.4334 45.2856 18.2035C45.1907 17.9735 45.0515 17.7645 44.8758 17.5884L27.8401 0.552717C27.664 0.377053 27.455 0.237822 27.2251 0.142983C26.9951 0.0481448 26.7487 -0.000441224 26.5 3.01908e-06H5.67857Z"
        fill={color}
      />
    </svg>
  );
}
