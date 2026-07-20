"use client";

import { useState, type ComponentType, type MouseEvent } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import recentCreator from "@/assets/images/creators/recent_creator.webp";
import { EpubIcon, VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { LoginRequiredModal } from "@/components/UI/Modals";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { useViewerContentAccess } from "@/hooks/useViewerContentAccess";
import { VARIANT } from "@/utils/Constants";
import { resolveImageUrl } from "@/utils/media";
import { pathPublishedContent } from "@/utils/path";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
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
`;

type Props = {
  video: TutorialVideo;
  ownerCreatorId?: string | null;
};

export default function CollectionItemCard({ video, ownerCreatorId }: Props) {
  const { t } = useTranslation();
  const { navigateToContent } = useProtectedContentNavigation();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");
  const { user, hasAccess } = useViewerContentAccess(
    video.id,
    video.creatorId ?? ownerCreatorId,
  );

  const handleShowLoginModal = (url: string) => {
    setPendingRedirectUrl(url);
    setLoginModalVisible(true);
  };
  const handleCloseLoginModal = () => setLoginModalVisible(false);

  const FormatIcon =
    formatIconMap[video.formatType ?? FORMAT_TYPE.VIDEO] ?? VideoIcon;
  const contentHref = pathPublishedContent(video.id);
  const buttons: TutorialButton[] = hasAccess
    ? [
        {
          label: t("createProfileHome.latestUpload.seeContent"),
          variant: VARIANT.SECONDARY,
          href: contentHref,
        },
      ]
    : video.buttons?.length
      ? video.buttons
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

    const isLoggedIn = Boolean(user && user.id);
    const targetHref = button.href ?? contentHref;

    if (button.requiresAuth && !isLoggedIn) {
      handleShowLoginModal(targetHref);
      return;
    }

    navigateToContent(targetHref, button.requiresAuth ?? false);
  };

  const openCreatorProfile = (event: MouseEvent) => {
    if (!video.creatorId) return;
    stopCardNavigation(event);
    window.open(
      getPublicCreatorProfilePath(video.creatorId),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const title = <CollectionTitle>{video.title}</CollectionTitle>;
  const subtitle = video.creatorId ? (
    <CollectionAuthor
      onClick={openCreatorProfile}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
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
          fullWidth={button.fullWidth}
          onClick={(event) => handleButtonClick(event, button)}
        >
          {button.label}
        </GenericButton>
      ))}
    </FooterActions>
  ) : null;

  return (
    <>
      <CardLink href={contentHref} aria-label={video.title}>
        <GenericCard
          image={video.image}
          imageFallback={FALLBACK_THUMBNAIL_SRC}
          coverImage
          alt={video.title}
          title={title}
          subtitle={subtitle}
          badge={
            video.category?.trim() ? (
              <CollectionBadgeText>{video.category}</CollectionBadgeText>
            ) : null
          }
          footer={footer}
        >
          <CollectionTime>{video.published}</CollectionTime>

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
        onSuccess={() => {
          if (pendingRedirectUrl) {
            navigateToContent(pendingRedirectUrl, true);
            setPendingRedirectUrl("");
          }
        }}
      />
    </>
  );
}
