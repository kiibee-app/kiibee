"use client";

import { memo, useMemo, useState, type MouseEvent } from "react";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import { LoginRequiredModal } from "@/components/UI/Modals";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { ActionRow, CardLink, VideoBox } from "./styles";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import type { ComponentType } from "react";
import type { FormatType, TutorialButton, TutorialVideo } from "@/utils/types";
import { FORMAT_TYPE } from "@/utils/types";
import { EpubIcon, VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import GenericCard from "@/components/UI/GenericCard";
import { pathPublishedContent } from "@/utils/path";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { resolveTutorialThumbnailCandidates } from "@/utils/tutorialVideoMapper";
import { useViewerPurchased } from "@/hooks/viewer/useViewerPurchased";
import { useViewerRentedData } from "@/hooks/useViewerRented";
import { RENTED_MODES } from "@/utils/viewerRented";

type TutorialCardProps = {
  tutorial: TutorialVideo;
  onPlayClick?: (videoId: string) => void;
  isSelected?: boolean;
};

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

interface OwnershipItem {
  id: string;
}

const hasItem = (
  data:
    | {
        videos?: OwnershipItem[];
        audios?: OwnershipItem[];
        pdfs?: OwnershipItem[];
        webs?: OwnershipItem[];
      }
    | undefined,
  id: string,
) => {
  if (!data) return false;
  return (
    data.videos?.some((item) => item.id === id) ||
    data.audios?.some((item) => item.id === id) ||
    data.pdfs?.some((item) => item.id === id) ||
    data.webs?.some((item) => item.id === id) ||
    false
  );
};

function TutorialCard({
  tutorial,
  onPlayClick,
  isSelected = false,
}: TutorialCardProps) {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const { navigateToContent } = useProtectedContentNavigation();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");

  const handleShowLoginModal = (url: string) => {
    setPendingRedirectUrl(url);
    setLoginModalVisible(true);
  };
  const handleCloseLoginModal = () => setLoginModalVisible(false);

  const thumbnailCandidates = useMemo(() => {
    if (tutorial.videoUrl) {
      return resolveTutorialThumbnailCandidates({
        videoUrl: tutorial.videoUrl,
        trailerUrl: tutorial.trailerUrl,
      });
    }

    const staticImage = resolveImageUrl(tutorial.image);
    return staticImage ? [staticImage] : [];
  }, [tutorial.image, tutorial.trailerUrl, tutorial.videoUrl]);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const image =
    thumbnailCandidates[thumbnailIndex] ??
    resolveImageUrl(tutorial.image) ??
    undefined;
  const imageFallback = thumbnailCandidates[thumbnailIndex + 1];

  const handleThumbnailError = () => {
    setThumbnailIndex((current) => {
      const nextIndex = current + 1;
      return nextIndex < thumbnailCandidates.length ? nextIndex : current;
    });
  };

  const FormatIcon = useMemo(() => {
    const formatType: FormatType = tutorial.formatType ?? FORMAT_TYPE.VIDEO;
    return formatIconMap[formatType];
  }, [tutorial.formatType]);

  const isLoggedIn = Boolean(user && user.id);
  const { data: purchasedData } = useViewerPurchased(isLoggedIn);
  const { sources: rentedData } = useViewerRentedData(
    RENTED_MODES.CURRENTLY,
    isLoggedIn,
  );

  const isOwned = useMemo(() => {
    if (!isLoggedIn) return false;
    return (
      hasItem(purchasedData, tutorial.id) || hasItem(rentedData, tutorial.id)
    );
  }, [isLoggedIn, purchasedData, rentedData, tutorial.id]);

  const singleTutorialHref = useMemo(
    () => pathPublishedContent(tutorial.id),
    [tutorial.id],
  );

  const buttons = useMemo(() => {
    if (isOwned) {
      return [
        {
          label: t("createProfileHome.latestUpload.seeContent"),
          variant: VARIANT.SECONDARY,
          href: singleTutorialHref,
        },
      ];
    }
    const defaultButton: TutorialButton = {
      label: t(TUTORIAL_VIDEOS.buttonFreeLabel),
      variant: VARIANT.SECONDARY,
      href: singleTutorialHref,
    };
    return tutorial.buttons?.length ? tutorial.buttons : [defaultButton];
  }, [isOwned, tutorial.buttons, t, singleTutorialHref]);

  const resolveButtonHref = (href?: string) => {
    if (!href) return singleTutorialHref;
    if (href.startsWith("/tutorial-videos")) return singleTutorialHref;
    return href;
  };

  const isCardLinked = !onPlayClick;

  const stopCardNavigation = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const openCreatorProfile = (event: MouseEvent) => {
    if (!tutorial.creatorId) return;

    event.preventDefault();
    event.stopPropagation();
    window.open(
      getPublicCreatorProfilePath(tutorial.creatorId),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleButtonClick = (event: MouseEvent, button: TutorialButton) => {
    event.preventDefault();
    event.stopPropagation();

    const isLoggedIn = Boolean(user && user.id);
    const targetHref = resolveButtonHref(button.href);

    if (button.requiresAuth && !isLoggedIn) {
      handleShowLoginModal(targetHref);
      return;
    }

    navigateToContent(targetHref, button.requiresAuth ?? false);
  };

  const creatorSubtitle = tutorial.creatorId ? (
    isCardLinked ? (
      <MonoText
        $use="Body_Medium"
        style={{ cursor: "pointer" }}
        onClick={openCreatorProfile}
      >
        {tutorial.creator}
      </MonoText>
    ) : (
      <a
        href={getPublicCreatorProfilePath(tutorial.creatorId)}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <MonoText $use="Body_Medium" style={{ cursor: "pointer" }}>
          {tutorial.creator}
        </MonoText>
      </a>
    )
  ) : (
    <MonoText $use="Body_Medium">{tutorial.creator}</MonoText>
  );

  const rentedItem = useMemo(() => {
    if (!isLoggedIn) return undefined;
    return [
      ...(rentedData?.videos ?? []),
      ...(rentedData?.audios ?? []),
      ...(rentedData?.pdfs ?? []),
      ...(rentedData?.webs ?? []),
    ].find((item) => item.id === tutorial.id);
  }, [isLoggedIn, rentedData, tutorial.id]);

  const card = (
    <GenericCard
      coverImage
      image={image}
      imageFallback={imageFallback}
      onImageError={handleThumbnailError}
      alt={tutorial.title}
      badge={
        tutorial.category ? (
          <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
            {tutorial.category}
          </MonoText>
        ) : undefined
      }
      title={<MonoText $use="Body_Medium">{tutorial.title}</MonoText>}
      subtitle={creatorSubtitle}
      footer={
        <ActionRow onClick={stopCardNavigation}>
          {buttons.map((button, index) => {
            const buttonKey = `${button.label}-${index}`;
            const commonProps = {
              type: "button" as const,
              variant: button.variant ?? VARIANT.SECONDARY,
              fullWidth: button.fullWidth,
              size: button.size,
              minWidth: button.minWidth,
            };

            if (onPlayClick) {
              return (
                <GenericButton
                  key={buttonKey}
                  {...commonProps}
                  aria-pressed={isSelected}
                  onClick={() => onPlayClick(tutorial.id)}
                >
                  {button.label}
                </GenericButton>
              );
            }

            return (
              <GenericButton
                key={buttonKey}
                {...commonProps}
                onClick={
                  button.href
                    ? (event) => handleButtonClick(event, button)
                    : button.onClick
                }
              >
                {button.label}
              </GenericButton>
            );
          })}
        </ActionRow>
      }
    >
      {rentedItem?.expiryText ? (
        <MonoText $use="Body_Medium" color={COLORS.primary.RED}>
          {rentedItem.expiryText}
        </MonoText>
      ) : null}

      {tutorial.published ? (
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
          {tutorial.published}
        </MonoText>
      ) : null}

      <VideoBox>
        <FormatIcon width={22} height={22} color={COLORS.neutral.BLACK} />
        <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
      </VideoBox>
    </GenericCard>
  );

  const loginModal = (
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
  );

  if (isCardLinked) {
    return (
      <>
        <CardLink
          href={singleTutorialHref}
          $clickable
          aria-label={tutorial.title}
        >
          {card}
        </CardLink>
        {loginModal}
      </>
    );
  }

  return (
    <>
      {card}
      {loginModal}
    </>
  );
}

export default memo(TutorialCard);
