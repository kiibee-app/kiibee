"use client";

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
  if (avatarUrl) {
    return (
      <AvatarImage src={avatarUrl} alt={alt} fill sizes={sizes} unoptimized />
    );
  }

  return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
}
