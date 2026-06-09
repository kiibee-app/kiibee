"use client";

import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import PdfIcon from "@/assets/icons/PdfIcon";
import type { SingleContentHeroSectionProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import { isCloudflareStreamEmbedUrl, isRemoteImageSource } from "@/utils/media";
import {
  Hero,
  HeroMediaTag,
  HeroMediaText,
  HeroTag,
  HeroTagText,
  Preview,
  PreviewAudio,
  PreviewDocument,
  PreviewVideo,
  TrailerButton,
  TrailerText,
} from "./styles";
import EpubViewer from "@/utils/EpubViewer";

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
) {
  const { src, type, title } = hero.media ?? {};

  if (!src) return null;

  switch (type) {
    case FORMAT_TYPE.VIDEO:
      if (isCloudflareStreamEmbedUrl(src)) {
        return (
          <PreviewDocument
            src={src}
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
          onPlay={videoProps.onVideoPlay}
          onPause={videoProps.onVideoPause}
          onEnded={videoProps.onVideoEnded}
        />
      );
    case FORMAT_TYPE.AUDIO:
      return <PreviewAudio src={src} controls />;
    case FORMAT_TYPE.PDF:
    case FORMAT_TYPE.WEB:
      return <PreviewDocument src={src} title={title} />;
    case FORMAT_TYPE.EPUB:
      return <EpubViewer src={src} />;
    default:
      return null;
  }
}

const HeroImage = ({ hero }: { hero: SingleContentPreviewProps["hero"] }) => (
  <Image
    src={hero.image}
    alt={hero.imageAlt}
    fill
    priority
    unoptimized={isRemoteImageSource(hero.image)}
  />
);

function SingleContentPreview({
  hero,
  showVideoControls,
  videoRef,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
}: SingleContentPreviewProps) {
  const mediaContent = getMediaContent(hero, {
    videoRef,
    showVideoControls,
    onVideoPlay,
    onVideoPause,
    onVideoEnded,
  });

  return mediaContent ?? <HeroImage hero={hero} />;
}

export default function SingleContentHeroView({
  hero,
  isPdfLayout = false,
}: SingleContentHeroViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const isVideoMedia = hero.media?.type === FORMAT_TYPE.VIDEO;
  const isCloudflareVideo =
    isVideoMedia && isCloudflareStreamEmbedUrl(hero.media?.src);

  const handleVideoPlay = () => {
    if (isVideoMedia) {
      setHasStartedPlayback(true);
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

  return (
    <Hero $isPdf={isPdfLayout}>
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
        />
      </Preview>

      {hero.categoryLabel ? (
        <HeroTag>
          <HeroTagText>{hero.categoryLabel}</HeroTagText>
        </HeroTag>
      ) : null}

      {hero.mediaLabel &&
      (!isVideoMedia || isCloudflareVideo || !hasStartedPlayback) ? (
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

      {hero.trailerLabel && !isCloudflareVideo && !hasStartedPlayback ? (
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
