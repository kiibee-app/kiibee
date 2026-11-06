"use client";

import { useState } from "react";
import { canOptimizeRemoteImage } from "@/utils/imageDelivery";
import type { ProfileCoverImageProps } from "@/types/metadataType";
import {
  CoverImage,
  CoverSkeleton,
} from "@/components/Feature/ProfileLayout/Hero/styles";

export default function ProfileCoverImage({
  src,
  alt,
  ...props
}: ProfileCoverImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [directSrc, setDirectSrc] = useState<string | null>(null);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageLoaded(false);
    setDirectSrc(null);
  }

  return (
    <>
      {(!src || !imageLoaded) && <CoverSkeleton />}
      {src ? (
        <CoverImage
          {...props}
          ref={(image) => {
            if (!imageLoaded && image?.complete && image.naturalWidth > 0) {
              setImageLoaded(true);
            }
          }}
          src={src}
          alt={alt}
          unoptimized={
            props.unoptimized ||
            (src.startsWith("http") && !canOptimizeRemoteImage(src)) ||
            directSrc === src
          }
          $isLoaded={imageLoaded}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (canOptimizeRemoteImage(src) && directSrc !== src) {
              setDirectSrc(src);
            } else {
              setImageLoaded(true);
            }
          }}
        />
      ) : null}
    </>
  );
}
