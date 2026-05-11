"use client";

import { useMemo, useState } from "react";
import Image from "@/components/UI/SafeImage";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import FormField from "@/components/UI/FormField";
import { MonoText } from "@/components/UI/Monotext";
import { useViewerSignUp } from "@/hooks/auth/useViewerSignUp";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { ALERT } from "@/utils/common";
import { PATHS } from "@/utils/path";
import { INPUT_TYPE } from "@/utils/ui";
import { createViewerSignupSchema } from "@/lib/validation/schema";
import {
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
  FormMessage,
  LoginLink,
  LoginRow,
  TermsLink,
  Title,
  Wrapper,
} from "./styles";

type PasswordFieldKey = keyof PasswordVisibility;

const isPasswordField = (
  fieldKey: ViewerFieldKey,
): fieldKey is PasswordFieldKey =>
  PASSWORD_FIELD_KEYS.includes(fieldKey as PasswordFieldKey);

export default function SignUpViewer() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutateAsync: viewerSignUp, isPending: isSubmitting } =
    useViewerSignUp();
  const { setSession } = useAuthSession();
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      repeatPassword: false,
    });
  const [formError, setFormError] = useState("");
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();
  const schema = useMemo(
    () =>
      createViewerSignupSchema({
        fullNameRequired: t("viewerSignup.form.fixHighlightedFields"),
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        passwordRequired: t("authForm.errors.passwordRequired"),
        repeatPasswordRequired: t("viewerSignup.form.fixHighlightedFields"),
        passwordMismatch: t("viewerSignup.form.passwordMismatch"),
        consentRequired: t("viewerSignup.form.fixHighlightedFields"),
      }),
    [t],
  );
  type ViewerSignupValues = ReturnType<typeof schema.parse>;
  const methods = useForm<ViewerSignupValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      repeatPassword: "",
      agreed: false,
    },
  });
  const {
    handleSubmit,
    setValue,
    setError,
    formState: { isValid, errors },
  } = methods;
  const agreedValue = useWatch({
    control: methods.control,
    name: "agreed",
    defaultValue: false,
  });

  const onSubmit = async (values: ViewerSignupValues) => {
    setFormError("");
    try {
      const response = await viewerSignUp({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.repeatPassword,
      });

      setSession(response);

      router.push("/auth/signup-viewer/preferences");
    } catch (error) {
      applyFieldErrors(error, setError);
      setFormError(getErrorMessage(error, "viewerSignup.form.signupFailed"));
    }
  };

  const updateField = (
    field: keyof ViewerFormValues,
    value: string | boolean,
  ) => {
    setValue(field, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (formError) {
      setFormError("");
    }
  };

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
      <FormField<ViewerSignupValues>
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
          passwordFieldKey
            ? () =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  [passwordFieldKey]: !prev[passwordFieldKey],
                }))
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

          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
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
                    <TermsLink href="#">
                      {t("viewerSignup.form.terms")}
                    </TermsLink>
                    {t("viewerSignup.form.and")}
                    <TermsLink href="#">
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
            <LoginLink href={PATHS.AUTH_LOGIN}>
              <MonoText $use="Body_Medium">{t("viewerSignup.login")}</MonoText>
            </LoginLink>
          </LoginRow>
        </Card>
      </Wrapper>
    </ContentWrap>
  );
}
