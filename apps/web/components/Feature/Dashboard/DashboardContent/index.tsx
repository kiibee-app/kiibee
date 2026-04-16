"use client";

import React from "react";
import { EmptyState, Section, Title, Wrapper } from "./styles";
import { useTranslation } from "react-i18next";

export default function DashboardContent() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Section>
        <Title>{t("dashboard.overview")}</Title>
        <EmptyState>{t("dashboard.noData")}</EmptyState>
      </Section>

      <Section>
        <Title>{t("dashboard.contentPerformance")}</Title>
      </Section>
    </Wrapper>
  );
}
