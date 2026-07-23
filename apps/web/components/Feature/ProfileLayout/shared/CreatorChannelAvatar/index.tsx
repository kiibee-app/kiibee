"use client";

import { useEffect, useState } from "react";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  type CreatorChannelAvatarTextUse,
} from "@/utils/Constants";
import {
  isRemoteImageSource,
  REMOTE_CONTAIN_IMAGE_STYLE,
  REMOTE_COVER_IMAGE_STYLE,
  resolvePublicMediaUrl,
} from "@/utils/media";
import {
  AvatarImage,
  AvatarInitial,
  RemoteAvatarImage,
  type AvatarFit,
} from "./styles";

type CreatorChannelAvatarProps = {
  avatarUrl: string | null;
  initial: string;
  alt: string;
  sizes: string;
  initialUse?: CreatorChannelAvatarTextUse;
  /** Channel logos are wide wordmarks — auto detects square (cover) vs non-square (contain) */
  fit?: AvatarFit;
};

export default function CreatorChannelAvatar({
  avatarUrl,
  initial,
  alt,
  sizes,
  initialUse = CREATOR_CHANNEL_AVATAR_TEXT.HERO,
  fit,
}: CreatorChannelAvatarProps) {
  const resolvedAvatarUrl = resolvePublicMediaUrl(avatarUrl);
  const [autoFit, setAutoFit] = useState<AvatarFit>("cover");

  useEffect(() => {
    if (!resolvedAvatarUrl) return;

    const img = new Image();
    img.src = resolvedAvatarUrl;
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const ar = img.naturalWidth / img.naturalHeight;
        setAutoFit(ar > 1.25 || ar < 0.8 ? "contain" : "cover");
      }
    };
  }, [resolvedAvatarUrl]);

  const effectiveFit = fit ?? autoFit;

  if (resolvedAvatarUrl) {
    if (isRemoteImageSource(resolvedAvatarUrl)) {
      return (
        <RemoteAvatarImage
          src={resolvedAvatarUrl}
          alt={alt}
          $fit={effectiveFit}
          style={
            effectiveFit === "contain"
              ? REMOTE_CONTAIN_IMAGE_STYLE
              : REMOTE_COVER_IMAGE_STYLE
          }
          loading="lazy"
          decoding="async"
        />
      );
    }

    return (
      <AvatarImage
        src={resolvedAvatarUrl}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        $fit={effectiveFit}
      />
    );
  }

  return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
}
