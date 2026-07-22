"use client";

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
  /** Channel logos are wide wordmarks — default `contain` keeps the full mark visible. */
  fit?: AvatarFit;
};

export default function CreatorChannelAvatar({
  avatarUrl,
  initial,
  alt,
  sizes,
  initialUse = CREATOR_CHANNEL_AVATAR_TEXT.HERO,
  fit = "contain",
}: CreatorChannelAvatarProps) {
  const resolvedAvatarUrl = resolvePublicMediaUrl(avatarUrl);

  if (resolvedAvatarUrl) {
    if (isRemoteImageSource(resolvedAvatarUrl)) {
      return (
        <RemoteAvatarImage
          src={resolvedAvatarUrl}
          alt={alt}
          $fit={fit}
          style={
            fit === "contain"
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
        $fit={fit}
      />
    );
  }

  return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
}
