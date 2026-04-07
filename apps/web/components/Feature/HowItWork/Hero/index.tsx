"use client";

import React from "react";
import Image from "next/image";
import {
  Hero,
  Background,
  Inner,
  Content,
  Title,
  Subtitle,
  CTAWrap,
} from "./styles";
import heroImg from "../../../../assets/images/hero2.png";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";

export default function HowHero() {
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
          <Title>{t("how.title")}</Title>
          <Subtitle>{t("how.subtitle")}</Subtitle>
          <CTAWrap>
            <GenericButton asAnchor href="#" variant="primary">
              {t("how.cta")}
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
