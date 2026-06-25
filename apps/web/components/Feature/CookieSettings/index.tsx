"use client";

import { useTranslation } from "react-i18next";
import FormattedBody from "../FormattedBody";
import {
  Body,
  Divider,
  FormattedDescription,
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
      <FormattedDescription>
        <FormattedBody text={t("legalPages.cookieSettings.intro")} />
      </FormattedDescription>
      <Divider />
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.cookieSettings.sections.what.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.cookieSettings.sections.what.body")}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.cookieSettings.sections.kiibee.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.cookieSettings.sections.kiibee.body")}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.cookieSettings.sections.analytics.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.cookieSettings.sections.analytics.body")}
            />
          </FormattedDescription>
        </Section>
      </Body>
    </Wrap>
  );
}
