"use client";

import { useTranslation } from "react-i18next";
import {
  Body,
  ContactCard,
  Description,
  Intro,
  Meta,
  Section,
  SectionTitle,
  Title,
  Wrap,
} from "./styles";

export default function TermsOfServiceSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Title>{t("footer.termsOfService")}</Title>
      <Meta>{t("legalPages.termsOfService.updatedAt")}</Meta>
      <Intro>{t("legalPages.termsOfService.intro")}</Intro>
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.acceptance.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.acceptance.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.accounts.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.accounts.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.payments.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.payments.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.content.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.content.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.liability.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.liability.body")}
          </Description>
        </Section>
        <ContactCard>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.contact.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.contact.body")}
          </Description>
        </ContactCard>
      </Body>
    </Wrap>
  );
}
