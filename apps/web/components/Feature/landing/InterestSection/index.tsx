"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Title, PillsWrapper, Pill } from "./styles";
import { interests } from "@/utils/interests";

export default function InterestSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Title>{t("interests.title")}</Title>

      <PillsWrapper>
        {interests.map((item, index) => (
          <Pill key={index} variant={item.variant}>
            {t(item.label)}
          </Pill>
        ))}
      </PillsWrapper>
    </Section>
  );
}
