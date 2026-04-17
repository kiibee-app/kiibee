"use client";

import NextImage, { type ImageProps, type StaticImageData } from "next/image";
import { useSafeImage } from "@/hooks/useSafeImage";

type SafeImageSrc = string | StaticImageData;

export const FALLBACKS = {
  default: "/images/fallbacks/default.svg",
  avatar: "/images/fallbacks/avatar.svg",
  thumbnail: "/images/fallbacks/thumbnail.svg",
  hero: "/images/fallbacks/hero.svg",
} as const;

export type SafeImageProps = Omit<ImageProps, "src"> & {
  src: SafeImageSrc;
  fallback?: SafeImageSrc;
};

export default function SafeImage({
  src,
  fallback = FALLBACKS.default,
  onError,
  onLoad,
  className,
  style,
  ...rest
}: SafeImageProps) {
  const imageKey = typeof src === "string" ? src : src.src;

  return (
    <SafeImageInner
      key={imageKey}
      src={src}
      fallback={fallback}
      onError={onError}
      onLoad={onLoad}
      className={className}
      style={style}
      {...rest}
    />
  );
}

function SafeImageInner({
  src,
  fallback = FALLBACKS.default,
  onError,
  onLoad,
  className,
  style,
  ...rest
}: SafeImageProps) {
  const { imgSrc, isError, handleError, handleLoad } = useSafeImage({
    src,
    fallback,
  });

  if (isError) {
    return (
      <span
        role="img"
        aria-label={`Failed to load image: ${rest.alt}`}
        className={className}
        style={style}
      />
    );
  }

  return (
    <NextImage
      {...rest}
      src={imgSrc}
      className={className}
      style={style}
      onError={(event) => {
        handleError();
        onError?.(event);
      }}
      onLoad={(event) => {
        handleLoad();
        onLoad?.(event);
      }}
    />
  );
}
