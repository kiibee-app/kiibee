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
} from "./styles";
import { resolveImageUrl, MOBILE_BREAKPOINT } from "@/utils/Constants";
import { useIsMobile } from "@/utils/useIsMobile";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function ShortStory() {
  const { t } = useTranslation();
  const isMobile = useIsMobile(MOBILE_BREAKPOINT);

  return (
    <Section>
      <ContentWrapper $isMobile={isMobile}>
        <ImageSection>
          <ImageReveal
            id="short-story-image-reveal"
            variant={LANDING_REVEAL_VARIANTS.slideUp}
            duration={LANDING_REVEAL.longRevealDuration}
          >
            <StoryImage
              src={resolveImageUrl(creatorsStoryImage)}
              alt={t(CREATORS.shortStory.imageAlt)}
            />
          </ImageReveal>
        </ImageSection>

        <TextSection>
          <ScrollReveal>
            <Title $isMobile={isMobile}>{t(CREATORS.shortStory.title)}</Title>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Paragraph>{t(CREATORS.shortStory.lead)}</Paragraph>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <Paragraph>{t(CREATORS.shortStory.body)}</Paragraph>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 3}>
            <ReadMoreButton asAnchor href={PATHS.ABOUT}>
              {t(CREATORS.shortStory.cta)}
            </ReadMoreButton>
          </ScrollReveal>
        </TextSection>
      </ContentWrapper>
    </Section>
  );
}
