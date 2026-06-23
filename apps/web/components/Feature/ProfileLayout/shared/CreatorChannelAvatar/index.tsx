"use client";

import { useMemo, useState } from "react";
import {
  CREATOR_CHANNEL_AVATAR_TEXT,
  type CreatorChannelAvatarTextUse,
} from "@/utils/Constants";
import {
  REMOTE_COVER_IMAGE_STYLE,
  resolveCreatorMediaCandidates,
} from "@/utils/media";
import { AvatarInitial, RemoteAvatarImage } from "./styles";

type CreatorChannelAvatarProps = {
  avatarUrl?: string | null;
  fallbackImageUrl?: string | null;
  initial: string;
  alt: string;
  initialUse?: CreatorChannelAvatarTextUse;
};

export default function CreatorChannelAvatar({
  avatarUrl,
  fallbackImageUrl,
  initial,
  alt,
  initialUse = CREATOR_CHANNEL_AVATAR_TEXT.HERO,
}: CreatorChannelAvatarProps) {
  const candidates = useMemo(
    () => resolveCreatorMediaCandidates(avatarUrl, fallbackImageUrl),
    [avatarUrl, fallbackImageUrl],
  );
  const candidatesKey = candidates.join("\0");
  const [loadState, setLoadState] = useState({
    key: "",
    index: 0,
    failed: false,
  });
  const candidateIndex = loadState.key === candidatesKey ? loadState.index : 0;
  const hasFailed = loadState.key === candidatesKey ? loadState.failed : false;

  const src = candidates[candidateIndex];

  if (!src || hasFailed) {
    return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
  }

  return (
    <RemoteAvatarImage
      src={src}
      alt={alt}
      style={REMOTE_COVER_IMAGE_STYLE}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (candidateIndex < candidates.length - 1) {
          setLoadState({
            key: candidatesKey,
            index: candidateIndex + 1,
            failed: false,
          });
          return;
        }
        setLoadState({
          key: candidatesKey,
          index: candidateIndex,
          failed: true,
        });
      }}
    />
  );
}
