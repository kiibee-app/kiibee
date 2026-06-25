"use client";

import { useTranslation } from "react-i18next";
import FormattedBody from "../FormattedBody";
import {
  Body,
  ContactCard,
  Description,
  Divider,
  FormattedDescription,
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
          <FormattedDescription>
            <FormattedBody
              text={t(
                "legalPages.termsOfService.sections.intellectualProperty.body",
              )}
            />
          </FormattedDescription>
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
          <FormattedDescription>
            <FormattedBody
              text={t(
                "legalPages.termsOfService.sections.digitalPurchase.body",
              )}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.payments.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.termsOfService.sections.payments.body")}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.platform.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.termsOfService.sections.platform.body")}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.liability.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.termsOfService.sections.liability.body")}
            />
          </FormattedDescription>
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
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.publisherAccount.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t(
                "legalPages.termsOfService.sections.publisherAccount.body",
              )}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.publisherContent.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t(
                "legalPages.termsOfService.sections.publisherContent.body",
              )}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.publisherRole.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.termsOfService.sections.publisherRole.body")}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.publisherFees.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.termsOfService.sections.publisherFees.body")}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.publisherMarketing.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t(
                "legalPages.termsOfService.sections.publisherMarketing.body",
              )}
            />
          </FormattedDescription>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.termsOfService.sections.publisherTermination.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t(
                "legalPages.termsOfService.sections.publisherTermination.body",
              )}
            />
          </FormattedDescription>
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
