"use client";

import { useTranslation } from "react-i18next";
import FormattedBody from "../Shared/FormattedBody";
import {
  Body,
  FormattedDescription,
  Header,
  IntroArea,
  Meta,
  Section,
  SectionTitle,
  Title,
  Wrap,
} from "../Shared/legalPageStyles";

export default function CookieSettingsSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Header>
        <Title>{t("footer.cookieSettings")}</Title>
        <Meta>{t("legalPages.cookieSettings.updatedAt")}</Meta>
      </Header>
      <IntroArea>
        <FormattedDescription>
          <FormattedBody text={t("legalPages.cookieSettings.intro")} />
        </FormattedDescription>
      </IntroArea>
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
