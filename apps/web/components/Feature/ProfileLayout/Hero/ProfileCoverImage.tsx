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
  unoptimized: propUnoptimized,
  ...props
}: ProfileCoverImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [directSource, setDirectSource] = useState<string | null>(null);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageLoaded(false);
    setDirectSource(null);
  }

  const markLoaded = () => setImageLoaded(true);

  const handleImageRef = (element: HTMLImageElement | null) => {
    if (!element) return;
    if (element.complete && !imageLoaded) {
      markLoaded();
    }
  };

  const handleImageError = () => {
    if (src && !directSource) {
      setDirectSource(src);
      return;
    }
    markLoaded();
  };

  const isUnoptimized = propUnoptimized || directSource === src;

  return (
    <>
      {(!src || !imageLoaded) && <CoverSkeleton />}
      {src ? (
        <CoverImage
          ref={handleImageRef}
          {...props}
          src={src}
          alt={alt}
          unoptimized={isUnoptimized}
          $isLoaded={imageLoaded}
          onLoad={markLoaded}
          onError={handleImageError}
        />
      ) : null}
    </>
  );
}
