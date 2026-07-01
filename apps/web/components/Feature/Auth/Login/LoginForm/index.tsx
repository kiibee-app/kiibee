"use client";

import { useTranslation } from "react-i18next";
import { FormProvider } from "react-hook-form";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import FormField from "@/components/UI/FormField";
import {
  Card,
  FormMessage,
  FooterText,
  Form,
  OptionsRow,
  RememberLabel,
  SignUpLink,
  Title,
  Wrapper,
  ForgotLink,
} from "./styles";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import Image from "@/components/UI/SafeImage";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { ALERT } from "@/utils/common";
import { PATHS } from "@/utils/path";
import { INPUT_TYPE } from "@/utils/ui";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

export default function LoginForm({
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
    isSubmitting,
    formError,
    remember,
    setRemember,
    isPasswordVisible,
    handleFieldChange,
    togglePassword,
    handleSubmit,
  } = useLoginForm({ onSuccessOverride: onSuccess });

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
        <Title>
          <MonoText $use="H4_Medium">{t("authForm.title")}</MonoText>
        </Title>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit}>
            <FormField
              id="login-email"
              name="email"
              type="email"
              placeholder={t("authForm.emailLabel")}
              onChange={(nextValue) =>
                handleFieldChange("email", String(nextValue))
              }
              autoComplete="email"
            />
            <FormField
              id="login-password"
              name="password"
              type={isPasswordVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
              placeholder={t("authForm.passwordLabel")}
              onChange={(nextValue) =>
                handleFieldChange("password", String(nextValue))
              }
              autoComplete="current-password"
              icon={isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
              onIconClick={togglePassword}
            />
            <OptionsRow>
              <RememberLabel>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                />
                {t("authForm.remember")}
              </RememberLabel>
            </OptionsRow>
            {formError && <FormMessage role={ALERT}>{formError}</FormMessage>}
            <GenericButton
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValid}
            >
              {t("authForm.submit")}
            </GenericButton>
          </Form>
        </FormProvider>
        <ForgotLink href="/auth/forget-password">
          <MonoText $use="Body_Small">{t("authForm.forgot")}</MonoText>
        </ForgotLink>
        <FooterText>
          <MonoText $use="Body_Medium"> {t("authForm.footer")}</MonoText>
          <SignUpLink
            href={PATHS.AUTH_SIGNUP}
            onClick={(e) => {
              if (onSwitchMode) {
                e.preventDefault();
                onSwitchMode();
              }
            }}
          >
            <MonoText $use="Body_Medium">{t("authForm.signup")}</MonoText>
          </SignUpLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}
