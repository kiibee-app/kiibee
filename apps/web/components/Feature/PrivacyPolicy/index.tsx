"use client";

import { useTranslation } from "react-i18next";
import FormattedBody from "../Shared/FormattedBody";
import LegalContactSection from "../Shared/LegalContactSection";
import {
  Body,
  Description,
  FormattedDescription,
  Header,
  IntroArea,
  Meta,
  Section,
  SectionTitle,
  Title,
  Wrap,
} from "../Shared/legalPageStyles";

export default function PrivacyPolicySection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Header>
        <Title>{t("footer.privacyPolicy")}</Title>
        <Meta>{t("legalPages.privacyPolicy.updatedAt")}</Meta>
      </Header>
      <IntroArea>
        <FormattedDescription>
          <FormattedBody text={t("legalPages.privacyPolicy.intro")} />
        </FormattedDescription>
      </IntroArea>
      <Body>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.collect.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.privacyPolicy.sections.collect.body")}
            />
          </FormattedDescription>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.nonPersonal.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.nonPersonal.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.cookies.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.cookies.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.use.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.privacyPolicy.sections.use.body")}
            />
          </FormattedDescription>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.share.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.share.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.changes.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.changes.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.rights.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.rights.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.acceptance.title")}
          </SectionTitle>
          <Description>
            {t("legalPages.privacyPolicy.sections.acceptance.body")}
          </Description>
        </Section>
        <Section>
          <SectionTitle>
            {t("legalPages.privacyPolicy.sections.publisherGdpr.title")}
          </SectionTitle>
          <FormattedDescription>
            <FormattedBody
              text={t("legalPages.privacyPolicy.sections.publisherGdpr.body")}
            />
          </FormattedDescription>
        </Section>
        <LegalContactSection translationPrefix="legalPages.privacyPolicy.sections.contact" />
      </Body>
    </Wrap>
  );
}
