"use client";

import { useTranslation } from "react-i18next";
import { Body, Description, Title, Wrap } from "./styles";

export default function CookieSettingsSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Title>{t("footer.cookieSettings")}</Title>
      <Body>
        <Description>{t("legalPages.cookieSettings.body1")}</Description>
        <Description>{t("legalPages.cookieSettings.body2")}</Description>
      </Body>
    </Wrap>
  );
}
