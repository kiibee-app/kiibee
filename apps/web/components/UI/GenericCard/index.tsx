"use client";

import Image, { StaticImageData } from "next/image";
import React, { ReactNode, useState } from "react";
import {
  isRemoteImageSource,
  isStaticImageData,
  REMOTE_COVER_IMAGE_STYLE,
  resolveImageUrl,
} from "@/utils/media";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import {
  Card,
  ImageWrapper,
  Content,
  Footer,
  Badge,
  ImageInitials,
  CardHeader,
  CardChildren,
} from "./styles";

type GenericCardProps = {
  image?: string | StaticImageData;
  imageFallback?: string;
  imageInitials?: string;
  coverImage?: boolean;
  alt?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  badgeVariant?: "default" | "owned";
  compact?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
  width?: string;
  imagePriority?: boolean;
  onClick?: () => void;
};

function applySoftOutlineToFooterButtons(node: ReactNode): ReactNode {
  if (!React.isValidElement(node)) return node;

  const element = node as React.ReactElement<Record<string, unknown>>;

  if (element.type === GenericButton) {
    return React.cloneElement(element, {
      ...element.props,
      variant: VARIANT.SOFT_OUTLINE,
    });
  }

  if (!element.props?.children) return node;

  return React.cloneElement(element, {
    ...element.props,
    children: React.Children.map(element.props.children as ReactNode, (child) =>
      applySoftOutlineToFooterButtons(child),
    ),
  });
}

export default function GenericCard({
  image,
  imageFallback,
  imageInitials,
  coverImage = false,
  alt,
  title,
  subtitle,
  badge,
  badgeVariant = "default",
  compact = false,
  footer,
  children,
  width,
  imagePriority = false,
  onClick,
}: GenericCardProps) {
  const imageKey = image ? (typeof image === "string" ? image : image.src) : "";
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
  const [activeFallback, setActiveFallback] = useState<{
    forKey: string;
    url: string;
  } | null>(null);
  const resolvedFallback =
    activeFallback?.forKey === imageKey ? activeFallback.url : null;
  const imageFailed = failedImageKey === imageKey && !resolvedFallback;

  const imageSrc = resolvedFallback ?? (image ? resolveImageUrl(image) : null);

  const showRemoteImage =
    Boolean(imageSrc) &&
    !imageFailed &&
    typeof imageSrc === "string" &&
    isRemoteImageSource(imageSrc);
  const showOptimizedImage =
    isStaticImageData(image) && !imageFailed && !showRemoteImage;
  const showStringImage =
    Boolean(imageSrc) &&
    !imageFailed &&
    typeof imageSrc === "string" &&
    !isRemoteImageSource(imageSrc) &&
    !isStaticImageData(image);
  const showInitials = Boolean(imageInitials) && (!image || imageFailed);

  return (
    <Card
      $width={width}
      $compact={compact}
      $coverImage={coverImage}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {(image || imageInitials) && (
        <ImageWrapper $compact={compact} $coverImage={coverImage}>
          {badge && <Badge $variant={badgeVariant}>{badge}</Badge>}
          {showRemoteImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URLs may fall outside Next image remotePatterns
            <img
              src={imageSrc ?? undefined}
              alt={alt || "card image"}
              style={REMOTE_COVER_IMAGE_STYLE}
              loading={imagePriority ? "eager" : "lazy"}
              decoding="async"
              onError={() => {
                if (
                  imageFallback &&
                  resolvedFallback !== imageFallback &&
                  imageSrc !== imageFallback
                ) {
                  setActiveFallback({ forKey: imageKey, url: imageFallback });
                  return;
                }
                setFailedImageKey(imageKey);
              }}
            />
          ) : showOptimizedImage ? (
            <Image
              src={image}
              alt={alt || "card image"}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority={imagePriority}
              onError={() => setFailedImageKey(imageKey)}
            />
          ) : showStringImage ? (
            // eslint-disable-next-line @next/next/no-img-element -- resolved media paths may be non-remote before normalization
            <img
              src={imageSrc ?? undefined}
              alt={alt || "card image"}
              style={REMOTE_COVER_IMAGE_STYLE}
              loading={imagePriority ? "eager" : "lazy"}
              decoding="async"
              onError={() => {
                if (
                  imageFallback &&
                  resolvedFallback !== imageFallback &&
                  imageSrc !== imageFallback
                ) {
                  setActiveFallback({ forKey: imageKey, url: imageFallback });
                  return;
                }
                setFailedImageKey(imageKey);
              }}
            />
          ) : showInitials ? (
            <ImageInitials $use="Heading3">{imageInitials}</ImageInitials>
          ) : null}
        </ImageWrapper>
      )}
      <Content>
        <CardHeader>
          {title}
          {subtitle}
        </CardHeader>
        {children && <CardChildren>{children}</CardChildren>}
      </Content>

      {footer && <Footer>{applySoftOutlineToFooterButtons(footer)}</Footer>}
    </Card>
  );
}
