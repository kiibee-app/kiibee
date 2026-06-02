"use client";

import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import PdfIcon from "@/assets/icons/PdfIcon";
import type { SingleContentHeroSectionProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import { isRemoteImageSource } from "@/utils/media";
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

function SingleContentPreview({
  hero,
  showVideoControls,
  videoRef,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
}: SingleContentPreviewProps) {
  return hero.media?.src ? (
    hero.media.type === FORMAT_TYPE.VIDEO ? (
      <PreviewVideo
        ref={videoRef}
        src={hero.media.src}
        controls={showVideoControls}
        playsInline
        onPlay={onVideoPlay}
        onPause={onVideoPause}
        onEnded={onVideoEnded}
      />
    ) : hero.media.type === FORMAT_TYPE.AUDIO ? (
      <PreviewAudio src={hero.media.src} controls />
    ) : hero.media.type === FORMAT_TYPE.PDF ||
      hero.media.type === FORMAT_TYPE.WEB ? (
      <PreviewDocument src={hero.media.src} title={hero.media.title} />
    ) : (
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        unoptimized={isRemoteImageSource(hero.image)}
      />
    )
  ) : (
    <Image
      src={hero.image}
      alt={hero.imageAlt}
      fill
      priority
      unoptimized={isRemoteImageSource(hero.image)}
    />
  );
}

export default function SingleContentHeroView({
  hero,
  isPdfLayout = false,
}: SingleContentHeroViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const isVideoMedia = hero.media?.type === FORMAT_TYPE.VIDEO;

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
          showVideoControls={!isVideoMedia || hasStartedPlayback}
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

      {hero.mediaLabel && (!isVideoMedia || !hasStartedPlayback) ? (
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

      {hero.trailerLabel && !hasStartedPlayback ? (
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
