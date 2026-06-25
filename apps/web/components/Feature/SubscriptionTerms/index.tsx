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

export default function SubscriptionTermsSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Title>{t("footer.subscriptionTerms")}</Title>
      <Meta>{t("legalPages.subscriptionTerms.updatedAt")}</Meta>
      <Divider />
      <Intro>{t("legalPages.subscriptionTerms.intro")}</Intro>
      <Divider />
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.general.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.general.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.payment.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.payment.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.cancellation.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.cancellation.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.nonPayment.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.nonPayment.body")}
          </Description>
        </Section>
        <Divider />
        <ContactCard>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.contact.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.contact.body")}
          </Description>
        </ContactCard>
      </Body>
    </Wrap>
  );
}
