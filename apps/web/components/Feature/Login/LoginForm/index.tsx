"use client";

import { FormEvent, useState } from "react";
import InputField from "@/components/UI/InputFields";
import {
  Card,
  FooterText,
  Form,
  ForgotLink,
  LogoCircle,
  OptionsRow,
  RememberLabel,
  SignUpLink,
  SubmitButton,
  Title,
  Wrapper,
} from "./styles";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }

    console.log({ email, password, remember });
  };

  return (
    <Wrapper>
      <Card>
        <LogoCircle>k</LogoCircle>
        <Title>Log in</Title>
        <Form onSubmit={handleSubmit}>
          <InputField
            id="login-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(nextValue) => setEmail(nextValue as string)}
            required
            autoComplete="email"
          />
          <InputField
            id="login-password"
            // type="password"
            placeholder="Password"
            value={password}
            onChange={(nextValue) => setPassword(nextValue as string)}
            required
            autoComplete="current-password"
          />
          <OptionsRow>
            <RememberLabel>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((prev) => !prev)}
              />
              Remember me
            </RememberLabel>
            <ForgotLink href="/forgot-password">
              Forgot your password?
            </ForgotLink>
          </OptionsRow>
          <SubmitButton type="submit">Log in</SubmitButton>
        </Form>
        <FooterText>
          Don’t have an account?
          <SignUpLink href="/sign-up">Sign up</SignUpLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}
