"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import {
  Section,
  Inner,
  Content,
  Title,
  Background,
  Subtitle,
  valueStatementImageStyle,
  valueStatementRevealStyle,
} from "./styles";
import Image from "@/components/UI/SafeImage";
import valueBg from "@/assets/images/cta-buttom.webp";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { VARIANT } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import ImageReveal from "@/components/UI/ImageReveal";
import { type ValueStatementProps } from "@/utils/landingShared";
import { LANDING_REVEAL } from "@/utils/landingUtils";
import {
  LANDING_IMAGE_FLAGS,
  LANDING_REVEAL_VARIANTS,
} from "@/utils/landingUtils";

export default function ValueStatement({
  bgImage,
  title,
  subtitle,
  ctaText,
  ctaHref,
}: ValueStatementProps) {
  const { t } = useTranslation();

  return (
    <Section>
      <Background>
        <ImageReveal
          variant={LANDING_REVEAL_VARIANTS.fadeScale}
          duration={LANDING_REVEAL.extraLongRevealDuration}
          style={valueStatementRevealStyle}
        >
          <Image
            src={bgImage || valueBg}
            alt={t("value.bgAlt")}
            fill={LANDING_IMAGE_FLAGS.fill}
            priority={LANDING_IMAGE_FLAGS.priority}
            style={valueStatementImageStyle}
          />
        </ImageReveal>
      </Background>

      <Inner>
        <Content>
          <ScrollReveal>
            <Title>
              <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
                {title || t("value.title")}
              </MonoText>
            </Title>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
            <Subtitle>
              <MonoText $use="H5_Regular" color={COLORS.primary.WHITE}>
                {subtitle || t("value.subtitle")}
              </MonoText>
            </Subtitle>
          </ScrollReveal>
          <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
            <GenericButton
              asAnchor
              href={ctaHref ?? PATHS.AUTH_SIGNUP}
              variant={VARIANT.PRIMARY_LITE}
            >
              {ctaText || t("value.cta")}
            </GenericButton>
          </ScrollReveal>
        </Content>
      </Inner>
    </Section>
  );
}
