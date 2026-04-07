"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import creatorsStoryImage from "../../../../../assets/images/creators/678d923e2e28b14f2986cc4127abeb6348d4937c.jpg";
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

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default function ShortStory() {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const isMobile = width < 860;

  return (
    <Section>
      <ContentWrapper $isMobile={isMobile}>
        <ImageSection>
          <StoryImage
            src={creatorsStoryImage.src}
            alt={t("creators.shortStory.imageAlt")}
          />
        </ImageSection>

        <TextSection>
          <Title $isMobile={isMobile}>{t("creators.shortStory.title")}</Title>

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
