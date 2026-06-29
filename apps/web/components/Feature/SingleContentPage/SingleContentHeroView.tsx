"use client";

import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import PdfIcon from "@/assets/icons/PdfIcon";
import type { SingleContentHeroSectionProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import {
  getThirdPartyEmbedUrl,
  isCloudflareStreamEmbedUrl,
  isStaticImageData,
  isThirdPartyVideoUrl,
  resolveImageUrl,
} from "@/utils/media";
import {
  Hero,
  HeroBlurBg,
  HeroMediaTag,
  HeroMediaText,
  HeroTag,
  HeroTagText,
  Preview,
  PreviewDocument,
  PreviewVideo,
  TrailerButton,
  TrailerText,
} from "./styles";

type SingleContentHeroViewProps = SingleContentHeroSectionProps & {
  isPdfLayout?: boolean;
};

type SingleContentPreviewProps = SingleContentHeroSectionProps & {
  showVideoControls: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  onVideoPlay: () => void;
  onVideoPause: () => void;
  onVideoEnded: () => void;
};

function getMediaContent(
  hero: SingleContentPreviewProps["hero"],
  videoProps: Pick<
    SingleContentPreviewProps,
    | "videoRef"
    | "showVideoControls"
    | "onVideoPlay"
    | "onVideoPause"
    | "onVideoEnded"
  >,
  isTrailerPlaying: boolean,
  isCloudflarePlaying: boolean,
  deferCloudflareEmbed: boolean,
) {
  const { src, type, title } = hero.media ?? {};

  if (!src) return null;

  switch (type) {
    case FORMAT_TYPE.VIDEO:
      if (isCloudflareStreamEmbedUrl(src)) {
        if (deferCloudflareEmbed && !isCloudflarePlaying) return null;
        return (
          <PreviewDocument
            src={src}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        );
      }

      if (isThirdPartyVideoUrl(src)) {
        if (!isTrailerPlaying) return null;
        return (
          <PreviewDocument
            src={getThirdPartyEmbedUrl(src)}
            title={title}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        );
      }

      return (
        <PreviewVideo
          ref={videoProps.videoRef}
          src={src}
          controls={videoProps.showVideoControls}
          playsInline
          preload="metadata"
          onPlay={videoProps.onVideoPlay}
          onPause={videoProps.onVideoPause}
          onEnded={videoProps.onVideoEnded}
        />
      );
    case FORMAT_TYPE.AUDIO:
    case FORMAT_TYPE.PDF:
    case FORMAT_TYPE.WEB:
    case FORMAT_TYPE.EPUB:
      return null;
    default:
      return null;
  }
}

const HeroImage = ({
  hero,
  currentSrc,
  onImageError,
}: {
  hero: SingleContentPreviewProps["hero"];
  currentSrc: string;
  onImageError: () => void;
}) => {
  if (isStaticImageData(hero.image)) {
    const imageToRender =
      currentSrc === resolveImageUrl(hero.image) ? hero.image : currentSrc;
    return (
      <Image
        src={imageToRender}
        alt={hero.imageAlt}
        fill
        priority
        sizes="(max-width: 900px) 100vw, 900px"
        style={{ objectFit: "contain" }}
        onError={onImageError}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={hero.imageAlt}
      fill
      priority
      sizes="(max-width: 900px) 100vw, 900px"
      style={{ objectFit: "contain" }}
      unoptimized
      onError={onImageError}
    />
  );
};

function SingleContentPreview({
  hero,
  showVideoControls,
  videoRef,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
  isTrailerPlaying,
  isCloudflarePlaying,
  deferCloudflareEmbed,
  currentSrc,
  onImageError,
}: SingleContentPreviewProps & {
  isTrailerPlaying: boolean;
  isCloudflarePlaying: boolean;
  deferCloudflareEmbed: boolean;
  currentSrc: string;
  onImageError: () => void;
}) {
  const mediaContent = getMediaContent(
    hero,
    {
      videoRef,
      showVideoControls,
      onVideoPlay,
      onVideoPause,
      onVideoEnded,
    },
    isTrailerPlaying,
    isCloudflarePlaying,
    deferCloudflareEmbed,
  );

  return (
    mediaContent ?? (
      <HeroImage
        hero={hero}
        currentSrc={currentSrc}
        onImageError={onImageError}
      />
    )
  );
}

export default function SingleContentHeroView({
  hero,
  isPdfLayout = false,
}: SingleContentHeroViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isCloudflarePlaying, setIsCloudflarePlaying] = useState(false);
  const isVideoMedia = hero.media?.type === FORMAT_TYPE.VIDEO;
  const isCloudflareVideo =
    isVideoMedia && isCloudflareStreamEmbedUrl(hero.media?.src);
  const isThirdPartyVideo =
    isVideoMedia && isThirdPartyVideoUrl(hero.media?.src ?? "");
  const deferCloudflareEmbed = isCloudflareVideo && Boolean(hero.trailerLabel);

  const primarySrc = resolveImageUrl(hero.image);
  const [fallbackForSrc, setFallbackForSrc] = useState<string | null>(null);

  const currentSrc =
    fallbackForSrc === primarySrc && hero.imageFallback
      ? resolveImageUrl(hero.imageFallback)
      : primarySrc;

  const handleImageError = () => {
    if (hero.imageFallback && fallbackForSrc !== primarySrc) {
      setFallbackForSrc(primarySrc);
    }
  };

  const getCssUrl = (urlStr: string) => {
    if (urlStr.startsWith("data:")) {
      return urlStr;
    }
    return encodeURI(urlStr);
  };

  const blurSrc = currentSrc;
  const encodedBlurSrc = blurSrc ? getCssUrl(blurSrc) : "";

  const handleVideoPlay = () => {
    if (isVideoMedia) {
      setHasStartedPlayback(true);
      setIsTrailerPlaying(false);
    }
  };

  const handleVideoPause = () => {
    if (isVideoMedia && videoRef.current && !videoRef.current.ended) {
      setHasStartedPlayback(true);
    }
  };

  const handleVideoEnded = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
    setHasStartedPlayback(false);
  };

  const handleTrailerClick = async () => {
    if (isCloudflareVideo) {
      setIsCloudflarePlaying(true);
      setHasStartedPlayback(true);
      return;
    }
    if (isThirdPartyVideo) {
      setIsTrailerPlaying(true);
      return;
    }
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      await videoElement.play();
      setHasStartedPlayback(true);
    } catch {
      setHasStartedPlayback(false);
    }
  };

  const handleTrailerButtonClick = () => {
    hero.onTrailerClick?.();
    void handleTrailerClick();
  };

  const showTrailerButton =
    hero.trailerLabel &&
    !hasStartedPlayback &&
    !isTrailerPlaying &&
    !isCloudflarePlaying;

  return (
    <Hero $isPdf={isPdfLayout}>
      {encodedBlurSrc && (
        <HeroBlurBg style={{ backgroundImage: `url("${encodedBlurSrc}")` }} />
      )}
      <Preview>
        <SingleContentPreview
          hero={hero}
          showVideoControls={
            !isVideoMedia || isCloudflareVideo || hasStartedPlayback
          }
          videoRef={videoRef}
          onVideoPlay={handleVideoPlay}
          onVideoPause={handleVideoPause}
          onVideoEnded={handleVideoEnded}
          isTrailerPlaying={isTrailerPlaying}
          isCloudflarePlaying={isCloudflarePlaying}
          deferCloudflareEmbed={deferCloudflareEmbed}
          currentSrc={currentSrc}
          onImageError={handleImageError}
        />
      </Preview>

      {hero.categoryLabel ? (
        <HeroTag>
          <HeroTagText>{hero.categoryLabel}</HeroTagText>
        </HeroTag>
      ) : null}

      {hero.mediaLabel &&
      (!isVideoMedia || (!hasStartedPlayback && !isTrailerPlaying)) ? (
        <HeroMediaTag>
          {hero.media?.type === FORMAT_TYPE.PDF ? (
            <PdfIcon width={16} height={16} />
          ) : hero.mediaIcon ? (
            <Image
              src={hero.mediaIcon}
              alt={hero.mediaIconAlt ?? ""}
              width={16}
              height={16}
              priority
            />
          ) : null}
          <HeroMediaText>{hero.mediaLabel}</HeroMediaText>
        </HeroMediaTag>
      ) : null}

      {showTrailerButton ? (
        <TrailerButton onClick={handleTrailerButtonClick} type="button">
          {hero.trailerIcon ? (
            <Image
              src={hero.trailerIcon}
              alt={hero.trailerIconAlt ?? ""}
              width={15}
              height={15}
              priority
            />
          ) : null}
          <TrailerText>{hero.trailerLabel}</TrailerText>
        </TrailerButton>
      ) : null}
    </Hero>
  );
}
