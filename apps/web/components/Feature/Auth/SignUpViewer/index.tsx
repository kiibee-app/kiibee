"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import AuthBackButton from "@/components/Feature/Auth/AuthBackButton";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import {
  Card,
  Checkbox,
  CheckboxRow,
  ConsentText,
  Form,
  LoginLink,
  LoginRow,
  TermsLink,
  Title,
  Wrapper,
} from "./styles";
import { ContentWrap } from "@/app/auth/signup-creator/styles";

export default function SignUpViewer() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const passwordsDoNotMatch =
    repeatPassword.length > 0 && password !== repeatPassword;

  const isSubmitEnabled = useMemo(
    () =>
      Boolean(email.trim()) &&
      Boolean(password.trim()) &&
      Boolean(repeatPassword.trim()) &&
      agreed &&
      !passwordsDoNotMatch,
    [agreed, email, password, passwordsDoNotMatch, repeatPassword],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    router.push("/auth/signup-viewer/preferences");
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
            <InputField
              id="viewer-email"
              label={t("viewerSignup.form.email")}
              labelFontStyle="Body_Regular"
              labelMarginTop="0"
              type="email"
              placeholder={t("viewerSignup.form.emailPlaceholder")}
              value={email}
              onChange={(nextValue) => setEmail(nextValue as string)}
              autoComplete="email"
              required
            />
            <InputField
              id="viewer-password"
              label={t("viewerSignup.form.password")}
              labelFontStyle="Body_Regular"
              labelMarginTop="0"
              type="password"
              placeholder={t("viewerSignup.form.passwordPlaceholder")}
              value={password}
              onChange={(nextValue) => setPassword(nextValue as string)}
              autoComplete="new-password"
              required
            />
            <InputField
              id="viewer-repeat-password"
              label={t("viewerSignup.form.repeatPassword")}
              labelFontStyle="Body_Regular"
              labelMarginTop="0"
              type="password"
              placeholder={t("viewerSignup.form.repeatPasswordPlaceholder")}
              value={repeatPassword}
              onChange={(nextValue) => setRepeatPassword(nextValue as string)}
              autoComplete="new-password"
              hasError={submitted && passwordsDoNotMatch}
              errorText={
                submitted && passwordsDoNotMatch
                  ? t("viewerSignup.form.passwordMismatch")
                  : undefined
              }
              required
            />

            <CheckboxRow>
              <Checkbox
                id="viewer-consent"
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
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
