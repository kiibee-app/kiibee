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
} from "./styles";
import Image from "next/image";
import hero from "@/assets/images/hero-background.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <Hero>
      <Background>
        <Image
          src={hero}
          alt={t(HERO.heroAlt)}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </Background>
      <Inner>
        <Content>
          <Title>
            <MonoText $use="Heading1" color={COLORS.primary.WHITE}>
              {t(HERO.title)}
            </MonoText>
          </Title>
          <Subtitle>
            <MonoText $use="H5_Regular" color={COLORS.primary.WHITE_90}>
              {t(HERO.subtitle)}
            </MonoText>
          </Subtitle>

          <CTAWrap>
            <GenericButton asAnchor href="#" variant="primary">
              {t(HERO.cta)}
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
