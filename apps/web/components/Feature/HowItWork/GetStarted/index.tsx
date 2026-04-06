"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import GenericButton from "@/components/UI/GenericButton";
import { Section, Inner, Heading, Sub, CTAWrap } from "./styles";

export default function GetStarted() {
  const { t } = useTranslation();

  return (
    <Section>
      <Inner>
        <Heading>{t("how.getStarted.heading")}</Heading>
        <Sub>{t("how.getStarted.sub")}</Sub>

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
