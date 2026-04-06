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
import heroImg from "../../../../assets/images/hero3.png";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";

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
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </Background>

      <Inner>
        <Content>
          <Title>Empowering creativity. Connecting people.</Title>
          <Subtitle>
            Kiibee is a digital platform where creators share their knowledge,
            passion, and stories, and where viewers can easily discover, rent,
            or buy inspiring content.
          </Subtitle>
          <CTAWrap>
            <GenericButton asAnchor href="/explore" variant="primary">
              Explore Content
            </GenericButton>

            <GenericButton asAnchor href="/creator" variant="secondary">
              Join as Creator
            </GenericButton>
          </CTAWrap>
        </Content>
      </Inner>
    </Hero>
  );
}
