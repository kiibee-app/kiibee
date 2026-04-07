"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Inner, Content, Title, Background, Subtitle } from "./styles";
import Image, { StaticImageData } from "next/image";
import valueBg from "../../../../assets/images/cta-buttom.png";
import GenericButton from "../../../UI/GenericButton";

type Props = {
  bgImage?: StaticImageData;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function ValueStatement({
  bgImage,
  title,
  subtitle,
  ctaText,
  ctaHref,
}: Props) {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <Image
          src={bgImage || valueBg}
          alt={t("value.bgAlt")}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </Background>

      <Inner>
        <Content>
          <Title>{title || t("value.title")}</Title>
          <Subtitle>{subtitle || t("value.subtitle")}</Subtitle>
          <GenericButton asAnchor href={ctaHref || "#"} variant="primary-lite">
            {ctaText || t("value.cta")}
          </GenericButton>
        </Content>
      </Inner>
    </Section>
  );
}
