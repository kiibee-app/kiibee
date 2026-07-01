"use client";

import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import { FormProvider, useWatch } from "react-hook-form";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import FormField from "@/components/UI/FormField";
import { MonoText } from "@/components/UI/Monotext";
import { ALERT } from "@/utils/common";
import { PATHS } from "@/utils/path";
import { AGREED, INPUT_TYPE } from "@/utils/ui";
import {
  PASSWORD_FIELD_KEYS,
  PasswordVisibility,
  VIEWER_FIELDS,
  ViewerFieldConfig,
  ViewerFieldKey,
} from "@/utils/signup";
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
import { useViewerSignUpForm } from "@/hooks/auth/useViewerSignUpForm";

type PasswordFieldKey = keyof PasswordVisibility;

const isPasswordField = (
  fieldKey: ViewerFieldKey,
): fieldKey is PasswordFieldKey =>
  PASSWORD_FIELD_KEYS.includes(fieldKey as PasswordFieldKey);

export default function SignUpViewer({
  onSuccess,
  onSwitchMode,
}: {
  onSuccess?: (response: unknown) => void;
  onSwitchMode?: () => void;
} = {}) {
  const { t } = useTranslation();

  const {
    methods,
    isValid,
    errors,
    isSubmitting,
    formError,
    passwordVisibility,
    updateField,
    togglePassword,
    handleSubmit,
  } = useViewerSignUpForm({ onSuccessOverride: onSuccess });

  const agreedValue = useWatch({
    control: methods.control,
    name: AGREED,
    defaultValue: false,
  });

  const renderField = (field: ViewerFieldConfig) => {
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
      <FormField
        key={field.key}
        id={`viewer-${field.key}`}
        name={field.key}
        label={t(field.labelKey)}
        labelFontStyle="Body_Regular"
        labelMarginTop="0"
        type={inputType}
        placeholder={t(field.placeholderKey)}
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
          passwordFieldKey ? () => togglePassword(passwordFieldKey) : undefined
        }
        required
      />
    );
  };

  const isModal = !!onSuccess || !!onSwitchMode;

  return (
    <ContentWrap $isModal={isModal}>
      {!isModal && <AuthBackButton href="/auth/signup" />}
      <Wrapper $isModal={isModal}>
        <Card>
          <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
          <Title>
            <MonoText $use="H4_Medium">{t("viewerSignup.title")}</MonoText>
          </Title>

          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit}>
              {VIEWER_FIELDS.map((field) => renderField(field))}

              <CheckboxRow>
                <Checkbox
                  id="viewer-consent"
                  type="checkbox"
                  checked={Boolean(agreedValue)}
                  onChange={(event) =>
                    updateField("agreed", event.target.checked)
                  }
                />
                <ConsentText htmlFor="viewer-consent">
                  <MonoText $use="Body_Small">
                    {t("viewerSignup.form.consentPrefix")}
                    <TermsLink href={PATHS.TERMS}>
                      {t("viewerSignup.form.terms")}
                    </TermsLink>
                    {t("viewerSignup.form.and")}
                    <TermsLink href={PATHS.PRIVACY_POLICY}>
                      {t("viewerSignup.form.privacy")}
                    </TermsLink>
                  </MonoText>
                </ConsentText>
              </CheckboxRow>

              {(formError || errors.agreed?.message) && (
                <FormMessage role={ALERT}>
                  {formError || String(errors.agreed?.message)}
                </FormMessage>
              )}

              <GenericButton
                type="submit"
                disabled={!isValid}
                isLoading={isSubmitting}
                style={!isValid ? { border: "none" } : undefined}
              >
                {t("viewerSignup.form.submit")}
              </GenericButton>
            </Form>
          </FormProvider>

          <LoginRow>
            <MonoText $use="Body_Medium">
              {t("viewerSignup.haveAccount")}
            </MonoText>
            <LoginLink
              href={PATHS.AUTH_LOGIN}
              onClick={(e) => {
                if (onSwitchMode) {
                  e.preventDefault();
                  onSwitchMode();
                }
              }}
            >
              <MonoText $use="Body_Medium">{t("viewerSignup.login")}</MonoText>
            </LoginLink>
          </LoginRow>
        </Card>
      </Wrapper>
    </ContentWrap>
  );
}
