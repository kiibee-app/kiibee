"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackButtonIcon } from "@/assets/icons";
import InputField from "@/components/UI/InputFields";
import {
  ADDRESS_FIELDS,
  CONTACT_FIELDS,
  CONTENT_FIELD,
  CreatorFieldConfig,
  CreatorFormValues,
  EMAIL_FIELD,
  INITIAL_CREATOR_FORM,
  NAME_FIELDS,
  REQUIRED_CREATOR_FIELD_KEYS,
  WORK_LINK_FIELD,
} from "@/utils/authCreatorForm";
import { useTheme } from "styled-components";
import {
  BackButton,
  BrandMark,
  Checkbox,
  CheckboxRow,
  ConsentText,
  ContentWrap,
  Form,
  FormIntro,
  FormTitle,
  FullRow,
  Grid,
  HelpText,
  LinkRow,
  LoginLink,
  SubmitButton,
  TernaryRow,
  TermsLink,
  TopBar,
} from "./styles";

export default function SignUpCreatorSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [formValues, setFormValues] =
    useState<CreatorFormValues>(INITIAL_CREATOR_FORM);

  const isSubmitEnabled = useMemo(() => {
    const hasRequiredValues = REQUIRED_CREATOR_FIELD_KEYS.every((fieldKey) =>
      Boolean(formValues[fieldKey].trim()),
    );

    return hasRequiredValues && formValues.agreed;
  }, [formValues]);

  const updateField = (
    field: keyof CreatorFormValues,
    value: string | boolean,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSubmitEnabled) {
      return;
    }
  };

  const normalizeFieldValue = (value: string | string[]) =>
    Array.isArray(value) ? value.join(" ") : value;

  const renderField = (field: CreatorFieldConfig) => (
    <InputField
      key={field.key}
      id={`creator-${field.key}`}
      label={t(field.labelKey)}
      labelFontStyle="Body_Title7"
      labelMarginTop="0"
      type={field.type}
      placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
      value={formValues[field.key]}
      onChange={(value) => updateField(field.key, normalizeFieldValue(value))}
      required={field.required}
    />
  );

  return (
    <ContentWrap>
      <TopBar>
        <BackButton href="/auth" aria-label={t("authCreator.backAria", "Back")}>
          <BackButtonIcon
            size={40}
            backgroundColor={theme?.colors?.neutral?.GRAY_200}
            strokeColor={theme?.colors?.primary?.BLACK}
          />
        </BackButton>
      </TopBar>

      <BrandMark aria-hidden="true">k</BrandMark>

      <FormTitle>{t("authCreator.title")}</FormTitle>
      <FormIntro>{t("authCreator.subtitle")}</FormIntro>

      <Form onSubmit={handleSubmit}>
        <Grid>{NAME_FIELDS.map((field) => renderField(field))}</Grid>

        <FullRow>{renderField(EMAIL_FIELD)}</FullRow>

        <Grid>
          {CONTACT_FIELDS.map((field) =>
            field.key === "cvr" ? (
              <div key={field.key}>
                {renderField(field)}
                <HelpText>{t("authCreator.form.cvrHelp")}</HelpText>
              </div>
            ) : (
              renderField(field)
            ),
          )}
        </Grid>

        <TernaryRow>
          {ADDRESS_FIELDS.map((field) => renderField(field))}
        </TernaryRow>

        <FullRow>{renderField(WORK_LINK_FIELD)}</FullRow>

        <FullRow>{renderField(CONTENT_FIELD)}</FullRow>

        <CheckboxRow>
          <Checkbox
            id="creator-consent"
            type="checkbox"
            checked={formValues.agreed}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateField("agreed", event.target.checked)
            }
          />
          <ConsentText htmlFor="creator-consent">
            {t("authCreator.form.consentPrefix")}{" "}
            <TermsLink href="#">{t("authCreator.form.terms")}</TermsLink>{" "}
            {t("authCreator.form.and")}{" "}
            <TermsLink href="#">{t("authCreator.form.privacy")}</TermsLink>
          </ConsentText>
        </CheckboxRow>

        <SubmitButton type="submit" disabled={!isSubmitEnabled}>
          {t("authCreator.form.submit")}
        </SubmitButton>
      </Form>

      <LinkRow>
        {t("authCreator.haveAccount")}{" "}
        <LoginLink href="/auth/login">{t("authCreator.login")}</LoginLink>
      </LinkRow>
    </ContentWrap>
  );
}
