"use client";

import { AvatarImage, AvatarInitial } from "./styles";

type CreatorChannelAvatarProps = {
  avatarUrl: string | null;
  initial: string;
  alt: string;
  sizes: string;
  initialUse?: "Heading2" | "H4_SemiBold" | "Heading3";
};

export default function CreatorChannelAvatar({
  avatarUrl,
  initial,
  alt,
  sizes,
  initialUse = "Heading2",
}: CreatorChannelAvatarProps) {
  if (avatarUrl) {
    return (
      <AvatarImage src={avatarUrl} alt={alt} fill sizes={sizes} unoptimized />
    );
  }

  return <AvatarInitial $use={initialUse}>{initial}</AvatarInitial>;
}
