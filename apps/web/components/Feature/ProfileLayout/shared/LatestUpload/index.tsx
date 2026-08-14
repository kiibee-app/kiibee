"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import type { ImageSource } from "@/utils/Constants";
import {
  ReadMoreButton,
  ActionButtons,
  ActionMainText,
  ActionSubText,
  Section,
  ContentWrapper,
  ImageSection,
  TextSection,
  Title,
  Paragraph,
  Badge,
  ImageOverlay,
  BottomControls,
  UploadImage,
  UploadBackgroundImage,
  RightControlButton,
  LeftControlButton,
  TrailerVideo,
  TrailerEmbed,
} from "./styles";
import {
  DECORATIVE_IMAGE_PROPS,
  resolveImageUrl,
  MOBILE_BREAKPOINT,
  VARIANT,
} from "@/utils/Constants";
import { MonoText } from "@/components/UI/Monotext";
import {
  EpubIcon,
  PdfIcon,
  PlayCircleIcon,
  PlayIcon,
  WebIcon,
} from "@/assets/icons";
import { useIsMobile } from "@/utils/useIsMobile";
import { LoginRequiredModal } from "@/components/UI/Modals";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { pathPublishedContent } from "@/utils/path";
import { ContentType, normalizeContentTypeValue } from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";
import {
  getContentDetailPricingActions,
  getContentPricingActions,
  getPricingLabels,
  isBuyActionLabel,
  isFreeContentItem,
  resolveContentActionHref,
} from "@/utils/contentPricingActions";
import { authStorage } from "@/lib/auth/authStorage";
import {
  getThirdPartyEmbedUrl,
  isCloudflareStreamEmbedUrl,
  isThirdPartyVideoUrl,
} from "@/utils/media";
import { useViewerContentAccess } from "@/hooks/useViewerContentAccess";

type LatestUploadAction = {
  title: string;
  subtitle?: string;
};

export type LatestUploadData = {
  contentType?: ContentType;
  sectionTitle: string;
  badge: string;
  image: ImageSource;
  imageFallbacks?: ImageSource[];
  imageAlt: string;
  title: string;
  year: string;
  description: string;
  actions: [LatestUploadAction, LatestUploadAction?];
  contentId?: string;
  trailerUrl?: string | null;
  accessType?: string | null;
  buyPrice?: string | number | null;
  rentPrice?: string | number | null;
  rentDurationHours?: string | number | null;
};

type LatestUploadProps = {
  data: LatestUploadData;
  isOwner?: boolean;
  variant?: import("@/components/Feature/ProfileLayout/config").ProfileLayoutVariant;
};

const contentIconMap = {
  video: PlayCircleIcon,
  audio: PlayCircleIcon,
  pdf: PdfIcon,
  epub: EpubIcon,
  web: WebIcon,
} as const;

type ComputedAction = {
  title: string;
  subtitle?: string;
  href?: string;
};

