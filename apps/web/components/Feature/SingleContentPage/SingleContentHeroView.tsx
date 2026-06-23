"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import PdfIcon from "@/assets/icons/PdfIcon";
import type { SingleContentHeroSectionProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import {
  getThirdPartyEmbedUrl,
  isCloudflareStreamEmbedUrl,
  isRemoteImageSource,
  isStaticImageData,
  isThirdPartyVideoUrl,
  REMOTE_COVER_IMAGE_STYLE,
} from "@/utils/media";
import {
  Hero,
  HeroCoverImage,
  HeroMediaLayer,
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

function getHeroCoverCandidates(
  hero: SingleContentPreviewProps["hero"],
): string[] {
  return [
    typeof hero.image === "string" ? hero.image : hero.image.src,
    hero.imageFallback,
  ].filter(
    (src, index, sources): src is string =>
      Boolean(src) && sources.indexOf(src) === index,
  );
}

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
  options: {
    isTrailerPlaying: boolean;
    isCloudflarePlaying: boolean;
    deferCloudflareEmbed: boolean;
    poster?: string;
  },
) {
  const { src, type, title } = hero.media ?? {};
  const {
    isTrailerPlaying,
    isCloudflarePlaying,
    deferCloudflareEmbed,
    poster,
  } = options;

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
          poster={poster}
          controls={videoProps.showVideoControls}
          playsInline
          preload="none"
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

const HeroImage = ({ hero }: { hero: SingleContentPreviewProps["hero"] }) => {
  const candidates = getHeroCoverCandidates(hero);
  const candidatesKey = candidates.join("\0");
  const [loadState, setLoadState] = useState({
    key: "",
    index: 0,
    loaded: false,
  });
  const candidateIndex = loadState.key === candidatesKey ? loadState.index : 0;
  const isLoaded = loadState.key === candidatesKey ? loadState.loaded : false;

  const src = candidates[candidateIndex] ?? candidates[0];

  if (!src) return null;

  if (isRemoteImageSource(src)) {
    return (
      <HeroCoverImage
        src={src}
        alt={hero.imageAlt}
        $loaded={isLoaded}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        onLoad={() =>
          setLoadState({
            key: candidatesKey,
            index: candidateIndex,
            loaded: true,
          })
        }
        onError={() => {
          if (candidateIndex < candidates.length - 1) {
            setLoadState({
              key: candidatesKey,
              index: candidateIndex + 1,
              loaded: false,
            });
            return;
          }
          setLoadState({
            key: candidatesKey,
            index: candidateIndex,
            loaded: false,
          });
        }}
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
        style={{ objectFit: "cover", objectPosition: "center" }}
        onLoad={() =>
          setLoadState({
            key: candidatesKey,
            index: candidateIndex,
            loaded: true,
          })
        }
      />
    );
  }

  return (
    <HeroCoverImage
      src={src}
      alt={hero.imageAlt}
      $loaded={isLoaded}
      loading="eager"
      decoding="async"
      style={REMOTE_COVER_IMAGE_STYLE}
      onLoad={() =>
        setLoadState({
          key: candidatesKey,
          index: candidateIndex,
          loaded: true,
        })
      }
      onError={() => {
        if (candidateIndex < candidates.length - 1) {
          setLoadState({
            key: candidatesKey,
            index: candidateIndex + 1,
            loaded: false,
          });
          return;
        }
        setLoadState({
          key: candidatesKey,
          index: candidateIndex,
          loaded: false,
        });
      }}
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
  hasStartedPlayback,
}: SingleContentPreviewProps & {
  isTrailerPlaying: boolean;
  isCloudflarePlaying: boolean;
  deferCloudflareEmbed: boolean;
  hasStartedPlayback: boolean;
}) {
  const coverCandidates = getHeroCoverCandidates(hero);
  const shouldShowMedia =
    Boolean(hero.media?.src) &&
    (!hero.trailerLabel ||
      isTrailerPlaying ||
      isCloudflarePlaying ||
      hasStartedPlayback);

  const mediaContent = shouldShowMedia
    ? getMediaContent(
        hero,
        {
          videoRef,
          showVideoControls,
          onVideoPlay,
          onVideoPause,
          onVideoEnded,
        },
        {
          isTrailerPlaying,
          isCloudflarePlaying,
          deferCloudflareEmbed,
          poster: coverCandidates[0],
        },
      )
    : null;

  return (
    <>
      <HeroImage hero={hero} />
      {mediaContent ? <HeroMediaLayer>{mediaContent}</HeroMediaLayer> : null}
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

  const handleTrailerClick = () => {
    if (isCloudflareVideo) {
      setIsCloudflarePlaying(true);
      setHasStartedPlayback(true);
      return;
    }
    if (isThirdPartyVideo) {
      setIsTrailerPlaying(true);
      return;
    }
    setIsTrailerPlaying(true);
  };

  useEffect(() => {
    if (!isTrailerPlaying || isCloudflareVideo || isThirdPartyVideo) {
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    void videoElement.play().then(
      () => setHasStartedPlayback(true),
      () => setHasStartedPlayback(false),
    );
  }, [isTrailerPlaying, isCloudflareVideo, isThirdPartyVideo]);

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
          hasStartedPlayback={hasStartedPlayback}
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
