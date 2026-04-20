"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
import { VARIANT } from "@/utils/Constants";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <Hero>
      <Background>
        <Image
          src={hero}
          alt={t("hero.heroAlt")}
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
              {t("hero.title")}
            </MonoText>
          </Title>
          <Subtitle>
            <MonoText $use="H5_Regular" color={COLORS.primary.WHITE_90}>
              {t("hero.subtitle")}
            </MonoText>
          </Subtitle>

          <CTAWrap>
            <GenericButton asAnchor href="#" variant={VARIANT.PRIMARY}>
              {t("hero.cta")}
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
