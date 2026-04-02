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
  Primary,
  Background,
} from "./styles";
import Image from "next/image";
import hero from "../../../assets/images/hero-background.png";

export default function HeroSection() {
  const { t } = useTranslation();
  return (
    <Hero>
      <Background>
        <Image
          src={hero}
          alt="Hero background"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>
      <Inner>
        <Content>
          <Title>{t("hero.title")}</Title>
          <Subtitle>{t("hero.subtitle")}</Subtitle>

          <CTAWrap>
            <Primary href="#">{t("hero.cta")}</Primary>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
