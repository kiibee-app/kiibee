"use client";

import { FormEvent, useState } from "react";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";
import GenericButton from "@/components/UI/GenericButton";
import InputField from "@/components/UI/InputFields";
import { MonoText } from "@/components/UI/Monotext";
import { Card, Description, Form, Title, Wrapper } from "./styles";

export default function ForgetPasswordForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
  };

  return (
    <Wrapper>
      <Card>
        <Image src={logo} alt="Kiibee Logo" width={42} height={42} priority />
        <Title>
          <MonoText $use="H4_Medium">{t("forgotPassword.title")}</MonoText>
        </Title>
        <Description>
          <MonoText $use="Body_Regular">
            {t("forgotPassword.description")}
          </MonoText>
        </Description>
        <Form onSubmit={handleSubmit}>
          <InputField
            id="forgot-password-email"
            type="email"
            placeholder={t("forgotPassword.emailLabel")}
            value={email}
            onChange={(nextValue) => setEmail(nextValue as string)}
            autoComplete="email"
          />
          <GenericButton type="submit">
            {t("forgotPassword.submit")}
          </GenericButton>
        </Form>
      </Card>
    </Wrapper>
  );
}
