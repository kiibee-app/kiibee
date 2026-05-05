"use client";

import { FormEvent, useState, useCallback } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import AuthBackButton from "../Auth/AuthBackButton";
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
import { ALERT } from "@/utils/common";

export default function ForgetPasswordForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: forgetPassword, isPending } = useForgetPassword();

  const resetState = useCallback(() => {
    setEmail("");
    setIsSent(false);
    setErrorMessage("");
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email.trim()) return;
      setErrorMessage("");

      try {
        await forgetPassword({ email: email.trim() });
        setIsSent(true);
      } catch (error) {
        const fallback = t("forgotPassword.submitFailed");
        setErrorMessage(error instanceof ApiError ? error.message : fallback);
      }
    },
    [email, forgetPassword, t],
  );

  const handleResend = useCallback(() => {
    resetState();
  }, [resetState]);

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
            <Form onSubmit={handleSubmit}>
              <InputField
                id="forgot-password-email"
                type={INPUT_TYPE.EMAIL}
                placeholder={t("forgotPassword.emailLabel")}
                value={email}
                onChange={(v) => setEmail(v as string)}
                autoComplete={INPUT_TYPE.EMAIL}
              />
              {errorMessage && (
                <Description role={ALERT}>{errorMessage}</Description>
              )}

              <GenericButton
                type="submit"
                isLoading={isPending}
                disabled={!email.trim() || isPending}
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
