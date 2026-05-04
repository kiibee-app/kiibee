"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
import { useLogin } from "../../../hooks/api/use-login";
import { decodeToken, setTokens } from "../../../utils/token";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const loginMutation = useLogin();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loginMutation.mutate(
      { email, password: pin },
      {
        onSuccess: (data) => {
          const decodedToken = decodeToken(data.accessToken);
          const fullAuthPayload = { ...data, tokenClaims: decodedToken };
          console.log("Current User:", fullAuthPayload);

          if (decodedToken?.role !== "admin") {
            toast.error("Access denied. Admin role required.");
            return;
          }

          setTokens(data.accessToken, data.refreshToken);
          localStorage.setItem(
            "admin.authPayload",
            JSON.stringify(fullAuthPayload),
          );
          toast.success(`Welcome, ${data.fullName}!`);
          router.push("/profile");
        },
        onError: (error) => {
          toast.error(error.message || "Login failed");
        },
      },
    );
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

          {loginMutation.isError ? (
            <ErrorBox>
              <ErrorIcon />
              <ErrorText>{loginMutation.error?.message}</ErrorText>
            </ErrorBox>
          ) : null}

          <LoginButton type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? <Spinner /> : "Login"}
          </LoginButton>
        </Form>
      </Card>
    </Wrap>
  );
}
