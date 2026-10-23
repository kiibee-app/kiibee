"use client";

import { useState, type ComponentType, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import recentCreator from "@/assets/images/creators/recent_creator.webp";
import { EpubIcon, VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import GenericCard from "@/components/UI/GenericCard";
import { getCategoryLabel } from "@/utils/category";
import GenericButton from "@/components/UI/GenericButton";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";
import { LoginRequiredModal } from "@/components/UI/Modals";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { useViewerContentAccess } from "@/hooks/useViewerContentAccess";
import { VARIANT } from "@/utils/Constants";
import { normalizeExternalUrl, isKiibeeUrl } from "@/utils/common";
import { resolveImageUrl } from "@/utils/media";
import { pathPublishedContent } from "@/utils/path";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import {
  isBuyActionLabel,
  isRentActionLabel,
} from "@/utils/contentPricingActions";
import { KEY_ENTER, KEY_SPACE } from "@/utils/keyboard";
import {
  FORMAT_TYPE,
  type FormatType,
  type TutorialButton,
  type TutorialVideo,
} from "@/utils/types";
import {
  CollectionAuthor,
  CollectionBadgeText,
  CollectionTime,
  CollectionTitle,
  CollectionVideoIconBox,
  CollectionVideoLabelText,
  CollectionVideoPill,
} from "./styles";
import { formatTimeAgoByLang } from "@/utils/formatDate";

type IconComponent = ComponentType<{
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}>;

const formatIconMap: Record<FormatType, IconComponent> = {
  video: VideoIcon,
  audio: AudioFileIcon,
  pdf: PdfFileIcon,
  epub: EpubIcon,
  web: WebIcon,
};

const FALLBACK_THUMBNAIL_SRC = resolveImageUrl(recentCreator);

const CardLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const FooterActions = styled.div`
  display: flex;
  width: 100%;
  gap: 0.5rem;

  > button,
  > a {
    flex: 1 1 0;
    min-width: 0;
  }
`;

type Props = {
  video: TutorialVideo;
  ownerCreatorId?: string | null;
  creatorSlug?: string | null;
  collectionId?: string | null;
  collectionSlug?: string | null;
};

export default function CollectionItemCard({
  video,
  ownerCreatorId,
  creatorSlug = null,
  collectionId = null,
  collectionSlug = null,
}: Props) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { navigateToContent } = useProtectedContentNavigation();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");
  const [loginModalMessage, setLoginModalMessage] = useState<
    string | undefined
  >(undefined);
  const { user, hasAccess } = useViewerContentAccess(
    video.id,
    video.creatorId ?? ownerCreatorId,
    collectionId,
  );

  const handleShowLoginModal = (url: string, message?: string) => {
    setPendingRedirectUrl(url);
    setLoginModalMessage(message);
    setLoginModalVisible(true);
  };
  const handleCloseLoginModal = () => {
    setLoginModalVisible(false);
    setLoginModalMessage(undefined);
  };

  const FormatIcon =
    formatIconMap[video.formatType ?? FORMAT_TYPE.VIDEO] ?? VideoIcon;
  const effectiveCollectionSlug = collectionSlug || video.collectionSlug;
  const effectiveCreatorSlug = creatorSlug || video.creatorSlug;
  const contentHref = pathPublishedContent(
    video.slug || video.id,
    effectiveCreatorSlug,
    video.title,
    effectiveCollectionSlug,
  );
  const isWebContent = video.formatType === FORMAT_TYPE.WEB;
  const webUrl =
    isWebContent && video.contentUrl
      ? normalizeExternalUrl(video.contentUrl)
      : "";
  const isKiibee = isKiibeeUrl(webUrl);
  const isDirectWebRedirect = isWebContent && Boolean(webUrl) && isKiibee;
  const cardHref = isDirectWebRedirect ? webUrl : contentHref;

  const buttons: TutorialButton[] = hasAccess
    ? [
        {
          label: t("createProfileHome.latestUpload.seeContent"),
          variant: VARIANT.SECONDARY,
          href: isWebContent && webUrl ? webUrl : contentHref,
          fullWidth: true,
        },
      ]
    : video.buttons?.length
      ? video.buttons
      : isWebContent && webUrl
        ? [
            {
              label: video.isFree
                ? t("tutorialVideos.buttonFreeLabel")
                : t("pricingLabels.buy"),
              variant: VARIANT.SECONDARY,
              href: isDirectWebRedirect ? webUrl : contentHref,
              fullWidth: true,
            },
          ]
        : [];

  const stopCardNavigation = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleButtonClick = (event: MouseEvent, button: TutorialButton) => {
    stopCardNavigation(event);

    if (button.onClick) {
      button.onClick();
      return;
    }

    const requestedHref = button.href ?? contentHref;
    const targetHref = isWebContent && !isKiibee ? contentHref : requestedHref;

    if (
      isDirectWebRedirect &&
      targetHref === webUrl
    ) {
      window.location.assign(targetHref);
      return;
    }

    const isLoggedIn = Boolean(user && user.id);

    if (button.requiresAuth && !isLoggedIn) {
      const isPurchaseOrRent =
        isBuyActionLabel(button.label) || isRentActionLabel(button.label);
      if (isPurchaseOrRent) {
        navigateToContent(targetHref);
        return;
      }

      const msg = t("createProfileHome.latestUpload.loginModal.viewMessage");

      handleShowLoginModal(targetHref, msg);
      return;
    }

    if (!isWebContent && /^https?:\/\//i.test(targetHref)) {
      window.location.assign(targetHref);
      return;
    }

    navigateToContent(targetHref);
  };

  const openCreatorProfile = (event: MouseEvent) => {
    if (!effectiveCreatorSlug) return;
    stopCardNavigation(event);
    router.push(getPublicCreatorProfilePath(effectiveCreatorSlug));
  };

  const title = <CollectionTitle>{video.title}</CollectionTitle>;
  const subtitle = effectiveCreatorSlug ? (
    <CollectionAuthor
      onClick={openCreatorProfile}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === KEY_ENTER || event.key === KEY_SPACE) {
          openCreatorProfile(event as unknown as MouseEvent);
        }
      }}
      style={{ cursor: "pointer" }}
    >
      {video.creator}
    </CollectionAuthor>
  ) : (
    <CollectionAuthor>{video.creator}</CollectionAuthor>
  );
  const footer = buttons.length ? (
    <FooterActions onClick={stopCardNavigation}>
      {buttons.map((button, index) => (
        <GenericButton
          key={`${button.label}-${index}`}
          type="button"
          variant={button.variant ?? VARIANT.SOFT_OUTLINE}
          fullWidth={buttons.length > 1 || button.fullWidth}
          onClick={(event) => handleButtonClick(event, button)}
        >
          {button.label}
        </GenericButton>
      ))}
    </FooterActions>
  ) : null;

  return (
    <>
      <CardLink
        href={cardHref}
        aria-label={video.title}
        onClick={
          isDirectWebRedirect
            ? (event) => {
                event.preventDefault();
                window.location.assign(webUrl);
              }
            : undefined
        }
      >
        <GenericCard
          image={video.image}
          imageFallback={FALLBACK_THUMBNAIL_SRC}
          coverImage
          imageAspectRatio={GENERIC_CARD_LAYOUT.IMAGE_ASPECT_RATIO}
          minHeight={GENERIC_CARD_LAYOUT.CONTENT_MIN_HEIGHT}
          alt={video.title}
          title={title}
          subtitle={subtitle}
          meta={
            <CollectionTime>
              {video.published
                ? formatTimeAgoByLang(video.published, i18n.language)
                : ""}
            </CollectionTime>
          }
          badge={
            video.category?.trim() ? (
              <CollectionBadgeText>
                {getCategoryLabel(video.category, t)}
              </CollectionBadgeText>
            ) : null
          }
          footer={footer}
        >
          <CollectionVideoPill>
            <CollectionVideoIconBox>
              <FormatIcon width={10} height={10} />
            </CollectionVideoIconBox>
            <CollectionVideoLabelText>
              {video.formatLabel}
            </CollectionVideoLabelText>
          </CollectionVideoPill>
        </GenericCard>
      </CardLink>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        message={loginModalMessage}
        onSuccess={() => {
          if (pendingRedirectUrl) {
            navigateToContent(pendingRedirectUrl);
            setPendingRedirectUrl("");
          }
        }}
      />
    </>
  );
}
