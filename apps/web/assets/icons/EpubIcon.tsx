import { useId } from "react";
import { SVG_XMLNS } from "@/utils/Constants";
import type { IconProps } from "./types";

export default function EpubIcon({
  width = 22,
  height = 22,
  className,
  title,
  ...props
}: IconProps) {
  const patternId = useId();
  const imageId = useId();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns={SVG_XMLNS}
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      aria-hidden={title ? undefined : true}
      aria-label={title || "E-pub"}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <rect width="22" height="22" fill={`url(#${patternId})`} />
      <defs>
        <pattern
          id={patternId}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref={`#${imageId}`} transform="scale(0.0111111)" />
        </pattern>
        <image
          id={imageId}
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADm0lEQVR4nO2dW4hNURjH/67HjKnhRW5ljkhKTVFeKCVMSl4oEuVFZJgyFCU1hXgRTUTIG680Lq8uD3jRiJd5m0JSak5jTEJ8Wlq7Vqu9z6299rfOWt+v/k2z197nrO83Z9Ze+5y1ZwBBEARBEARBEISI2ALgFoARAN8BUAtG9fs1gD4AJXjGCgAvPJBEOectgMXwhA0AKh5IIYeySz68kkOWTDpHuUWHOFxQSl5xSt7sgQAqKN84Rd/2QAAVGDZGPCieYhA94UHxFINo7sJJRIcZNrgLJxEdZtjgLpxEdJhhg7twEtFhhg3uwklEhxk2uAsnER1m2GimQ6tS9t8EYAmAOXqfNgBdAHYAeJLxHAPGY8622vYabd0ZzzVXt0/XnwluBzAUuuha9OUouhYHAPyNQXQHgDKAKdb2uw5ErwawP+VT7vutKPoUgDEj4zX2P6e3DQPoNLavcyD6kt721RhKFPtaUfRAgyeZRLRKr7G9ZP1K5yma9Bid0BOb6CtW20+HotXalITDsYk+aWzvdDh0PAcwVW+bBuBNK4peCGCNkYt1iq5YJ6keB6K79ePO1N+rrzfrrKtQmulQb439VeHH9czDZKiA6d2hGgszgxKdxsGUY/IQ3a4vjkzUD3g0hOndZAMFqKHjRsZz5CH6sp7JPNLz94T1MZwMd+sLBrWC80+VY84bx7RZbXuMtrU1RKf94LIWBwU766AqGbSO+2G0bbUWxtcj+qHV9lhE43+UCBNzSra0yvskWaKvWm3PWn2MHksZEpoRrR5nhnHcNgCfAFyzHu9BHaJH9Tt6CR0Nnku8EJ3GhxxEq+xCdcrW1SSltKsxfFadfYhW9Mcq95coeU8b7Ju6OjxR5SQcrWgC8EXPzbv0UDIPwE4A7zL236jfHi3rq9aV+sOA03UsQ2aDIgsb3IWTiA4zbHAXTiI6zLDBXTiJ6DDDBnfhJKLDDBvchZOIDjNscBdOIjrMsMFdOInoMMMGRZRxPs38xVMsf+qHIsoREQ3nGTYWQopouJO8iFNyyKInALzUwwXrKzkhq6NqedYxAPO5OxgKWaKVZKEA0fJKzpnPIroYLmSI7i/o+aOhXf/NzrSToZK9gLuDIXHHg+kYOUxFr52273UpnOUAfnkghBxH3UvDzhkPRJDjTBo3fbKhOnDPAxkUuujk1t6zAH57IIUc5Do8Y5m+x/p9C/97ELLulRn04WQoCIIgCIIgCIIAF/wDKc2B7ZfE4/sAAAAASUVORK5CYII="
        />
      </defs>
    </svg>
  );
}
