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
  heroRevealStyle,
  heroImageStyle,
} from "./styles";
import heroImg from "@/assets/images/hero3.webp";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { LANDING_REVEAL, LANDING_REVEAL_VARIANTS } from "@/utils/landingUtils";

export default function AboutHero() {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const isLoggedIn = !!user;

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
            src={heroImg}
            alt={t("how.heroAlt")}
            fill
            priority
            sizes="100vw"
            style={heroImageStyle}
          />
        </ImageReveal>
      </Background>

      <Inner>
        <Content>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
                {t("about.hero.title")}
              </MonoText>
            </Title>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Subtitle>
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
                {t("about.hero.subtitle")}
              </MonoText>
            </Subtitle>
          </ScrollReveal>

          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <CTAWrap>
              <GenericButton
                asAnchor
                href={PATHS.EXPLORE}
                variant={VARIANT.PRIMARY}
              >
                {t("about.hero.cta.explore")}
              </GenericButton>

              {!isLoggedIn && (
                <GenericButton
                  asAnchor
                  href={PATHS.AUTH_SIGNUP_CREATOR}
                  variant={VARIANT.SECONDARY}
                >
                  {t("about.hero.cta.creator")}
                </GenericButton>
              )}
            </CTAWrap>
          </ScrollReveal>
        </Content>
      </Inner>
    </Hero>
  );
}
