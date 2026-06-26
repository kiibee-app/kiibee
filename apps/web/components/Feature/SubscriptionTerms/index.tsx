"use client";

import { useTranslation } from "react-i18next";
import FormattedBody from "../FormattedBody";
import LegalContactSection from "../Shared/LegalContactSection";
import {
  Body,
  Description,
  FormattedDescription,
  Header,
  Intro,
  IntroArea,
  Meta,
  Section,
  SectionTitle,
  Title,
  Wrap,
} from "../Shared/legalPageStyles";

export default function SubscriptionTermsSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Header>
        <Title>{t("footer.subscriptionTerms")}</Title>
        <Meta>{t("legalPages.subscriptionTerms.updatedAt")}</Meta>
      </Header>
      <IntroArea>
        <Intro>{t("legalPages.subscriptionTerms.intro")}</Intro>
      </IntroArea>
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.general.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.general.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.payment.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.payment.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.cancellation.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.subscriptionTerms.sections.cancellation.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.subscriptionTerms.sections.nonPayment.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.subscriptionTerms.sections.nonPayment.body")}
            />
          </FormattedDescription>
        </Section>
        <LegalContactSection translationPrefix="legalPages.subscriptionTerms.sections.contact" />
      </Body>
    </Wrap>
  );
}
