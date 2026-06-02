"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Inner, Heading, Sub, CTAWrap } from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { BG_GREEN, VARIANT, type BgVariant } from "@/utils/Constants";
import { PATHS } from "@/utils/path";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

type GetStartedProps = {
  translationPrefix?: string;
  bgVariant?: BgVariant;
};

export default function GetStarted({
  translationPrefix = "how.getStarted",
  bgVariant = BG_GREEN,
}: GetStartedProps) {
  const { t } = useTranslation();

  return (
    <Section $bgVariant={bgVariant}>
      <Inner>
        <ScrollReveal>
          <Heading>
            <MonoText $use="Heading2">
              {t(`${translationPrefix}.heading`)}
            </MonoText>
          </Heading>
        </ScrollReveal>

        <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
          <Sub>
            <MonoText $use="H5_Regular">
              {t(`${translationPrefix}.sub`)}
            </MonoText>
          </Sub>
        </ScrollReveal>

        <ScrollReveal delay={LANDING_REVEAL.mediumDelay}>
          <CTAWrap>
            <GenericButton
              asAnchor
              href={PATHS.TUTORIAL_VIDEOS}
              variant={VARIANT.PRIMARY}
            >
              {t(`${translationPrefix}.tutorial`)}
            </GenericButton>
            <GenericButton
              asAnchor
              href={PATHS.TUTORIAL_VIDEOS}
              variant={VARIANT.SECONDARY}
            >
              {t(`${translationPrefix}.guide`)}
            </GenericButton>
          </CTAWrap>
        </ScrollReveal>
      </Inner>
    </Section>
  );
}
