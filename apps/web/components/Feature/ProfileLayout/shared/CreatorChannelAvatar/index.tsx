"use client";

import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  type CreatorChannelAvatarTextUse,
} from "@/utils/Constants";
import { isRemoteImageSource, resolvePublicMediaUrl } from "@/utils/media";
import COLORS from "@repo/ui/colors";
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
  fit?: AvatarFit;
};

export default function CreatorChannelAvatar({
  avatarUrl,
  initial,
  alt,
  sizes,
  initialUse = CREATOR_CHANNEL_AVATAR_TEXT.HERO,
  fit = "cover",
}: CreatorChannelAvatarProps) {
  const resolvedAvatarUrl = resolvePublicMediaUrl(avatarUrl);

  if (resolvedAvatarUrl) {
    if (isRemoteImageSource(resolvedAvatarUrl)) {
      return (
        <RemoteAvatarImage
          src={resolvedAvatarUrl}
          alt={alt}
          $fit={fit}
          style={{
            objectFit: fit,
            objectPosition: "center",
            backgroundColor: "transparent",
          }}
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
        style={{
          objectFit: fit,
          objectPosition: "center",
          backgroundColor: "transparent",
        }}
      />
    );
  }

  return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
}
