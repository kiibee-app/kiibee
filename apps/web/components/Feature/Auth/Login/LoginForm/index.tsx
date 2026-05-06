"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons";
import InputField from "@/components/UI/InputFields";
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

export default function LoginForm() {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { state, actions } = useLoginForm();
  const { email, password, remember, fieldErrors, formError, isPending } =
    state;

  const { setRemember, handleEmailChange, handlePasswordChange, handleSubmit } =
    actions;
  const isSubmitDisabled = isPending || !email.trim() || !password.trim();

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
        <Title>
          <MonoText $use="H4_Medium">{t("authForm.title")}</MonoText>
        </Title>
        <Form onSubmit={handleSubmit}>
          <InputField
            id="login-email"
            type="email"
            placeholder={t("authForm.emailLabel")}
            value={email}
            onChange={(nextValue) => handleEmailChange(nextValue as string)}
            autoComplete="email"
            hasError={Boolean(fieldErrors.email)}
            errorText={fieldErrors.email}
          />
          <InputField
            id="login-password"
            type={isPasswordVisible ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD}
            placeholder={t("authForm.passwordLabel")}
            value={password}
            onChange={(nextValue) => handlePasswordChange(nextValue as string)}
            autoComplete="current-password"
            icon={isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            onIconClick={() => setIsPasswordVisible((prev) => !prev)}
            hasError={Boolean(fieldErrors.password)}
            errorText={fieldErrors.password}
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
            isLoading={isPending}
            disabled={isSubmitDisabled}
          >
            {t("authForm.submit")}
          </GenericButton>
        </Form>
        <ForgotLink href="/auth/forget-password">
          <MonoText $use="Body_Small">{t("authForm.forgot")}</MonoText>
        </ForgotLink>
        <FooterText>
          <MonoText $use="Body_Medium"> {t("authForm.footer")}</MonoText>
          <SignUpLink href={PATHS.AUTH_SIGNUP}>
            <MonoText $use="Body_Medium">{t("authForm.signUp")}</MonoText>
          </SignUpLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}
