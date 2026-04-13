"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import creatorsStoryImage from "@/assets/images/creators/678d923e2e28b14f2986cc4127abeb6348d4937c.jpg";
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

export default function ShortStory() {
  const { t } = useTranslation();

  return (
    <Section>
      <ContentWrapper>
        <ImageSection>
          <StoryImage
            src={creatorsStoryImage.src}
            alt={t("creators.shortStory.imageAlt")}
          />
        </ImageSection>

        <TextSection>
          <Title>{t("creators.shortStory.title")}</Title>

          <Paragraph>{t("creators.shortStory.lead")}</Paragraph>
          <Paragraph>{t("creators.shortStory.body")}</Paragraph>

          <ReadMoreButton type="button">
            {t("creators.shortStory.cta")}
          </ReadMoreButton>
        </TextSection>
      </ContentWrapper>
    </Section>
  );
}
