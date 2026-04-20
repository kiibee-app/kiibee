"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Inner, Content, Title, Background, Subtitle } from "./styles";
import type { StaticImageData } from "next/image";
import Image from "@/components/UI/SafeImage";
import valueBg from "@/assets/images/cta-buttom.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

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
          <Title>
            <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
              {title || t("value.title")}
            </MonoText>
          </Title>
          <Subtitle>
            <MonoText $use="H5_Regular" color={COLORS.primary.WHITE}>
              {subtitle || t("value.subtitle")}
            </MonoText>
          </Subtitle>
          <GenericButton asAnchor href={ctaHref || "#"} variant="primary-lite">
            {ctaText || t("value.cta")}
          </GenericButton>
        </Content>
      </Inner>
    </Section>
  );
}
