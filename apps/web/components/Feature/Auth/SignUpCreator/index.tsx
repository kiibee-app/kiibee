"use client";

import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
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
import { useCreatorRequestForm } from "@/hooks/Auth/useCreatorRequestForm";
import { PATHS } from "@/utils/path";

export default function SignUpCreatorSection() {
  const { t } = useTranslation();
  const creatorForm = useCreatorRequestForm(t);

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
      value={creatorForm.formValues[field.key]}
      onChange={(value) =>
        creatorForm.updateField(field.key, normalizeFieldValue(value))
      }
      required={field.required}
    />
  );

  return (
    <ContentWrap>
      <AuthBackButton href={PATHS.AUTH_SIGNUP} />
      <LogoWrap>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
      </LogoWrap>

      <FormTitle>
        <MonoText $use="H4_Medium">{t("authCreator.title")}</MonoText>
      </FormTitle>
      <FormIntro>
        <MonoText $use="Body_Regular">{t("authCreator.subtitle")}</MonoText>
      </FormIntro>

      <Form onSubmit={creatorForm.handleSubmit}>
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
            checked={creatorForm.formValues.agreed}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              creatorForm.updateField("agreed", event.target.checked)
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

        {creatorForm.formMessage && (
          <FormMessage $tone={creatorForm.messageTone} role={ALERT}>
            {creatorForm.formMessage}
          </FormMessage>
        )}

        <SubmitButton
          type="submit"
          disabled={!creatorForm.isSubmitEnabled}
          isLoading={creatorForm.isPending}
        >
          {t("authCreator.form.submit")}
        </SubmitButton>
      </Form>

      <LinkRow>
        <MonoText $use="Body_Medium">{t("authCreator.haveAccount")}</MonoText>
        <LoginLink href={PATHS.AUTH_LOGIN}>
          <MonoText $use="Body_Medium">{t("authCreator.login")}</MonoText>
        </LoginLink>
      </LinkRow>
    </ContentWrap>
  );
}
