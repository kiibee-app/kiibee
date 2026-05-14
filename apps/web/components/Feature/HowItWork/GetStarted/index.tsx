"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Inner, Heading, Sub, CTAWrap } from "./styles";
import { MonoText } from "@/components/UI/Monotext";
import { BG_GREEN, VARIANT, type BgVariant } from "@/utils/Constants";

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
        <Heading>
          <MonoText $use="Heading2">
            {t(`${translationPrefix}.heading`)}
          </MonoText>
        </Heading>
        <Sub>
          <MonoText $use="H5_Regular">{t(`${translationPrefix}.sub`)}</MonoText>
        </Sub>

        <CTAWrap>
          <GenericButton
            asAnchor
            href="/tutorial-videos"
            variant={VARIANT.PRIMARY}
          >
            {t(`${translationPrefix}.tutorial`)}
          </GenericButton>
          <GenericButton
            asAnchor
            href="/tutorial-videos"
            variant={VARIANT.SECONDARY}
          >
            {t(`${translationPrefix}.guide`)}
          </GenericButton>
        </CTAWrap>
      </Inner>
    </Section>
  );
}
