"use client";

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
import { useAdminLogin } from "./useAdminLogin";

export default function Login() {
  const { email, pin, setEmail, setPin, loginMutation, handleLogin } =
    useAdminLogin();

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
