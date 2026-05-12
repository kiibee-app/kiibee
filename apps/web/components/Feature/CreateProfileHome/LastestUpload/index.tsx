"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
} from "./styles";
import { resolveImageUrl, MOBILE_BREAKPOINT } from "@/utils/Constants";
import { useIsMobile } from "@/utils/useIsMobile";
import { MonoText } from "@/components/UI/Monotext";
import { PlayCircleIcon, PlayIcon } from "@/assets/icons";

export default function LastestUpload() {
  const { t } = useTranslation();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);

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

          <ReadMoreButton type="button">
            <span>{t("createProfileHome.latestUpload.readMore")}</span>
            <span>{t("createProfileHome.latestUpload.access")}</span>
          </ReadMoreButton>
        </TextSection>
      </ContentWrapper>
    </Section>
  );
}
