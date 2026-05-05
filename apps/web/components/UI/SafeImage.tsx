"use client";

import NextImage, { type ImageProps, type StaticImageData } from "next/image";
import { useSafeImage } from "@/hooks/useSafeImage";
import { useTranslation } from "react-i18next";
import { IMG } from "@/utils/common";

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

export default function SafeImage(props: SafeImageProps) {
  const { src } = props;
  const imageKey = typeof src === "string" ? src : src.src;

  return <SafeImageInner key={imageKey} {...props} />;
}

function SafeImageInner({
  src,
  fallback = FALLBACKS.default,
  onError,
  onLoad,
  className,
  style,
  alt,
  ...rest
}: SafeImageProps) {
  const { t } = useTranslation();
  const { imgSrc, isError, handleError, handleLoad } = useSafeImage({
    src,
    fallback,
  });

  if (isError) {
    return (
      <span
        role={IMG}
        aria-label={alt ? t("image.failedAlt", { alt }) : t("image.failed")}
        className={className}
        style={style}
      />
    );
  }

  return (
    <NextImage
      {...rest}
      alt={alt}
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
