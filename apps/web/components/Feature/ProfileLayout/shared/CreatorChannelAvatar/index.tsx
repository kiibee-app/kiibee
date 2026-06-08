"use client";

import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  type CreatorChannelAvatarTextUse,
} from "@/utils/Constants";
import {
  isRemoteImageSource,
  REMOTE_COVER_IMAGE_STYLE,
  resolvePublicMediaUrl,
} from "@/utils/media";
import { AvatarImage, AvatarInitial, RemoteAvatarImage } from "./styles";

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
  const resolvedAvatarUrl = resolvePublicMediaUrl(avatarUrl);

  if (resolvedAvatarUrl) {
    if (isRemoteImageSource(resolvedAvatarUrl)) {
      return (
        <RemoteAvatarImage
          src={resolvedAvatarUrl}
          alt={alt}
          style={REMOTE_COVER_IMAGE_STYLE}
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
      />
    );
  }

  return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
}
