"use client";

import { useTranslation } from "react-i18next";
import dashboardEnglishImage from "@/assets/images/dashboard-english.png";
import dashboardDanishImage from "@/assets/images/dashboard-danish.png";
import { DA } from "@/utils/common";
import { normalizeAppLanguage } from "@/utils/language";
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
  const { t, i18n } = useTranslation();
  const currentLang = normalizeAppLanguage(
    i18n.resolvedLanguage || i18n.language,
  );
  const dashboardImage =
    currentLang === DA ? dashboardDanishImage : dashboardEnglishImage;

  const points = t("creators.contentPerform.points", {
    returnObjects: true,
  }) as string[];

  return (
    <Section>
      <ContentWrapper>
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

          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <PointsList>
              {points.map((point) => (
                <PointItem key={point}>{point}</PointItem>
              ))}
            </PointsList>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay * 4}>
            <Outro as="p">{t("creators.contentPerform.outro")}</Outro>
          </ScrollReveal>
        </TextColumn>

        <ImageColumn>
          <ImageReveal
            id="cp-image-reveal"
            variant={LANDING_REVEAL_VARIANTS.slideUp}
            duration={LANDING_REVEAL.longRevealDuration}
            style={DASHBOARD_REVEAL_STYLE}
          >
            <ImageFrame>
              <DashboardImage
                key={currentLang}
                src={dashboardImage.src}
                alt={t("creators.contentPerform.imageAlt")}
              />
            </ImageFrame>
          </ImageReveal>
        </ImageColumn>
      </ContentWrapper>
    </Section>
  );
}
