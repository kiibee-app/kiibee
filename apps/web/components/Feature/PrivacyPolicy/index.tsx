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

export default function PrivacyPolicySection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Title>{t("footer.privacyPolicy")}</Title>
      <Meta>{t("legalPages.privacyPolicy.updatedAt")}</Meta>
      <Divider />
      <Intro>{t("legalPages.privacyPolicy.intro")}</Intro>
      <Divider />
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.collect.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.collect.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.nonPersonal.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.nonPersonal.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.cookies.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.cookies.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.use.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.use.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.share.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.share.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.changes.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.changes.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.rights.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.rights.body")}
          </Description>
        </Section>
        <Divider />
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.acceptance.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.acceptance.body")}
          </Description>
        </Section>
        <Divider />
        <ContactCard>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.contact.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.contact.body")}
          </Description>
        </ContactCard>
      </Body>
    </Wrap>
  );
}
