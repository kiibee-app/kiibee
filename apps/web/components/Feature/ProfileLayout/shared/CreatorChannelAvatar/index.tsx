"use client";

import { useState } from "react";
import profileFallback from "@/assets/images/profile.png";
import { resolvePublicMediaUrl } from "@/utils/media";
import { canOptimizeRemoteImage } from "@/utils/imageDelivery";
import { AvatarImage, type AvatarFit } from "./styles";

type CreatorChannelAvatarProps = {
  avatarUrl: string | null;
  initial?: string;
  alt: string;
  sizes: string;
  initialUse?: unknown;
  fit?: AvatarFit;
};

export default function CreatorChannelAvatar({
  avatarUrl,
  alt,
  sizes,
  fit = "cover",
}: CreatorChannelAvatarProps) {
  const resolvedAvatarUrl = resolvePublicMediaUrl(avatarUrl);
  const [prevAvatarUrl, setPrevAvatarUrl] = useState(resolvedAvatarUrl);
  const [hasError, setHasError] = useState(false);
  const [directSrc, setDirectSrc] = useState<string | null>(null);

  if (resolvedAvatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(resolvedAvatarUrl);
    setHasError(false);
  }

  if (resolvedAvatarUrl && !hasError) {
    return (
      <AvatarImage
        src={resolvedAvatarUrl}
        alt={alt}
        fill
        sizes={sizes}
        loading="eager"
        unoptimized={
          (resolvedAvatarUrl.startsWith("http") &&
            !canOptimizeRemoteImage(resolvedAvatarUrl)) ||
          directSrc === resolvedAvatarUrl
        }
        $fit={fit}
        style={{
          objectFit: fit,
          objectPosition: "center",
          backgroundColor: "transparent",
        }}
        onError={() => {
          if (
            canOptimizeRemoteImage(resolvedAvatarUrl) &&
            directSrc !== resolvedAvatarUrl
          ) {
            setDirectSrc(resolvedAvatarUrl);
          } else {
            setHasError(true);
          }
        }}
      />
    );
  }

  return (
    <AvatarImage
      src={profileFallback}
      alt={alt}
      fill
      sizes={sizes}
      $fit={fit}
      style={{
        objectFit: fit,
        objectPosition: "center",
        backgroundColor: "transparent",
      }}
    />
  );
}
