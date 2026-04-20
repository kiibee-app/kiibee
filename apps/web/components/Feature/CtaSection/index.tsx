"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "@/components/UI/SafeImage";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Background, Inner, Content, Title, Subtitle } from "./styles";
import type { CtaSectionProps } from "@/types/ctaSection";

export default function CtaSection({
  bgImage,
  title,
  subtitle,
  subtitleLines,
  ctaText,
  ctaHref,
}: CtaSectionProps) {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        {bgImage && (
          <Image
            src={bgImage}
            alt={t("ctaSection.bgAlt")}
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        )}
      </Background>

      <Inner>
        <Content>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {subtitleLines &&
            subtitleLines.map((line, index) => (
              <Subtitle key={index}>{line}</Subtitle>
            ))}
          {ctaText && (
            <GenericButton
              asAnchor
              href={ctaHref || "#"}
              variant="primary-lite"
            >
              {ctaText}
            </GenericButton>
          )}
        </Content>
      </Inner>
    </Section>
  );
}
