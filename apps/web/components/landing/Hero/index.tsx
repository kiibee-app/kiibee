"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Hero, Inner, Content, Title, Subtitle, CTAWrap } from "./styles";
import Image from "next/image";
import hero from "../../../assets/images/hero.png";
import GenericButton from "../../UI/GenericButton";
import { Background } from "./styles";


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
            <GenericButton asAnchor href="#" variant="primary">
              {t("hero.cta")}
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
