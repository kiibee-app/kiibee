"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import lastestImage from "@/assets/images/creators/recent_creator1.webp";
import {
  Section,
  ContentWrapper,
  ImageSection,
  TextSection,
  Title,
  Paragraph,
  ReadMoreButton,
  Badge,
  ImageOverlay,
  BottomControls,
  UploadImage,
  RightControlButton,
  LeftControlButton,
  ModalContentWrapper,
  ModalDescription,
} from "./styles";
import { resolveImageUrl, MOBILE_BREAKPOINT } from "@/utils/Constants";
import { useIsMobile } from "@/utils/useIsMobile";
import { MonoText } from "@/components/UI/Monotext";
import { PlayCircleIcon, PlayIcon } from "@/assets/icons";
import { GenericModal } from "@/components/UI/Modals";
import { PATHS } from "@/utils/path";
import { MODAL_ALIGN } from "@/utils/ui";

export default function LastestUpload() {
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const handleLogin = () => router.push(PATHS.AUTH_LOGIN);
  const handleCreateAccount = () => router.push(PATHS.AUTH_SIGNUP);

  return (
    <Section>
      <MonoText $use="H4_Medium">
        {t("createProfileHome.latestUpload.title")}
      </MonoText>

      <ContentWrapper $isMobile={isMobile}>
        <ImageSection>
          <Badge>{t("createProfileHome.latestUpload.badge")}</Badge>

          <UploadImage
            src={resolveImageUrl(lastestImage)}
            alt={t("createProfileHome.latestUpload.imageAlt")}
          />

          <ImageOverlay>
            <BottomControls>
              <LeftControlButton>
                <PlayCircleIcon />
                {t("createProfileHome.latestUpload.video")}
              </LeftControlButton>

              <RightControlButton>
                <PlayIcon width={24} height={24} />
                {t("createProfileHome.latestUpload.playTrailer")}
              </RightControlButton>
            </BottomControls>
          </ImageOverlay>
        </ImageSection>

        <TextSection>
          <Title>{t("createProfileHome.latestUpload.titleText")}</Title>

          <Paragraph>
            {t("createProfileHome.latestUpload.description")}
          </Paragraph>

          <ReadMoreButton
            type="button"
            onClick={() => setLoginModalVisible(true)}
          >
            <span>{t("createProfileHome.latestUpload.readMore")}</span>
            <span>{t("createProfileHome.latestUpload.access")}</span>
          </ReadMoreButton>
        </TextSection>
      </ContentWrapper>

      <GenericModal
        visible={isLoginModalVisible}
        onClose={() => setLoginModalVisible(false)}
        onCancel={handleLogin}
        onConfirm={handleCreateAccount}
        cancelLabel={t("createProfileHome.latestUpload.loginModal.cancelLabel")}
        confirmLabel={t(
          "createProfileHome.latestUpload.loginModal.confirmLabel",
        )}
        buttonRow
        buttonAlign={MODAL_ALIGN.CENTER}
        fullWidthButtons={false}
        size="md"
        height={isMobile ? "400px" : "570.941px"}
        spacing="start"
        showCloseButton
      >
        <ModalContentWrapper>
          <MonoText $use="H5_Medium">
            {t("createProfileHome.latestUpload.loginModal.title")}
          </MonoText>
          <ModalDescription $use="Body_Medium">
            {t("createProfileHome.latestUpload.loginModal.message")}
          </ModalDescription>
        </ModalContentWrapper>
      </GenericModal>
    </Section>
  );
}
