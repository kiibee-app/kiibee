"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  RightControlButton,
  LeftControlButton,
  ModalContentWrapper,
  ModalDescription,
} from "./styles";
import { resolveImageUrl, MOBILE_BREAKPOINT, VARIANT } from "@/utils/Constants";
import { MonoText } from "@/components/UI/Monotext";
import { PlayCircleIcon, PlayIcon } from "@/assets/icons";
import { useIsMobile } from "@/utils/useIsMobile";
import { GenericModal } from "@/components/UI/Modals";
import { PATHS } from "@/utils/path";
import { MODAL_ALIGN } from "@/utils/ui";

type LatestUploadAction = {
  title: string;
  subtitle?: string;
};

export type LatestUploadData = {
  sectionTitle: string;
  badge: string;
  image: ImageSource;
  imageAlt: string;
  title: string;
  year: string;
  description: string;
  actions: [LatestUploadAction, LatestUploadAction?];
  imageStyle?: {
    width?: string;
    height?: string;
    padding?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
  };
  containerStyle?: {
    padding?: string;
    maxWidth?: string;
  };
};

type LatestUploadProps = {
  data: LatestUploadData;
};

export default function LatestUpload({ data }: LatestUploadProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [primaryAction, secondaryAction] = data.actions;
  const handleLogin = () => router.push(PATHS.AUTH_LOGIN);
  const handleCreateAccount = () => router.push(PATHS.AUTH_SIGNUP);

  return (
    <Section
      $padding={data.containerStyle?.padding}
      $maxWidth={data.containerStyle?.maxWidth}
    >
      <MonoText $use="H4_Medium">{data.sectionTitle}</MonoText>

      <ContentWrapper $isMobile={isMobile}>
        <ImageSection
          $width={data.imageStyle?.width}
          $height={data.imageStyle?.height}
          $padding={data.imageStyle?.padding}
          $flexDirection={data.imageStyle?.flexDirection}
          $justifyContent={data.imageStyle?.justifyContent}
          $alignItems={data.imageStyle?.alignItems}
          $gap={data.imageStyle?.gap}
        >
          <Badge>{data.badge}</Badge>

          <UploadImage src={resolveImageUrl(data.image)} alt={data.imageAlt} />

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
          <Title>{data.title}</Title>
          <Paragraph>{data.description}</Paragraph>

          <ActionButtons>
            <ReadMoreButton
              type="button"
              onClick={() => setLoginModalVisible(true)}
              $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
            >
              <ActionMainText
                $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
              >
                {primaryAction.title}
              </ActionMainText>
              {primaryAction.subtitle ? (
                <ActionSubText
                  $tone={secondaryAction ? VARIANT.PRIMARY : VARIANT.SECONDARY}
                >
                  {primaryAction.subtitle}
                </ActionSubText>
              ) : null}
            </ReadMoreButton>

            {secondaryAction ? (
              <ReadMoreButton type="button" $tone={VARIANT.SECONDARY}>
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
          <MonoText $use="Heading3">
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
