"use client";

import { useTranslation } from "react-i18next";
import FormattedBody from "../Shared/FormattedBody";
import {
  Body,
  FormattedDescription,
  Header,
  Meta,
  Section,
  SectionTitle,
  Title,
  Wrap,
} from "../Shared/legalPageStyles";

const SECTIONS = [
  "general",
  "account",
  "useOfService",
  "content",
  "role",
  "thirdParty",
  "payment",
  "emailMarketing",
  "intellectualProperty",
  "limitationOfLiability",
  "termination",
  "changes",
  "personalData",
  "governingLaw",
  "contact",
] as const;

export default function CreatorTermsSection() {
  const { t } = useTranslation();

  return (
    <Wrap>
      <Header>
        <Title>{t("legalPages.creatorTerms.pageTitle")}</Title>
        <Meta>{t("legalPages.creatorTerms.updatedAt")}</Meta>
      </Header>
      <Body>
        {SECTIONS.map((section) => (
          <Section key={section}>
            <SectionTitle>
              {t(`legalPages.creatorTerms.sections.${section}.title`)}
            </SectionTitle>
            <FormattedDescription>
              <FormattedBody
                text={t(`legalPages.creatorTerms.sections.${section}.body`)}
              />
            </FormattedDescription>
          </Section>
        ))}
      </Body>
    </Wrap>
  );
}
