"use client";

import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
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
import Image from "next/image";
import GenericButton from "@/components/UI/GenericButton";
import { MonoText } from "@/components/UI/Monotext";
import { useLoginFormSchema } from "@/utils/useLoginFormSchema";
import type { LoginFormErrors } from "@/utils/authLoginFormSchema";
import { ALERT } from "@/utils/common";

export default function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState("");
  const loginSchema = useLoginFormSchema();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedValues = loginSchema.safeParse({
      email,
      password,
    });

    if (!parsedValues.success) {
      const flattenedErrors = parsedValues.error.flatten().fieldErrors;

      setFieldErrors({
        email: flattenedErrors.email?.[0],
        password: flattenedErrors.password?.[0],
      });
      setFormError(t("authForm.errors.fixHighlightedFields"));
      return;
    }

    setFormError("");
    setFieldErrors({});
  };

  const handleEmailChange = (nextValue: string) => {
    setEmail(nextValue);
    if (fieldErrors.email || formError) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
      setFormError("");
    }
  };

  const handlePasswordChange = (nextValue: string) => {
    setPassword(nextValue);
    if (fieldErrors.password || formError) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
      setFormError("");
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
            onChange={(nextValue) => handleEmailChange(nextValue as string)}
            autoComplete="email"
            hasError={Boolean(fieldErrors.email)}
            errorText={fieldErrors.email}
          />
          <InputField
            id="login-password"
            type="password"
            placeholder={t("authForm.passwordLabel")}
            value={password}
            onChange={(nextValue) => handlePasswordChange(nextValue as string)}
            autoComplete="current-password"
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
