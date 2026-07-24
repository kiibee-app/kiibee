"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type RefObject,
  type MouseEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import { toast } from "react-toastify";
import PdfIcon from "@/assets/icons/PdfIcon";
import { PlayIcon } from "@/assets/icons";
import type {
  SingleContentHeroSectionProps,
  SingleContentAction,
} from "@/types/contentTypes";
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
  TrailerWrapper,
  CenteredPlayButton,
} from "./styles";

type SingleContentHeroViewProps = SingleContentHeroSectionProps & {
  isPdfLayout?: boolean;
  primaryAction?: SingleContentAction;
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
          autoPlay
          muted
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
  onLoad,
}: {
  hero: SingleContentPreviewProps["hero"];
  currentSrc: string;
  onImageError: () => void;
  onLoad: () => void;
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
        onLoad={onLoad}
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
      onLoad={onLoad}
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
  onLoad,
}: SingleContentPreviewProps & {
  isTrailerPlaying: boolean;
  isCloudflarePlaying: boolean;
  deferCloudflareEmbed: boolean;
  currentSrc: string;
  onImageError: () => void;
  onLoad: () => void;
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
        onLoad={onLoad}
      />
    )
  );
}

export default function SingleContentHeroView({
  hero,
  isPdfLayout = false,
  primaryAction,
}: SingleContentHeroViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(
    Boolean(hero.media?.src) &&
      hero.media?.type === FORMAT_TYPE.VIDEO &&
      isThirdPartyVideoUrl(hero.media?.src ?? ""),
  );
  const [isCloudflarePlaying, setIsCloudflarePlaying] = useState(
    Boolean(hero.media?.src) &&
      hero.media?.type === FORMAT_TYPE.VIDEO &&
      isCloudflareStreamEmbedUrl(hero.media?.src),
  );
  const [imageLoading, setImageLoading] = useState(true);
  const isVideoMedia = hero.media?.type === FORMAT_TYPE.VIDEO;
  const isCloudflareVideo =
    isVideoMedia && isCloudflareStreamEmbedUrl(hero.media?.src);
  const isThirdPartyVideo =
    isVideoMedia && isThirdPartyVideoUrl(hero.media?.src ?? "");
  const deferCloudflareEmbed = isCloudflareVideo && Boolean(hero.trailerLabel);
  const hasTrailerLink = Boolean(hero.media?.src);

  const isVideo = hero.contentType === FORMAT_TYPE.VIDEO;
  const isAudio = hero.contentType === FORMAT_TYPE.AUDIO;
  const isPurchased = Boolean(primaryAction);
  const showPlayButton =
    isPurchased &&
    (isVideo || isAudio) &&
    !hasStartedPlayback &&
    !isTrailerPlaying &&
    !isCloudflarePlaying;

  const primarySrc = resolveImageUrl(hero.image);
  const [fallbackForSrc, setFallbackForSrc] = useState<string | null>(null);

  const currentSrc =
    fallbackForSrc === primarySrc && hero.imageFallback
      ? resolveImageUrl(hero.imageFallback)
      : primarySrc;

  const [prevSrc, setPrevSrc] = useState(currentSrc);
  if (currentSrc !== prevSrc) {
    setPrevSrc(currentSrc);
    setImageLoading(true);
  }

  const handleImageError = () => {
    if (hero.imageFallback && fallbackForSrc !== primarySrc) {
      setFallbackForSrc(primarySrc);
    }
    setImageLoading(false);
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

  const handleTrailerClick = useCallback(async () => {
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
      toast.error(t("singleContent.videoPlaybackError"));
    }
  }, [isCloudflareVideo, isThirdPartyVideo, t]);

  const handleTrailerButtonClick = () => {
    if (!hasTrailerLink) return;
    hero.onTrailerClick?.();
    void handleTrailerClick();
  };

  const handleCenteredPlayClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    primaryAction?.onClick?.();
  };

  const showTrailerButton =
    hero.trailerLabel &&
    hasTrailerLink &&
    !hasStartedPlayback &&
    !isTrailerPlaying &&
    !isCloudflarePlaying;

  const isImageDisplayed =
    !hero.media?.src ||
    hero.media?.type !== FORMAT_TYPE.VIDEO ||
    (isCloudflareVideo && deferCloudflareEmbed && !isCloudflarePlaying) ||
    (isThirdPartyVideo && !isTrailerPlaying);

  const isHeroLoading = isImageDisplayed && imageLoading;

  useEffect(() => {
    if (
      hasTrailerLink &&
      !isCloudflareVideo &&
      !isThirdPartyVideo &&
      videoRef.current
    ) {
      videoRef.current.play().catch(() => {});
    }
  }, [hasTrailerLink, isCloudflareVideo, isThirdPartyVideo]);

  return (
    <Hero $isPdf={isPdfLayout} $isLoading={isHeroLoading}>
      {encodedBlurSrc && (
        <HeroBlurBg style={{ backgroundImage: `url("${encodedBlurSrc}")` }} />
      )}
      <Preview
        onClick={showPlayButton ? primaryAction?.onClick : undefined}
        $clickable={showPlayButton}
      >
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
          onLoad={() => setImageLoading(false)}
        />
        {showPlayButton ? (
          <CenteredPlayButton
            onClick={handleCenteredPlayClick}
            type="button"
            aria-label={isAudio ? "Play audio" : "Play video"}
          >
            <PlayIcon
              width={28}
              height={28}
              fg={theme.colors.neutral.GRAY_500}
            />
          </CenteredPlayButton>
        ) : null}
      </Preview>

      {hero.categoryLabel ? (
        <HeroTag>
          <HeroTagText>{hero.categoryLabel}</HeroTagText>
        </HeroTag>
      ) : null}

      {hero.mediaLabel &&
      (!isVideoMedia || (!hasStartedPlayback && !isTrailerPlaying)) ? (
        <HeroMediaTag>
          {hero.media?.type === FORMAT_TYPE.PDF ||
          hero.contentType === FORMAT_TYPE.PDF ? (
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
        <TrailerWrapper>
          <TrailerButton
            onClick={handleTrailerButtonClick}
            $noTrailer={!hasTrailerLink}
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
          </TrailerButton>
        </TrailerWrapper>
      ) : null}
    </Hero>
  );
}
