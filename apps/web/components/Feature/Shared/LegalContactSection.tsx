"use client";

import { useTranslation } from "react-i18next";
import {
  ContactCard,
  ContactLine,
  ContactLines,
  SectionTitle,
} from "./legalPageStyles";

type LegalContactSectionProps = {
  translationPrefix: string;
};

export default function LegalContactSection({
  translationPrefix,
}: LegalContactSectionProps) {
  const { t } = useTranslation();
  const cvr = t(`${translationPrefix}.cvr`, { defaultValue: "" });
  const footer = t(`${translationPrefix}.footer`, { defaultValue: "" });
  const email = t(`${translationPrefix}.email`);

  return (
    <ContactCard>
      <SectionTitle>{t(`${translationPrefix}.title`)}</SectionTitle>
      <ContactLines>
        <ContactLine>{t(`${translationPrefix}.intro`)}</ContactLine>
        <ContactLine>{t(`${translationPrefix}.company`)}</ContactLine>
        {cvr ? (
          <ContactLine>
            {t("legalPages.common.cvr")}: {cvr}
          </ContactLine>
        ) : null}
        <ContactLine>
          {t("legalPages.common.email")}:{" "}
          <a href={`mailto:${email}`}>{email}</a>
        </ContactLine>
        {footer ? <ContactLine>{footer}</ContactLine> : null}
      </ContactLines>
    </ContactCard>
  );
}
