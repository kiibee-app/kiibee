"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import type { StaticImageData } from "next/image";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Background, Inner, Content, Title, Subtitle } from "./styles";
import type { CtaSectionProps } from "@/types/ctaSection";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

const DEFAULT_IMAGE_ASPECT = 1440 / 682;

function getBackgroundMeta(bgImage: CtaSectionProps["bgImage"]) {
  if (!bgImage) return null;

  if (typeof bgImage === "string") {
    return { src: bgImage, aspect: DEFAULT_IMAGE_ASPECT };
  }

  const image = bgImage as StaticImageData;
  return {
    src: image.src,
    aspect: image.width / image.height,
  };
}

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
  const background = getBackgroundMeta(bgImage);

  return (
    <Section $aspect={background?.aspect}>
      {background && (
        <Background
          $src={background.src}
          role="img"
          aria-label={t("ctaSection.bgAlt")}
        />
      )}

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
