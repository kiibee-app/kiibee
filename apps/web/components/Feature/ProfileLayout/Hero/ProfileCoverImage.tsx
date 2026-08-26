"use client";

import { useState } from "react";
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

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageLoaded(false);
  }

  return (
    <>
      {(!src || !imageLoaded) && <CoverSkeleton />}
      {src ? (
        <CoverImage
          {...props}
          src={src}
          alt={alt}
          $isLoaded={imageLoaded}
          onLoad={() => setImageLoaded(true)}
        />
      ) : null}
    </>
  );
}
