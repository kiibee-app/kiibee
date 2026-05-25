"use client";

import NextImage from "next/image";
import { useSafeImage } from "@/hooks/useSafeImage";
import { useTranslation } from "react-i18next";
import { IMG } from "@/utils/common";
import {
  SAFE_IMAGE_DECODING,
  SAFE_IMAGE_FALLBACKS,
} from "@/utils/landingUtils";
import { type SafeImageProps } from "@/utils/landingShared";

export const FALLBACKS = {
  ...SAFE_IMAGE_FALLBACKS,
} as const;

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
      decoding={rest.decoding ?? SAFE_IMAGE_DECODING}
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
