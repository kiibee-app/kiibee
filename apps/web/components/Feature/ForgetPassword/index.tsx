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

export default function ForgetPasswordForm() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const resetState = useCallback(() => {
    setEmail("");
    setIsSent(false);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email.trim()) return;
      setIsSent(true);
    },
    [email],
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

              <GenericButton type="submit" disabled={!email.trim()}>
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
