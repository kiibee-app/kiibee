"use client";

import { useState } from "react";
import profileFallback from "@/assets/images/profile.png";
import { isRemoteImageSource, resolvePublicMediaUrl } from "@/utils/media";
import { AvatarImage, RemoteAvatarImage, type AvatarFit } from "./styles";

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

  if (resolvedAvatarUrl !== prevAvatarUrl) {
    setPrevAvatarUrl(resolvedAvatarUrl);
    setHasError(false);
  }

  if (resolvedAvatarUrl && !hasError) {
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
          onError={() => setHasError(true)}
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
        onError={() => setHasError(true)}
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
