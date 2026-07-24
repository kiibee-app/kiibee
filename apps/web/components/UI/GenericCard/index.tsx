"use client";

import Image, { StaticImageData } from "next/image";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  CONTENT_POSTER_IMAGE_STYLE,
  isRemoteImageSource,
  REMOTE_COVER_IMAGE_STYLE,
  resolveImageUrl,
} from "@/utils/media";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT } from "@/utils/Constants";
import { useDownscaledRemoteImage } from "@/hooks/useDownscaledRemoteImage";
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
  optimizeRemoteImage?: boolean;
  deferImage?: boolean;
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

function toImageKey(image?: string | StaticImageData) {
  if (!image) return "";
  return typeof image === "string" ? image : image.src;
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
  deferImage = false,
  onClick,
  onImageError,
}: GenericCardProps) {
  const imageKey = toImageKey(image);
  const [failedImageKey, setFailedImageKey] = useState<string | null>(null);
  const [fallbackState, setFallbackState] = useState<{
    forKey: string;
    url: string;
  } | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [shouldLoadImage, setShouldLoadImage] = useState(
    !deferImage || imagePriority,
  );
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const [prevImageKey, setPrevImageKey] = useState(imageKey);

  if (imageKey !== prevImageKey) {
    setPrevImageKey(imageKey);
    setImageLoading(true);
  }

  const activeFallback =
    fallbackState?.forKey === imageKey ? fallbackState.url : null;
  const imageFailed = failedImageKey === imageKey && !activeFallback;

  const imageSrc =
    activeFallback ??
    (image ? resolveImageUrl(image) : null) ??
    (imageFallback && !image ? resolveImageUrl(imageFallback) : null);

  const isRemote =
    Boolean(imageSrc) &&
    typeof imageSrc === "string" &&
    isRemoteImageSource(imageSrc);

  const { displaySrc: downscaledSrc, isPreparing } = useDownscaledRemoteImage(
    isRemote && typeof imageSrc === "string" ? imageSrc : null,
    shouldLoadImage && isRemote && !imageFailed,
  );

  const remoteDisplaySrc = downscaledSrc;

  const showRemoteImage =
    Boolean(remoteDisplaySrc) &&
    !imageFailed &&
    isRemote &&
    typeof remoteDisplaySrc === "string";

  const showOptimizedImage = Boolean(imageSrc) && !imageFailed && !isRemote;

  const showInitials = Boolean(imageInitials) && (!imageSrc || imageFailed);

  const markImageLoaded = () => setImageLoading(false);

  const handleImageRef = (element: HTMLImageElement | null) => {
    if (element?.complete && element.naturalWidth > 0) {
      markImageLoaded();
    }
  };

  const handleImageError = () => {
    if (imageFallback && activeFallback !== imageFallback) {
      setFallbackState({ forKey: imageKey, url: imageFallback });
      setImageLoading(true);
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
    (imageLoading || isPreparing) &&
    shouldLoadImage &&
    !showInitials &&
    !imageFailed &&
    Boolean(imageSrc);

  useEffect(() => {
    if (shouldLoadImage || !deferImage) return;

    const wrapper = imageWrapperRef.current;
    if (!wrapper) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() =>
        setShouldLoadImage(true),
      );
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadImage(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [deferImage, shouldLoadImage]);

  return (
    <Card
      $width={width}
      $compact={compact}
      $coverImage={coverImage}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {(image || imageFallback || imageInitials) && (
        <ImageWrapper
          ref={imageWrapperRef}
          $compact={compact}
          $coverImage={coverImage}
          $isLoading={isCurrentlyLoading}
        >
          {isCurrentlyLoading && <ImageSkeleton aria-hidden />}
          {badge && <Badge $variant={badgeVariant}>{badge}</Badge>}
          {shouldLoadImage && showRemoteImage ? (
            <img
              key={remoteDisplaySrc}
              ref={handleImageRef}
              src={remoteDisplaySrc}
              alt={alt || "card image"}
              loading={imagePriority ? "eager" : "lazy"}
              decoding="async"
              style={posterImageStyle}
              onLoad={markImageLoaded}
              onError={handleImageError}
            />
          ) : shouldLoadImage && showOptimizedImage ? (
            <Image
              key={typeof imageSrc === "string" ? imageSrc : imageKey}
              src={
                !activeFallback && image && typeof image !== "string"
                  ? image
                  : imageSrc!
              }
              alt={alt || "card image"}
              fill
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1200px) 50vw, 360px"
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
