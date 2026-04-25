"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "@/components/UI/SafeImage";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { INPUT_TYPE } from "@/utils/ui";
import {
  INITIAL_VIEWER_FORM,
  PASSWORD_FIELD_KEYS,
  PasswordVisibility,
  VIEWER_FIELDS,
  ViewerFieldConfig,
  ViewerFieldKey,
  ViewerFormValues,
} from "@/utils/signup";
import {
  Card,
  Checkbox,
  CheckboxRow,
  ConsentText,
  ContentWrap,
  Form,
  LoginLink,
  LoginRow,
  TermsLink,
  Title,
  Wrapper,
} from "./styles";
import { REPEAT_PASSWORD } from "@/utils/Constants";

type PasswordFieldKey = keyof PasswordVisibility;

const isPasswordField = (
  fieldKey: ViewerFieldKey,
): fieldKey is PasswordFieldKey =>
  PASSWORD_FIELD_KEYS.includes(fieldKey as PasswordFieldKey);

export default function SignUpViewer() {
  const router = useRouter();
  const { t } = useTranslation();
  const [formValues, setFormValues] =
    useState<ViewerFormValues>(INITIAL_VIEWER_FORM);
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      repeatPassword: false,
    });
  const [submitted, setSubmitted] = useState(false);

  const passwordsDoNotMatch =
    formValues.repeatPassword.length > 0 &&
    formValues.password !== formValues.repeatPassword;

  const isSubmitEnabled = useMemo(
    () =>
      VIEWER_FIELDS.every((field) => Boolean(formValues[field.key].trim())) &&
      formValues.agreed &&
      !passwordsDoNotMatch,
    [formValues, passwordsDoNotMatch],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    router.push("/auth/signup-viewer/preferences");
  };

  const updateField = (
    field: keyof ViewerFormValues,
    value: string | boolean,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

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
            ? () =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  [passwordFieldKey]: !prev[passwordFieldKey],
                }))
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

            <GenericButton type="submit">
              {t("viewerSignup.form.submit")}
            </GenericButton>
          </Form>

          <LoginRow>
            <MonoText $use="Body_Medium">
              {t("viewerSignup.haveAccount")}
            </MonoText>
            <LoginLink href="/auth/login">
              <MonoText $use="Body_Medium">{t("viewerSignup.login")}</MonoText>
            </LoginLink>
          </LoginRow>
        </Card>
      </Wrapper>
    </ContentWrap>
  );
}
