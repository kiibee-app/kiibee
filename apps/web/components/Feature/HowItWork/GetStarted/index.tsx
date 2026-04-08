"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Inner, Heading, Sub, CTAWrap } from "./styles";
import { MonoText } from "@/components/UI/Monotext";

export default function GetStarted() {
  const { t } = useTranslation();

  return (
    <Section>
      <Inner>
        <Heading>
          <MonoText $use="Heading2">{t("how.getStarted.heading")}</MonoText>
        </Heading>
        <Sub>
          <MonoText $use="H5_Regular">{t("how.getStarted.sub")}</MonoText>
        </Sub>

        <CTAWrap>
          <GenericButton variant="primary">
            {t("how.getStarted.tutorial")}
          </GenericButton>
          <GenericButton variant="secondary">
            {t("how.getStarted.guide")}
          </GenericButton>
        </CTAWrap>
      </Inner>
    </Section>
  );
}
