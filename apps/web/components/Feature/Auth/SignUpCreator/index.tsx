"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
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
import {
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
  LogoWrap,
  SubmitButton,
  TernaryRow,
  TermsLink,
} from "./styles";
import Image from "@/components/UI/SafeImage";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import { MonoText } from "@/components/UI/Monotext";

export default function SignUpCreatorSection() {
  const { t } = useTranslation();
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
      labelFontStyle="Body_Regular"
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
      <AuthBackButton href="/auth/signup" />
      <LogoWrap>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
      </LogoWrap>

      <FormTitle>
        <MonoText $use="H4_Medium">{t("authCreator.title")}</MonoText>
      </FormTitle>
      <FormIntro>
        <MonoText $use="Body_Regular">{t("authCreator.subtitle")}</MonoText>
      </FormIntro>

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
            <MonoText $use="Body_Small">
              {t("authCreator.form.consentPrefix")}
              <TermsLink href="#">{t("authCreator.form.terms")}</TermsLink>
              {t("authCreator.form.and")}
              <TermsLink href="#">{t("authCreator.form.privacy")}</TermsLink>
            </MonoText>
          </ConsentText>
        </CheckboxRow>

        <SubmitButton type="submit" disabled={!isSubmitEnabled}>
          {t("authCreator.form.submit")}
        </SubmitButton>
      </Form>

      <LinkRow>
        <MonoText $use="Body_Medium">{t("authCreator.haveAccount")}</MonoText>
        <LoginLink href="/auth/login">
          <MonoText $use="Body_Medium">{t("authCreator.login")}</MonoText>
        </LoginLink>
      </LinkRow>
    </ContentWrap>
  );
}
