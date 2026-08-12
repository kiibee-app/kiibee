"use client";

import Image, { StaticImageData } from "next/image";
import React, { ReactNode, useState } from "react";
import {
  CONTENT_POSTER_IMAGE_STYLE,
  isRemoteImageSource,
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
  ImageSkeleton,
  CardHeader,
  CardChildren,
} from "./styles";

type GenericCardProps = {
  image?: string | StaticImageData;
  imageFallback?: string;
  imageInitials?: string;
  coverImage?: boolean;
  imageAspectRatio?: string;
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
  onImageError?: () => void;
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
  imageAspectRatio,
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
  onImageError,
}: GenericCardProps) {
  const imageKey = image ? (typeof image === "string" ? image : image.src) : "";
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
  const [fallbackState, setFallbackState] = useState<{
    forKey: string;
    url: string;
  } | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const [prevImageKey, setPrevImageKey] = useState(imageKey);

  if (imageKey !== prevImageKey) {
    setPrevImageKey(imageKey);
    setImageLoading(true);
  }

  const activeFallback =
    fallbackState?.forKey === imageKey ? fallbackState.url : null;
  const imageFailed = failedImageKey === imageKey && !activeFallback;

  const imageSrc = activeFallback ?? (image ? resolveImageUrl(image) : null);
  const showRemoteImage =
    Boolean(imageSrc) &&
    !imageFailed &&
    typeof imageSrc === "string" &&
    isRemoteImageSource(imageSrc);
  const showOptimizedImage = Boolean(image) && !imageFailed && !showRemoteImage;
  const showInitials = Boolean(imageInitials) && (!image || imageFailed);

  const markImageLoaded = () => setImageLoading(false);

  const handleImageRef = (element: HTMLImageElement | null) => {
    if (element?.complete && element.naturalWidth > 0) {
      markImageLoaded();
    }
  };

  const handleImageError = () => {
    if (imageFallback && activeFallback !== imageFallback) {
      setFallbackState({ forKey: imageKey, url: imageFallback });
      return;
    }
    setFailedImageKey(imageKey);
    setImageLoading(false);
    onImageError?.();
  };

  const posterImageStyle = coverImage
    ? CONTENT_POSTER_IMAGE_STYLE
    : REMOTE_COVER_IMAGE_STYLE;

  const isCurrentlyLoading =
    imageLoading && !showInitials && !imageFailed && Boolean(imageSrc);

  return (
    <Card
      $width={width}
      $compact={compact}
      $coverImage={coverImage}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {(image || imageInitials) && (
        <ImageWrapper
          $compact={compact}
          $coverImage={coverImage}
          $imageAspectRatio={imageAspectRatio}
          $isLoading={isCurrentlyLoading}
        >
          {isCurrentlyLoading && <ImageSkeleton aria-hidden />}
          {badge && <Badge $variant={badgeVariant}>{badge}</Badge>}
          {showRemoteImage ? (
            <Image
              ref={handleImageRef}
              src={imageSrc!}
              alt={alt || "card image"}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={posterImageStyle}
              priority={imagePriority}
              loading={imagePriority ? "eager" : "lazy"}
              unoptimized
              onLoad={markImageLoaded}
              onError={handleImageError}
            />
          ) : showOptimizedImage ? (
            <Image
              src={image!}
              alt={alt || "card image"}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={posterImageStyle}
              priority={imagePriority}
              loading={imagePriority ? "eager" : "lazy"}
              onLoad={markImageLoaded}
              onError={handleImageError}
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