export default function LatestUpload({
  data,
  isOwner,
  variant,
}: LatestUploadProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const trailerVideoRef = useRef<HTMLVideoElement | null>(null);
  const { navigateToContent } = useProtectedContentNavigation();
  const { hasAccess } = useViewerContentAccess(
    data.contentId ?? "",
    null,
    null,
  );

  const computedActions = useMemo((): ComputedAction[] => {
    if (data.contentId) {
      if (isOwner || hasAccess) {
        return [
          {
            title: t("createProfileHome.latestUpload.seeContent"),
            href: pathPublishedContent(data.contentId),
          },
        ];
      }

      const pricingItem = {
        accessType: data.accessType,
        buyPrice: data.buyPrice,
        rentPrice: data.rentPrice,
        rentDurationHours: data.rentDurationHours,
      };
      const labels = getPricingLabels(t);

      if (isFreeContentItem(pricingItem)) {
        return [
          {
            title: t("pricingLabels.free"),
            subtitle: t("singleContent.pricing.downloadFiles"),
            href: `${pathPublishedContent(data.contentId)}#buy`,
          },
          {
            title: t("createProfileHome.latestUpload.seeContent"),
            href: pathPublishedContent(data.contentId),
          },
        ];
      }

      const gatedActions = getContentPricingActions(pricingItem, labels.free, {
        labels,
      });
      const isGatedLabel =
        gatedActions[0]?.label === labels.accessCodeRequired ||
        gatedActions[0]?.label === labels.emailRequired;

      if (isGatedLabel) {
        return gatedActions.map((action) => ({
          title: action.label,
          href: pathPublishedContent(data.contentId!),
        }));
      }

      const pricingActions = getContentDetailPricingActions(pricingItem, t, {
        labels,
      });

      if (pricingActions.length === 0) {
        return [
          {
            title: t("createProfileHome.latestUpload.seeContent"),
            href: pathPublishedContent(data.contentId),
          },
        ];
      }

      return pricingActions.map((action) => ({
        title: action.label,
        subtitle: action.subtitle,
        href: resolveContentActionHref(
          data.contentId!,
          action.label,
          pricingItem,
          pricingActions.length,
          { labels },
        ),
      }));
    }

    const fallbackActions = data.actions[0]
      ? [data.actions[0], data.actions[1]].filter(
          (a): a is NonNullable<typeof a> => Boolean(a),
        )
      : [];
    return fallbackActions.map((action) => ({
      title: action.title,
      subtitle: action.subtitle,
      href: undefined as string | undefined,
    }));
  }, [data, t, isOwner, hasAccess]);

  const visibleActions = computedActions;

  const [primaryAction, secondaryAction] = visibleActions;
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const handleSecondaryActionClick = () => {
    if (secondaryAction?.href) {
      navigateToContent(secondaryAction.href, true);
    }
  };
  const handlePrimaryActionClick = () => {
    if (!primaryAction.href) {
      setLoginModalVisible(true);
      return;
    }

    if (isBuyActionLabel(primaryAction.title) && !authStorage.hasSession()) {
      setPendingHref(primaryAction.href);
      setLoginModalVisible(true);
      return;
    }

    navigateToContent(primaryAction.href, true);
  };
  const normalizedContentType = normalizeContentTypeValue(
    String((data as { contentType?: unknown }).contentType ?? ""),
  );
  const isMediaPlayable =
    normalizedContentType === FORMAT_TYPE.VIDEO ||
    normalizedContentType === FORMAT_TYPE.AUDIO;
  const trailerUrl = data.trailerUrl?.trim() || "";
  const hasTrailer = Boolean(trailerUrl);
  const isEmbedTrailer =
    hasTrailer &&
    (isCloudflareStreamEmbedUrl(trailerUrl) ||
      isThirdPartyVideoUrl(trailerUrl));
  const TypeIcon = contentIconMap[normalizedContentType];
  const imageCandidates = useMemo(() => {
    const urls = [data.image, ...(data.imageFallbacks ?? [])]
      .map((source) => resolveImageUrl(source))
      .filter((url): url is string => Boolean(url));
    return [...new Set(urls)];
  }, [data.image, data.imageFallbacks]);
  const imageCandidatesKey = imageCandidates.join("|");
  const [imageIndex, setImageIndex] = useState(0);
  const [prevImageCandidatesKey, setPrevImageCandidatesKey] =
    useState(imageCandidatesKey);

  if (imageCandidatesKey !== prevImageCandidatesKey) {
    setPrevImageCandidatesKey(imageCandidatesKey);
    setImageIndex(0);
  }

  const uploadImageUrl =
    imageCandidates[imageIndex] ?? imageCandidates[0] ?? "";

  const handleThumbnailError = () => {
    setImageIndex((current) => {
      const nextIndex = current + 1;
      return nextIndex < imageCandidates.length ? nextIndex : current;
    });
  };

  const handlePlayTrailer = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!trailerUrl) return;

    if (isEmbedTrailer) {
      setIsTrailerPlaying(true);
      return;
    }

    setIsTrailerPlaying(true);
    const videoElement = trailerVideoRef.current;
    if (!videoElement) return;

    try {
      await videoElement.play();
    } catch {
      setIsTrailerPlaying(false);
    }
  };

  const handleTrailerEnded = () => {
    const videoElement = trailerVideoRef.current;
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
    setIsTrailerPlaying(false);
  };

  return (
    <Section $variant={variant}>
      <MonoText $use="H4_Medium">{data.sectionTitle}</MonoText>

      <ContentWrapper $isMobile={isMobile}>
        <ImageSection $isPdf={!isMediaPlayable}>
          <Badge>{data.badge}</Badge>

          {isTrailerPlaying && isEmbedTrailer ? (
            <TrailerEmbed
              src={
                isCloudflareStreamEmbedUrl(trailerUrl)
                  ? trailerUrl
                  : getThirdPartyEmbedUrl(trailerUrl)
              }
              title={data.title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <UploadBackgroundImage
                src={uploadImageUrl}
                {...DECORATIVE_IMAGE_PROPS}
              />
              <UploadImage
                src={uploadImageUrl}
                alt={data.imageAlt}
                onError={handleThumbnailError}
              />
              {hasTrailer && !isEmbedTrailer ? (
                <TrailerVideo
                  ref={trailerVideoRef}
                  src={trailerUrl}
                  controls={isTrailerPlaying}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsTrailerPlaying(true)}
                  onEnded={handleTrailerEnded}
                  style={{
                    opacity: isTrailerPlaying ? 1 : 0,
                    pointerEvents: isTrailerPlaying ? "auto" : "none",
                  }}
                />
              ) : null}
            </>
          )}

          {!isTrailerPlaying ? (
            <ImageOverlay>
              <BottomControls>
                {isMediaPlayable ? (
                  <>
                    <LeftControlButton>
                      <PlayCircleIcon />
                      {t("createProfileHome.latestUpload.video")}
                    </LeftControlButton>

                    {hasTrailer ? (
                      <RightControlButton
                        type="button"
                        onClick={handlePlayTrailer}
                        aria-label={t(
                          "createProfileHome.latestUpload.playTrailer",
                        )}
                      >
                        <PlayIcon width={24} height={24} />
                        {t("createProfileHome.latestUpload.playTrailer")}
                      </RightControlButton>
                    ) : null}
                  </>
                ) : (
                  <>
                    <LeftControlButton>
                      <TypeIcon />
                      {t(
                        `contents.contentTypeModal.options.${normalizedContentType}`,
                      )}
                    </LeftControlButton>
                  </>
                )}
              </BottomControls>
            </ImageOverlay>
          ) : null}
        </ImageSection>

        <TextSection>
          <Title>{data.title}</Title>
          <Paragraph>{data.description}</Paragraph>

          {primaryAction ? (
            <ActionButtons>
              <ReadMoreButton
                type="button"
                data-creator-content-button
                onClick={handlePrimaryActionClick}
                $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
              >
                <ActionMainText
                  $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
                >
                  {primaryAction.title}
                </ActionMainText>
                {primaryAction.subtitle ? (
                  <ActionSubText
                    $tone={
                      secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY
                    }
                  >
                    {primaryAction.subtitle}
                  </ActionSubText>
                ) : null}
              </ReadMoreButton>

              {secondaryAction ? (
                <ReadMoreButton
                  type="button"
                  data-creator-content-button
                  onClick={handleSecondaryActionClick}
                  $tone={VARIANT.SECONDARY}
                >
                  <ActionMainText $tone={VARIANT.SECONDARY}>
                    {secondaryAction.title}
                  </ActionMainText>
                  {secondaryAction.subtitle ? (
                    <ActionSubText $tone={VARIANT.SECONDARY}>
                      {secondaryAction.subtitle}
                    </ActionSubText>
                  ) : null}
                </ReadMoreButton>
              ) : null}
            </ActionButtons>
          ) : null}
        </TextSection>
      </ContentWrapper>

      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        message={
          isBuyActionLabel(primaryAction?.title ?? "")
            ? t("createProfileHome.latestUpload.loginModal.message")
            : t("createProfileHome.latestUpload.loginModal.viewMessage")
        }
        onSuccess={() => {
          if (pendingHref) {
            navigateToContent(pendingHref, true);
            setPendingHref(null);
          }
        }}
      />
    </Section>
  );
}
