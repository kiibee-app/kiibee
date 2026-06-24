"use client";

import { memo, useMemo, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { resolveImageUrl, VARIANT } from "@/utils/Constants";
import { GenericModal } from "@/components/UI/Modals";
import { MODAL_ALIGN } from "@/utils/ui";
import { PATHS } from "@/utils/path";
import {
  ModalContentWrapper,
  ModalDescription,
} from "@/components/Feature/ProfileLayout/shared/LatestUpload/styles";
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
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";

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

function TutorialCard({
  tutorial,
  onPlayClick,
  isSelected = false,
}: TutorialCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useStoredLoginUser();
  const { navigateToContent } = useProtectedContentNavigation();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");

  const handleShowLoginModal = (url: string) => {
    setPendingRedirectUrl(url);
    setLoginModalVisible(true);
  };
  const handleCloseLoginModal = () => setLoginModalVisible(false);
  const handleLoginRedirect = () => {
    const next = encodeURIComponent(
      pendingRedirectUrl || window.location.pathname + window.location.search,
    );
    router.push(`${PATHS.AUTH_LOGIN}?next=${next}`);
  };
  const handleCreateAccount = () => router.push(PATHS.AUTH_SIGNUP);

  const imageUrl = useMemo(
    () => resolveImageUrl(tutorial.image),
    [tutorial.image],
  );

  const FormatIcon = useMemo(() => {
    const formatType: FormatType = tutorial.formatType ?? FORMAT_TYPE.VIDEO;
    return formatIconMap[formatType];
  }, [tutorial.formatType]);

  const singleTutorialHref = useMemo(
    () => pathPublishedContent(tutorial.id),
    [tutorial.id],
  );

  const buttons = useMemo(() => {
    const defaultButton: TutorialButton = {
      label: t(TUTORIAL_VIDEOS.buttonFreeLabel),
      variant: VARIANT.SECONDARY,
      href: singleTutorialHref,
    };
    return tutorial.buttons?.length ? tutorial.buttons : [defaultButton];
  }, [tutorial.buttons, t, singleTutorialHref]);

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

  const card = (
    <GenericCard
      coverImage
      image={imageUrl}
      imageFallback={tutorial.imageFallback}
      badge={
        <MonoText $use="Body_Bold" color={COLORS.neutral.GRAY}>
          {tutorial.category}
        </MonoText>
      }
      title={<MonoText $use="H5_Medium">{tutorial.title}</MonoText>}
      subtitle={creatorSubtitle}
      footer={
        <ActionRow onClick={stopCardNavigation}>
          {buttons.map((button, index) =>
            onPlayClick ? (
              <GenericButton
                key={`${button.label}-${index}`}
                type="button"
                variant={button.variant ?? VARIANT.SECONDARY}
                fullWidth={button.fullWidth}
                size={button.size}
                minWidth={button.minWidth}
                aria-pressed={isSelected}
                onClick={() => onPlayClick(tutorial.id)}
              >
                {button.label}
              </GenericButton>
            ) : button.href ? (
              <GenericButton
                key={`${button.label}-${index}`}
                type="button"
                variant={button.variant ?? VARIANT.SECONDARY}
                fullWidth={button.fullWidth}
                size={button.size}
                minWidth={button.minWidth}
                onClick={(event) => handleButtonClick(event, button)}
              >
                {button.label}
              </GenericButton>
            ) : (
              <GenericButton
                key={`${button.label}-${index}`}
                type="button"
                variant={button.variant ?? VARIANT.SECONDARY}
                fullWidth={button.fullWidth}
                size={button.size}
                minWidth={button.minWidth}
                onClick={button.onClick}
              >
                {button.label}
              </GenericButton>
            ),
          )}
        </ActionRow>
      }
    >
      <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
        {tutorial.published}
      </MonoText>

      <VideoBox>
        <FormatIcon width={22} height={22} color={COLORS.neutral.BLACK} />
        <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
      </VideoBox>
    </GenericCard>
  );

  const loginModal = (
    <GenericModal
      visible={isLoginModalVisible}
      onClose={handleCloseLoginModal}
      onCancel={handleLoginRedirect}
      onConfirm={handleCreateAccount}
      cancelLabel={t("createProfileHome.latestUpload.loginModal.cancelLabel")}
      confirmLabel={t("createProfileHome.latestUpload.loginModal.confirmLabel")}
      buttonRow
      buttonAlign={MODAL_ALIGN.CENTER}
      fullWidthButtons={false}
      size="md"
      spacing="start"
      showCloseButton
    >
      <ModalContentWrapper>
        <MonoText $use="Heading3">
          {t("createProfileHome.latestUpload.loginModal.title")}
        </MonoText>
        <ModalDescription $use="Body_Medium">
          {t("createProfileHome.latestUpload.loginModal.message")}
        </ModalDescription>
      </ModalContentWrapper>
    </GenericModal>
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
