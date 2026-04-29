"use client";

import { useTranslation } from "react-i18next";
import InfoTextCard from "@/components/UI/InfoTextCard";
import { DASHBOARD_USERS } from "@/utils/translationKeys";

export default function RegistrationsTabContent() {
  const { t } = useTranslation();

  return (
    <InfoTextCard
      title={t(DASHBOARD_USERS.registrations.title)}
      description={t(DASHBOARD_USERS.registrations.description)}
      withTopSpacing
    />
  );
}
