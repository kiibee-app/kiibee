"use client";

import { useTranslation } from "react-i18next";
import {
  Body,
  Description,
  Divider,
  Intro,
  Meta,
  Section,
  SectionTitle,
  Title,
  Wrap,
} from "./styles";

export default function CookieSettingsSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Title>{t("footer.cookieSettings")}</Title>
      <Meta>{t("legalPages.cookieSettings.updatedAt")}</Meta>
      <Divider />
      <Intro>{t("legalPages.cookieSettings.intro")}</Intro>
      <Divider />
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.cookieSettings.sections.what.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.cookieSettings.sections.what.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.cookieSettings.sections.kiibee.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.cookieSettings.sections.kiibee.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.cookieSettings.sections.analytics.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.cookieSettings.sections.analytics.body")}
          </Description>
        </Section>
      </Body>
    </Wrap>
  );
}
