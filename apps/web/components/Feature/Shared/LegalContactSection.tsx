"use client";

import { useTranslation } from "react-i18next";
import {
  ContactCard,
  ContactLine,
  ContactLines,
  SectionTitle,
} from "./legalPageStyles";
import { STRING_EMPTY } from "@/utils/Constants";
import { SPACE } from "@/utils/common";

type LegalContactSectionProps = {
  translationPrefix: string;
};

export default function LegalContactSection({
  translationPrefix,
}: LegalContactSectionProps) {
  const { t } = useTranslation();
  const cvr = t(`${translationPrefix}.cvr`, { defaultValue: STRING_EMPTY });
  const footer = t(`${translationPrefix}.footer`, {
    defaultValue: STRING_EMPTY,
  });
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
          {t("legalPages.common.email")}:{SPACE}
          <a href={`mailto:${email}`}>{email}</a>
        </ContactLine>
        {footer ? <ContactLine>{footer}</ContactLine> : null}
      </ContactLines>
    </ContactCard>
  );
}
