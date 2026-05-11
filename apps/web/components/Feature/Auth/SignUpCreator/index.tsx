"use client";

import { useTranslation } from "react-i18next";
import { FormProvider, useWatch } from "react-hook-form";
import FormField from "@/components/UI/FormField";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import {
  ADDRESS_FIELDS,
  CONTACT_FIELDS,
  CONTENT_FIELD,
  CreatorFieldConfig,
  EMAIL_FIELD,
  NAME_FIELDS,
  WORK_LINK_FIELD,
} from "@/utils/authCreatorForm";
import {
  Checkbox,
  CheckboxRow,
  ConsentText,
  ContentWrap,
  Form,
  FormIntro,
  FormMessage,
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
import { ALERT } from "@/utils/common";
import {
  CreatorRequestValues,
  useCreatorRequestForm,
} from "@/hooks/auth/useCreatorRequestForm";
import { AGREED } from "@/utils/ui";

export default function SignUpCreatorSection() {
  const { t } = useTranslation();

  const {
    methods,
    formMessage,
    messageTone,
    isValid,
    errors,
    isSubmitting,
    updateField,
    handleFormSubmit,
  } = useCreatorRequestForm();

  const agreedValue = useWatch({
    control: methods.control,
    name: AGREED,
    defaultValue: false,
  });

  const normalizeFieldValue = (value: string | string[]) =>
    Array.isArray(value) ? value.join(" ") : value;

  const renderField = (field: CreatorFieldConfig) => (
    <FormField<CreatorRequestValues>
      key={field.key}
      id={`creator-${field.key}`}
      name={field.key}
      label={t(field.labelKey)}
      labelFontStyle="Body_Regular"
      labelMarginTop="0"
      type={field.type}
      placeholder={field.placeholderKey ? t(field.placeholderKey) : undefined}
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

      <FormProvider {...methods}>
        <Form onSubmit={handleFormSubmit}>
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
              checked={Boolean(agreedValue)}
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

          {(formMessage || errors.agreed?.message) && (
            <FormMessage $tone={messageTone} role={ALERT}>
              {formMessage || String(errors.agreed?.message)}
            </FormMessage>
          )}

          <SubmitButton
            type="submit"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          >
            {t("authCreator.form.submit")}
          </SubmitButton>
        </Form>
      </FormProvider>

      <LinkRow>
        <MonoText $use="Body_Medium">{t("authCreator.haveAccount")}</MonoText>
        <LoginLink href="/auth/login">
          <MonoText $use="Body_Medium">{t("authCreator.login")}</MonoText>
        </LoginLink>
      </LinkRow>
    </ContentWrap>
  );
}
