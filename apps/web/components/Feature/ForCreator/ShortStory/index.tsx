"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CREATORS } from "@/utils/translationKeys";
import creatorsStoryImage from "@/assets/images/creators/678d923e2e28b14f2986cc4127abeb6348d4937c.webp";
import {
  Section,
  ContentWrapper,
  ImageSection,
  StoryImage,
  TextSection,
  Title,
  Paragraph,
  ReadMoreButton,
} from "./style";
import { resolveImageUrl, MOBILE_BREAKPOINT } from "@/utils/Constants";
import { useIsMobile } from "@/utils/useIsMobile";

export default function ShortStory() {
  const { t } = useTranslation();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);

  return (
    <Section>
      <ContentWrapper $isMobile={isMobile}>
        <ImageSection>
          <StoryImage
            src={resolveImageUrl(creatorsStoryImage)}
            alt={t(CREATORS.shortStory.imageAlt)}
          />
        </ImageSection>

        <TextSection>
          <Title $isMobile={isMobile}>{t(CREATORS.shortStory.title)}</Title>

          <Paragraph>{t(CREATORS.shortStory.lead)}</Paragraph>
          <Paragraph>{t(CREATORS.shortStory.body)}</Paragraph>

          <ReadMoreButton type="button">
            {t(CREATORS.shortStory.cta)}
          </ReadMoreButton>
        </TextSection>
      </ContentWrapper>
    </Section>
  );
}
