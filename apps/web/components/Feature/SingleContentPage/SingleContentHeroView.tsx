"use client";

import Image from "next/image";
import { useRef, useState, type RefObject } from "react";
import PdfIcon from "@/assets/icons/PdfIcon";
import type { SingleContentHeroSectionProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import {
  getThirdPartyEmbedUrl,
  isCloudflareStreamEmbedUrl,
  isRemoteImageSource,
  isStaticImageData,
  isThirdPartyVideoUrl,
  resolveImageUrl,
} from "@/utils/media";
import {
  Hero,
  HeroMediaTag,
  HeroMediaText,
  HeroTag,
  HeroTagText,
  HeroPosterActionRow,
  HeroPosterCategoryTag,
  HeroPosterMediaTag,
  HeroPosterTrailerButton,
  PosterFrame,
  Preview,
  PreviewBackdrop,
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

function useHeroImageSrc(hero: SingleContentPreviewProps["hero"]) {
  const primarySrc = resolveImageUrl(hero.image);
  const [fallbackForSrc, setFallbackForSrc] = useState<string | null>(null);
  const src =
    fallbackForSrc === primarySrc && hero.imageFallback
      ? hero.imageFallback
      : primarySrc;

  const handleError = () => {
    if (hero.imageFallback && fallbackForSrc !== primarySrc) {
      setFallbackForSrc(primarySrc);
    }
  };

  return { src, handleError };
}

const HeroBackdropImage = ({
  hero,
}: {
  hero: SingleContentPreviewProps["hero"];
}) => {
  const { src, handleError } = useHeroImageSrc(hero);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- decorative blurred backdrop
    <img src={src} alt="" aria-hidden decoding="async" onError={handleError} />
  );
};

const HeroPosterImage = ({
  hero,
}: {
  hero: SingleContentPreviewProps["hero"];
}) => {
  const { src, handleError } = useHeroImageSrc(hero);

  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- height-based contain layout needs native img sizing
    <img src={src} alt={hero.imageAlt} decoding="async" onError={handleError} />
  );
};

const HeroImage = ({
  hero,
  objectFit = "cover",
}: {
  hero: SingleContentPreviewProps["hero"];
  objectFit?: "cover" | "contain";
}) => {
  const { src, handleError } = useHeroImageSrc(hero);
  const imageStyle = { objectFit } as const;

  if (objectFit === "contain") {
    return <HeroPosterImage hero={hero} />;
  }

  if (isRemoteImageSource(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- full-res remote poster URLs render sharper than scaled Next/Image
      <img
        src={src}
        alt={hero.imageAlt}
        decoding="async"
        onError={handleError}
        style={imageStyle}
      />
    );
  }

  if (isStaticImageData(hero.image)) {
    return (
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="(max-width: 900px) 100vw, 900px"
        style={imageStyle}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={hero.image}
      alt={hero.imageAlt}
      fill
      priority
      sizes="(max-width: 900px) 100vw, 900px"
      style={imageStyle}
      unoptimized
      onError={handleError}
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
  showVideoPosterLayout,
}: SingleContentPreviewProps & {
  isTrailerPlaying: boolean;
  isCloudflarePlaying: boolean;
  deferCloudflareEmbed: boolean;
  showVideoPosterLayout: boolean;
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

  if (mediaContent) return mediaContent;

  if (showVideoPosterLayout) {
    return (
      <PosterFrame>
        <HeroImage hero={hero} objectFit="contain" />
      </PosterFrame>
    );
  }

  return <HeroImage hero={hero} />;
}

function VideoPosterActions({
  hero,
  isVideoMedia,
  hasStartedPlayback,
  isTrailerPlaying,
  showTrailerButton,
  onTrailerButtonClick,
}: {
  hero: SingleContentHeroViewProps["hero"];
  isVideoMedia: boolean;
  hasStartedPlayback: boolean;
  isTrailerPlaying: boolean;
  showTrailerButton: boolean;
  onTrailerButtonClick: () => void;
}) {
  const showMediaLabel =
    hero.mediaLabel &&
    (!isVideoMedia || (!hasStartedPlayback && !isTrailerPlaying));

  if (!showMediaLabel && !showTrailerButton && !hero.categoryLabel) return null;

  return (
    <>
      {hero.categoryLabel ? (
        <HeroPosterCategoryTag>
          <HeroTagText>{hero.categoryLabel}</HeroTagText>
        </HeroPosterCategoryTag>
      ) : null}

      {showMediaLabel || showTrailerButton ? (
        <HeroPosterActionRow>
          {showMediaLabel ? (
            <HeroPosterMediaTag>
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
            </HeroPosterMediaTag>
          ) : (
            <span />
          )}

          {showTrailerButton ? (
            <HeroPosterTrailerButton
              onClick={onTrailerButtonClick}
              type="button"
            >
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
            </HeroPosterTrailerButton>
          ) : null}
        </HeroPosterActionRow>
      ) : null}
    </>
  );
}

function HeroOverlays({
  hero,
  isVideoMedia,
  hasStartedPlayback,
  isTrailerPlaying,
  showTrailerButton,
  onTrailerButtonClick,
}: {
  hero: SingleContentHeroViewProps["hero"];
  isVideoMedia: boolean;
  hasStartedPlayback: boolean;
  isTrailerPlaying: boolean;
  showTrailerButton: boolean;
  onTrailerButtonClick: () => void;
}) {
  return (
    <>
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
        <TrailerButton onClick={onTrailerButtonClick} type="button">
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
    </>
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

  const isVideoContent = hero.contentType === FORMAT_TYPE.VIDEO || isVideoMedia;
  const showVideoPosterLayout =
    !isPdfLayout &&
    isVideoContent &&
    !hasStartedPlayback &&
    !isTrailerPlaying &&
    !isCloudflarePlaying;

  return (
    <Hero $isPdf={isPdfLayout} $isVideoPoster={showVideoPosterLayout}>
      {showVideoPosterLayout ? (
        <PreviewBackdrop>
          <HeroBackdropImage hero={hero} />
        </PreviewBackdrop>
      ) : null}

      <Preview $isVideoPoster={showVideoPosterLayout}>
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
          showVideoPosterLayout={showVideoPosterLayout}
        />
      </Preview>

      {showVideoPosterLayout ? (
        <VideoPosterActions
          hero={hero}
          isVideoMedia={isVideoMedia}
          hasStartedPlayback={hasStartedPlayback}
          isTrailerPlaying={isTrailerPlaying}
          showTrailerButton={Boolean(showTrailerButton)}
          onTrailerButtonClick={handleTrailerButtonClick}
        />
      ) : null}

      {!showVideoPosterLayout ? (
        <HeroOverlays
          hero={hero}
          isVideoMedia={isVideoMedia}
          hasStartedPlayback={hasStartedPlayback}
          isTrailerPlaying={isTrailerPlaying}
          showTrailerButton={Boolean(showTrailerButton)}
          onTrailerButtonClick={handleTrailerButtonClick}
        />
      ) : null}
    </Hero>
  );
}
