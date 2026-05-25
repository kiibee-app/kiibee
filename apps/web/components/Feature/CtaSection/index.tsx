"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "@/components/UI/SafeImage";
import GenericButton from "@/components/UI/GenericButton";
import {
  Section,
  Background,
  Inner,
  Content,
  Title,
  Subtitle,
  ctaSectionBackgroundImageStyle,
} from "./styles";
import type { CtaSectionProps } from "@/types/ctaSection";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_IMAGE_FLAGS } from "@/utils/landingUtils";
import { LANDING_REVEAL } from "@/utils/landingUtils";

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
            fill={LANDING_IMAGE_FLAGS.fill}
            priority={LANDING_IMAGE_FLAGS.priority}
            style={ctaSectionBackgroundImageStyle}
          />
        )}
      </Background>

      <Inner>
        <Content>
          <ScrollReveal>
            <Title>{title}</Title>
          </ScrollReveal>

          {subtitle && (
            <ScrollReveal delay={LANDING_REVEAL.ctaSubtitleDelay}>
              <Subtitle>{subtitle}</Subtitle>
            </ScrollReveal>
          )}

          {subtitleLines &&
            subtitleLines.map((line, index) => (
              <ScrollReveal
                key={index}
                delay={
                  LANDING_REVEAL.ctaSubtitleDelay +
                  index * LANDING_REVEAL.ctaSubtitleStepDelay
                }
              >
                <Subtitle>{line}</Subtitle>
              </ScrollReveal>
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
