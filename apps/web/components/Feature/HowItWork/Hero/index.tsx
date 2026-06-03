"use client";

import React from "react";
import Image from "@/components/UI/SafeImage";
import {
  Hero,
  Background,
  Inner,
  Content,
  Title,
  Subtitle,
  CTAWrap,
} from "./styles";
import heroImg from "@/assets/images/hero2.webp";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function HowHero() {
  const { t } = useTranslation();

  return (
    <Hero>
      <Background>
        <ImageReveal
          variant={LANDING_REVEAL_VARIANTS.kenBurns}
          delay={0}
          duration={LANDING_REVEAL.heroKenBurnsDuration}
          start={LANDING_REVEAL.heroStart}
          noClip
        >
          <Image
            src={heroImg}
            alt={t("how.heroAlt")}
            fill
            priority
            sizes="100vw"
          />
        </ImageReveal>
      </Background>

      <Inner>
        <Content>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading1">{t("how.title")}</MonoText>
            </Title>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Subtitle>
              <MonoText $use="H5_Medium">{t("how.subtitle")}</MonoText>
            </Subtitle>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <CTAWrap>
              <GenericButton
                asAnchor
                href={PATHS.EXPLORE}
                variant={VARIANT.PRIMARY}
              >
                {t("how.cta")}
              </GenericButton>
            </CTAWrap>
          </ScrollReveal>
        </Content>
      </Inner>
    </Hero>
  );
}
