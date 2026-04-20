"use client";

import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/UI/InputFields";
import {
  Card,
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

export default function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }
  };

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} />
        <Title>
          <MonoText $use="H4_Medium">{t("authForm.title")}</MonoText>
        </Title>
        <Form onSubmit={handleSubmit}>
          <InputField
            id="login-email"
            type="email"
            placeholder={t("authForm.emailLabel")}
            value={email}
            onChange={(nextValue) => setEmail(nextValue as string)}
            autoComplete="email"
          />
          <InputField
            id="login-password"
            type="password"
            placeholder={t("authForm.passwordLabel")}
            value={password}
            onChange={(nextValue) => setPassword(nextValue as string)}
            autoComplete="current-password"
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
          <GenericButton type="submit">{t("authForm.submit")}</GenericButton>
        </Form>
        <ForgotLink href="/auth/forget-password">
          <MonoText $use="Body_Small">{t("authForm.forgot")}</MonoText>
        </ForgotLink>
        <FooterText>
          <MonoText $use="Body_Medium"> {t("authForm.footer")}</MonoText>
          <SignUpLink href="/auth/signup-creator">
            <MonoText $use="Body_Medium">{t("authForm.signUp")}</MonoText>
          </SignUpLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}
