"use client";

import { useState } from "react";
import { Film, Headphones, FileText } from "lucide-react";
import {
  CONTENT_FORMAT,
  normalizeContentFormat,
} from "../../utils/contentMedia";
import {
  ContentThumbFallback,
  ContentThumbImage,
} from "../features/viewers/Viewers.styles";
import {
  CardCoverBlur,
  CardCoverMain,
  CardCoverOverlay,
} from "../features/creators/Creators.styles";

export function renderMediaIcon(type?: string | null, size = 28) {
  const format = normalizeContentFormat(type);
  if (format === CONTENT_FORMAT.AUDIO) return <Headphones size={size} />;
  if (format === CONTENT_FORMAT.PDF || format === CONTENT_FORMAT.EPUB) {
    return <FileText size={size} />;
  }
  return <Film size={size} />;
}

type ContentThumbnailProps = {
  src?: string | null;
  alt: string;
  contentType?: string | null;
  size?: number;
  fallbackIcon?: React.ReactNode;
};

export function ContentThumbnail({
  src,
  alt,
  contentType,
  size = 28,
  fallbackIcon,
}: ContentThumbnailProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <ContentThumbFallback>
        {fallbackIcon ?? renderMediaIcon(contentType, size)}
      </ContentThumbFallback>
    );
  }

  return (
    <ContentThumbImage src={src} alt={alt} onError={() => setImgError(true)} />
  );
}

export function ContentCardCover({
  src,
  alt,
  contentType,
  size = 28,
  fallbackIcon,
}: ContentThumbnailProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <ContentThumbFallback>
        {fallbackIcon ?? renderMediaIcon(contentType, size)}
      </ContentThumbFallback>
    );
  }

  return (
    <>
      <CardCoverBlur src={src} alt="" onError={() => setImgError(true)} />
      <CardCoverOverlay />
      <CardCoverMain src={src} alt={alt} onError={() => setImgError(true)} />
    </>
  );
}
