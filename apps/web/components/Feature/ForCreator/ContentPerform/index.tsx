"use client";

import { useTranslation } from "react-i18next";
import creatorDashboardImage from "@/assets/images/creators/creator_dashboard.webp";
import {
  Section,
  ContentWrapper,
  ImageColumn,
  ImageFrame,
  DashboardImage,
  TextColumn,
  Title,
  Intro,
  ListIntro,
  PointsList,
  PointItem,
  Outro,
} from "./styles";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

const DASHBOARD_REVEAL_STYLE = {
  width: "100%",
} as const;

export default function ContentPerform() {
  const { t } = useTranslation();
  const points = t("creators.contentPerform.points", {
    returnObjects: true,
  }) as string[];

  return (
    <Section>
      <ContentWrapper>
        <ImageColumn>
          <ImageReveal
            variant={LANDING_REVEAL_VARIANTS.slideUp}
            duration={LANDING_REVEAL.longRevealDuration}
            style={DASHBOARD_REVEAL_STYLE}
          >
            <ImageFrame>
              <DashboardImage
                src={creatorDashboardImage.src}
                alt={t("creators.contentPerform.imageAlt")}
              />
            </ImageFrame>
          </ImageReveal>
        </ImageColumn>

        <TextColumn>
          <ScrollReveal>
            <Title as="h2">{t("creators.contentPerform.title")}</Title>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Intro as="p">{t("creators.contentPerform.intro")}</Intro>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <ListIntro as="p">
              {t("creators.contentPerform.listIntro")}
            </ListIntro>
          </ScrollReveal>

          <PointsList>
            {points.map((point, index) => (
              <PointItem key={point}>
                <ScrollReveal
                  sequence={false}
                  delay={
                    LANDING_REVEAL.mediumDelay +
                    LANDING_REVEAL.ctaCardStaggerDelay +
                    index * LANDING_REVEAL.ctaCardStaggerDelay
                  }
                >
                  {point}
                </ScrollReveal>
              </PointItem>
            ))}
          </PointsList>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 4}>
            <Outro as="p">{t("creators.contentPerform.outro")}</Outro>
          </ScrollReveal>
        </TextColumn>
      </ContentWrapper>
    </Section>
  );
}
