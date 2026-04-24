"use client";

import { useTranslation } from "react-i18next";
import { SectionCard, SectionDescription, SectionTitle } from "./styles";

export default function RegistrationsTabContent() {
  const { t } = useTranslation();

  return (
    <SectionCard>
      <SectionTitle>{t("dashboard.users.registrations.title")}</SectionTitle>
      <SectionDescription>
        {t("dashboard.users.registrations.description")}
      </SectionDescription>
    </SectionCard>
  );
}
