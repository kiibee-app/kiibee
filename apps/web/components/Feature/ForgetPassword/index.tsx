"use client";

import { FormEvent, useState, useCallback, useRef } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import AuthBackButton from "../Auth/AuthBackButton";
import Turnstile, { TurnstileRef } from "@/components/UI/Turnstile";
import {
  Card,
  Description,
  Form,
  Title,
  Wrapper,
  SuccessBox,
  ResendText,
  LinkButton,
  BackButtonWrapper,
} from "./styles";
import { PATHS } from "@/utils/path";
import { INPUT_TYPE } from "@/utils/ui";
import { useForgetPassword } from "@/hooks/auth/useForgetPassword";
import { ApiError } from "@/lib/http/errors/apiError";
import { isValidEmail } from "@/utils/common";

export default function ForgetPasswordForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileRef>(null);
  const { mutateAsync: forgetPassword, isPending } = useForgetPassword();

  const resetState = useCallback(() => {
    setEmail("");
    setIsSent(false);
    setEmailError("");
    setErrorMessage("");
    setTurnstileToken("");
    turnstileRef.current?.reset();
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedEmail = email.trim();
      if (!trimmedEmail) return;

      if (!isValidEmail(trimmedEmail)) {
        setEmailError(t("authForm.errors.emailInvalid"));
        return;
      }

      setEmailError("");
      setErrorMessage("");

      try {
        await forgetPassword({ email: trimmedEmail });
        setIsSent(true);
      } catch (error) {
        const fallback = t("forgotPassword.submitFailed");
        setErrorMessage(error instanceof ApiError ? error.message : fallback);
        setTurnstileToken("");
        turnstileRef.current?.reset();
      }
    },
    [email, forgetPassword, t],
  );

  const handleResend = useCallback(() => {
    resetState();
  }, [resetState]);

  const handleEmailChange = useCallback(
    (value: string | string[]) => {
      const nextEmail = String(value);
      setEmail(nextEmail);
      setEmailError(
        nextEmail.trim() && !isValidEmail(nextEmail)
          ? t("authForm.errors.emailInvalid")
          : "",
      );
      setErrorMessage("");
    },
    [t],
  );

  return (
    <Wrapper>
      <BackButtonWrapper>
        <AuthBackButton href={PATHS.AUTH_LOGIN} />
      </BackButtonWrapper>

      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />

        {!isSent ? (
          <>
            <Title>{t("forgotPassword.title")}</Title>
            <Description>{t("forgotPassword.description")}</Description>
            <Form onSubmit={handleSubmit} noValidate>
              <InputField
                id="forgot-password-email"
                type={INPUT_TYPE.EMAIL}
                placeholder={t("forgotPassword.emailLabel")}
                value={email}
                onChange={handleEmailChange}
                hasError={Boolean(emailError || errorMessage)}
                errorMessage={emailError || errorMessage}
                autoComplete={INPUT_TYPE.EMAIL}
              />

              <Turnstile
                ref={turnstileRef}
                action="forget_password"
                resetSignal={isSent || errorMessage}
                onVerify={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
              />

              <GenericButton
                type="submit"
                isLoading={isPending}
                disabled={!isValidEmail(email) || isPending || !turnstileToken}
              >
                {t("forgotPassword.submit")}
              </GenericButton>
            </Form>
          </>
        ) : (
          <SuccessBox>
            <Title>{t("forgotPassword.checkEmailTitle")}</Title>
            <Description>
              {t("forgotPassword.checkEmailDescription")}
            </Description>
            <ResendText>
              {t("forgotPassword.didNotReceive")}
              <LinkButton onClick={handleResend}>
                {t("forgotPassword.resend")}
              </LinkButton>
            </ResendText>
          </SuccessBox>
        )}
      </Card>
    </Wrapper>
  );
}
