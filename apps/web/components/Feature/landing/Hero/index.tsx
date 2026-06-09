"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { HERO } from "@/utils/translationKeys";
import {
  Hero,
  Inner,
  Content,
  Title,
  Subtitle,
  CTAWrap,
  Background,
  heroImageStyle,
  heroRevealStyle,
} from "./styles";
import Image from "@/components/UI/SafeImage";
import hero from "@/assets/images/hero-background.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import { IMAGE_SIZES } from "@/utils/landingShared";
import {
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingUtils";

export default function HeroSection() {
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
          style={heroRevealStyle}
        >
          <Image
            src={hero}
            alt={t(HERO.heroAlt)}
            fill={LANDING_IMAGE_FLAGS.fill}
            priority={LANDING_IMAGE_FLAGS.priority}
            sizes={IMAGE_SIZES.fullViewport}
            style={heroImageStyle}
          />
        </ImageReveal>
      </Background>
      <Inner>
        <Content>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
                {t(HERO.title)}
              </MonoText>
            </Title>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Subtitle>
              <MonoText $use="H5_Regular" color={COLORS.primary.WHITE_90}>
                {t(HERO.subtitle)}
              </MonoText>
            </Subtitle>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <CTAWrap>
              <GenericButton
                asAnchor
                href={PATHS.AUTH_SIGNUP}
                variant={VARIANT.PRIMARY}
              >
                {t(HERO.cta)}
              </GenericButton>
            </CTAWrap>
          </ScrollReveal>
        </Content>
      </Inner>
    </Hero>
  );
}
