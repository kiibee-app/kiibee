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
import heroImg from "@/assets/images/hero3.webp";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";

export default function AboutHero() {
  const { t } = useTranslation();

  return (
    <Hero>
      <Background>
        <Image
          src={heroImg}
          alt={t("how.heroAlt")}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </Background>

      <Inner>
        <Content>
          <Title>
            <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
              {t("about.hero.title")}
            </MonoText>
          </Title>
          <Subtitle>
            <MonoText $use="Body_Medium" color={COLORS.primary.WHITE}>
              {t("about.hero.subtitle")}
            </MonoText>
          </Subtitle>
          <CTAWrap>
            <GenericButton asAnchor href="/explore" variant={VARIANT.PRIMARY}>
              {t("about.hero.cta.explore")}
            </GenericButton>

            <GenericButton asAnchor href="/creator" variant={VARIANT.SECONDARY}>
              {t("about.hero.cta.creator")}
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
