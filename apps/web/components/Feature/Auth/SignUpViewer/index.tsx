"use client";

import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { ALERT } from "@/utils/common";
import { PATHS } from "@/utils/path";
import { INPUT_TYPE } from "@/utils/ui";
import { VIEWER_FIELDS, ViewerFieldConfig } from "@/utils/signup";
import {
  Card,
  Checkbox,
  CheckboxRow,
  ConsentText,
  ContentWrap,
  Form,
  FormMessage,
  LoginLink,
  LoginRow,
  TermsLink,
  Title,
  Wrapper,
} from "./styles";
import {
  PasswordFieldKey,
  useViewerSignUpForm,
} from "@/hooks/auth/useViewerSignUpForm";
import { REPEAT_PASSWORD } from "@/utils/Constants";

export default function SignUpViewer() {
  const { t } = useTranslation();

  const {
    formValues,
    passwordVisibility,
    submitted,
    formError,
    isSubmitting,
    isSubmitEnabled,
    passwordsDoNotMatch,
    updateField,
    togglePassword,
    handleSubmit,
    isPasswordField,
  } = useViewerSignUpForm();

  const renderField = (field: ViewerFieldConfig) => {
    const hasPasswordMismatch =
      submitted && field.key === REPEAT_PASSWORD && passwordsDoNotMatch;
    const passwordFieldKey = isPasswordField(field.key) ? field.key : null;
    const isPasswordVisible = passwordFieldKey
      ? passwordVisibility[passwordFieldKey]
      : false;
    const inputType = passwordFieldKey
      ? isPasswordVisible
        ? INPUT_TYPE.TEXT
        : INPUT_TYPE.PASSWORD
      : field.type;

    return (
      <InputField
        key={field.key}
        id={`viewer-${field.key}`}
        label={t(field.labelKey)}
        labelFontStyle="Body_Regular"
        labelMarginTop="0"
        type={inputType}
        placeholder={t(field.placeholderKey)}
        value={formValues[field.key]}
        onChange={(nextValue) => updateField(field.key, nextValue as string)}
        autoComplete={field.autoComplete}
        icon={
          passwordFieldKey && isPasswordVisible ? (
            <EyeOpenIcon />
          ) : passwordFieldKey ? (
            <EyeClosedIcon />
          ) : undefined
        }
        onIconClick={
          passwordFieldKey
            ? () => togglePassword(field.key as PasswordFieldKey)
            : undefined
        }
        hasError={hasPasswordMismatch}
        errorText={
          hasPasswordMismatch
            ? t("viewerSignup.form.passwordMismatch")
            : undefined
        }
        required
      />
    );
  };

  return (
    <ContentWrap>
      <AuthBackButton href="/auth/signup" />
      <Wrapper>
        <Card>
          <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
          <Title>
            <MonoText $use="H4_Medium">{t("viewerSignup.title")}</MonoText>
          </Title>

          <Form onSubmit={handleSubmit}>
            {VIEWER_FIELDS.map((field) => renderField(field))}

            <CheckboxRow>
              <Checkbox
                id="viewer-consent"
                type="checkbox"
                checked={formValues.agreed}
                onChange={(event) =>
                  updateField("agreed", event.target.checked)
                }
              />
              <ConsentText htmlFor="viewer-consent">
                <MonoText $use="Body_Small">
                  {t("viewerSignup.form.consentPrefix")}
                  <TermsLink href="#">{t("viewerSignup.form.terms")}</TermsLink>
                  {t("viewerSignup.form.and")}
                  <TermsLink href="#">
                    {t("viewerSignup.form.privacy")}
                  </TermsLink>
                </MonoText>
              </ConsentText>
            </CheckboxRow>

            {formError && <FormMessage role={ALERT}>{formError}</FormMessage>}

            <GenericButton
              type="submit"
              disabled={!isSubmitEnabled}
              isLoading={isSubmitting}
              style={!isSubmitEnabled ? { border: "none" } : undefined}
            >
              {t("viewerSignup.form.submit")}
            </GenericButton>
          </Form>

          <LoginRow>
            <MonoText $use="Body_Medium">
              {t("viewerSignup.haveAccount")}
            </MonoText>
            <LoginLink href={PATHS.AUTH_LOGIN}>
              <MonoText $use="Body_Medium">{t("viewerSignup.login")}</MonoText>
            </LoginLink>
          </LoginRow>
        </Card>
      </Wrapper>
    </ContentWrap>
  );
}
