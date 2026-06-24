"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { PATHS } from "@/utils/path";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import type { TutorialVideo } from "@/utils/types";
import logo from "@/assets/images/logo.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import { TUTORIAL_VIDEOS } from "@/utils/translationKeys";
import {
  VARIANT,
  ADMISSION_REQUIREMENT_FREE,
  ACCESS_TYPE_FREE,
} from "@/utils/Constants";
import CollectionItems from "./CollectionItems";
import { GenericModal } from "@/components/UI/Modals";
import { MonoText } from "@/components/UI/Monotext";
import { MODAL_ALIGN } from "@/utils/ui";
import {
  ModalContentWrapper,
  ModalDescription,
} from "@/components/Feature/ProfileLayout/shared/LatestUpload/styles";

type Props = {
  tutorial: TutorialVideo;
  relatedVideos?: TutorialVideo[];
  collectionId?: string;
};

export default function SingleTutorial({
  tutorial,
  relatedVideos = [],
  collectionId,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useStoredLoginUser();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const handleShowLoginModal = () => setLoginModalVisible(true);
  const handleCloseLoginModal = () => setLoginModalVisible(false);
  const handleLoginRedirect = () => {
    const next = encodeURIComponent(
      window.location.pathname + window.location.search,
    );
    router.push(`${PATHS.AUTH_LOGIN}?next=${next}`);
  };
  const handleCreateAccount = () => router.push(PATHS.AUTH_SIGNUP);

  const handleSeeContent = () => {
    const isPaid = tutorial.level !== ADMISSION_REQUIREMENT_FREE;
    const isLoggedIn = Boolean(user && user.id);
    if (isPaid && !isLoggedIn) {
      handleShowLoginModal();
    }
  };
  const freeLabel = t(TUTORIAL_VIDEOS.buttonFreeLabel);
  const isFreeContent = useMemo(() => {
    if (tutorial.isFree != null) {
      return tutorial.isFree;
    }

    const firstButtonLabel = tutorial.buttons?.[0]?.label?.trim().toLowerCase();
    return (
      !tutorial.buttons?.length ||
      firstButtonLabel === ACCESS_TYPE_FREE ||
      firstButtonLabel === freeLabel.trim().toLowerCase()
    );
  }, [freeLabel, tutorial.buttons, tutorial.isFree]);
  const primaryActions = useMemo(() => {
    if (isFreeContent) {
      return undefined;
    }

    return (tutorial.buttons ?? []).map((button) => {
      const normalizedLabel = button.label.toLowerCase();
      const isBuy = normalizedLabel.includes("buy");
      const isRent = normalizedLabel.includes("rent");

      return {
        label: button.label,
        subtitle: isBuy
          ? t("singleContent.pricing.downloadFiles")
          : isRent
            ? t("singleContent.pricing.accessDefault")
            : undefined,
        variant: isBuy ? VARIANT.PRIMARY : VARIANT.SOFT_OUTLINE,
        onClick: button.onClick,
        disabled: false,
      };
    });
  }, [isFreeContent, t, tutorial.buttons]);

  return (
    <>
      <SingleContentPage
        title={tutorial.title}
        descriptions={[
          tutorial.focus,
          t("singleTutorial.descriptionSecondary"),
        ]}
        tags={[tutorial.category, t("singleTutorial.tags.tutorials")]}
        creator={{
          id: tutorial.creatorId,
          name: tutorial.creator,
          avatar: logo,
        }}
        hero={{
          image: tutorial.image,
          imageAlt: tutorial.title,
          categoryLabel: tutorial.category,
          mediaLabel: tutorial.formatLabel,
          mediaIcon: playCircleIcon,
          mediaIconAlt: "Play circle",
          trailerLabel: t("singleTutorial.playTrailer"),
          trailerIcon: playIcon,
          trailerIconAlt: "Play",
        }}
        primaryAction={
          isFreeContent
            ? {
                label: t("singleTutorial.seeContent"),
                onClick: handleSeeContent,
              }
            : undefined
        }
        primaryActions={primaryActions}
        metaItems={[
          {
            label: t("singleTutorial.meta.publishedLabel"),
            value: tutorial.published,
          },
          {
            label: t("singleTutorial.meta.publishedByLabel"),
            value: <strong>{tutorial.creator}</strong>,
          },
          {
            label: t("singleTutorial.meta.durationLabel"),
            value: t("singleTutorial.meta.durationValue"),
          },
        ]}
        shareLabel={t("common.share")}
      >
        {relatedVideos.length ? (
          <CollectionItems videos={relatedVideos} collectionId={collectionId} />
        ) : null}
      </SingleContentPage>

      <GenericModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onCancel={handleLoginRedirect}
        onConfirm={handleCreateAccount}
        cancelLabel={t("createProfileHome.latestUpload.loginModal.cancelLabel")}
        confirmLabel={t(
          "createProfileHome.latestUpload.loginModal.confirmLabel",
        )}
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
    </>
  );
}
