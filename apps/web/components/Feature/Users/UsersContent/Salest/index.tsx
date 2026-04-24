"use client";

import { useTranslation } from "react-i18next";
import { SectionCard, SectionDescription, SectionTitle } from "./styles";

export default function SalestTabContent() {
  const { t } = useTranslation();

  return (
    <SectionCard>
      <SectionTitle>{t("dashboard.users.salest.title")}</SectionTitle>
      <SectionDescription>
        {t("dashboard.users.salest.description")}
      </SectionDescription>
    </SectionCard>
  );
}
