"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "@/components/UI/SafeImage";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Background, Inner, Content, Title, Subtitle } from "./styles";
import type { CtaSectionProps } from "@/types/ctaSection";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";

export default function CtaSection({
  bgImage,
  title,
  subtitle,
  subtitleLines,
  ctaText,
  ctaHref,
}: CtaSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();

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
              type="button"
              onClick={() => router.push(ctaHref ?? PATHS.AUTH_SIGNUP)}
              variant={VARIANT.PRIMARY_LITE}
            >
              {ctaText}
            </GenericButton>
          )}
        </Content>
      </Inner>
    </Section>
  );
}
