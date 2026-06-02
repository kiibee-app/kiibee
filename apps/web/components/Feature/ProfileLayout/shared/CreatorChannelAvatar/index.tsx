"use client";

import { useState } from "react";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  type CreatorChannelAvatarTextUse,
} from "@/utils/Constants";
import { AvatarImage, AvatarInitial } from "./styles";

type CreatorChannelAvatarProps = {
  avatarUrl: string | null;
  initial: string;
  alt: string;
  sizes: string;
  initialUse?: CreatorChannelAvatarTextUse;
};

export default function CreatorChannelAvatar({
  avatarUrl,
  initial,
  alt,
  sizes,
  initialUse = CREATOR_CHANNEL_AVATAR_TEXT.HERO,
}: CreatorChannelAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const displayInitial = initial.charAt(0).toUpperCase() || "?";
  const showImage = Boolean(avatarUrl) && failedUrl !== avatarUrl;

  if (showImage && avatarUrl) {
    return (
      <AvatarImage
        src={avatarUrl}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized
        onError={() => setFailedUrl(avatarUrl)}
      />
    );
  }

  return <AvatarInitial $use={initialUse}>{displayInitial}</AvatarInitial>;
}
