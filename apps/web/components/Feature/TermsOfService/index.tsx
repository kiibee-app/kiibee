"use client";

import { useTranslation } from "react-i18next";
import {
  Body,
  ContactCard,
  Description,
  Divider,
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
      <Divider />
      <Intro>{t("legalPages.termsOfService.intro")}</Intro>
      <Divider />
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.acceptance.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.acceptance.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.intellectualProperty.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.intellectualProperty.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.thirdParty.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.thirdParty.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.offensiveContent.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.offensiveContent.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.digitalPurchase.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.digitalPurchase.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.payments.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.payments.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.platform.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.platform.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.liability.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.liability.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.governingLaw.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.termsOfService.sections.governingLaw.body")}
          </Description>
        </Section>
        <Divider />
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
