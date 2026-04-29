"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLogoIcon from "../../../assets/icons/AdminLogoIcon";
import ErrorIcon from "../../../assets/icons/ErrorIcon";
import {
  Card,
  ErrorBox,
  ErrorText,
  Field,
  Form,
  Header,
  IconWrap,
  Input,
  Label,
  LoginButton,
  Spinner,
  Subtitle,
  Title,
  Wrap,
} from "./Login.styles";
import { ADMIN_EMAIL, ADMIN_PIN } from "../../../utils/admin-credentials";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        pin.trim() === ADMIN_PIN
      ) {
        localStorage.setItem("adminLoggedIn", "true");
        document.cookie =
          "adminLoggedIn=true; Path=/; Max-Age=86400; SameSite=Lax";
        setError("");
        router.push("/dashboard");
        setIsLoading(false);
        return;
      }

      setError(`Invalid credentials. Try ${ADMIN_EMAIL} / ${ADMIN_PIN}`);
      setIsLoading(false);
    }, 600);
  };

  return (
    <Wrap>
      <Card>
        <Header>
          <IconWrap>
            <AdminLogoIcon />
          </IconWrap>
          <Title>Admin Login</Title>
          <Subtitle>Use your email and PIN to access the dashboard.</Subtitle>
        </Header>

        <Form onSubmit={handleLogin}>
          <Field>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="pin">Security PIN</Label>
            <Input
              id="pin"
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              required
            />
          </Field>

          {error ? (
            <ErrorBox>
              <ErrorIcon />
              <ErrorText>{error}</ErrorText>
            </ErrorBox>
          ) : null}

          <LoginButton type="submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : "Login"}
          </LoginButton>
        </Form>
      </Card>
    </Wrap>
  );
}
