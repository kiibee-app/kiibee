"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Section, Title, PillsWrapper, Pill } from "./styles";
import { interests } from "@/utils/interests";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";

export default function InterestSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Title>
        <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
          {t("interests.title")}
        </MonoText>
      </Title>

      <PillsWrapper>
        {interests.map((item, index) => (
          <Pill key={index} $variant={item.variant}>
            {t(item.label)}
          </Pill>
        ))}
      </PillsWrapper>
    </Section>
  );
}
