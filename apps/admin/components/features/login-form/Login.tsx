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
  SecondaryButton,
  RecoveryList,
} from "./Login.styles";
import { AuthenticatorSetup } from "./AuthenticatorSetup";
import { useAdminLogin } from "./useAdminLogin";

export default function Login() {
  const {
    email,
    pin,
    code,
    setEmail,
    setPin,
    setCode,
    challenge,
    useRecovery,
    toggleRecovery,
    pendingLogin,
    finishLogin,
    downloadRecoveryCodes,
    reset,
    loginMutation,
    handleLogin,
  } = useAdminLogin();

  return (
    <Wrap>
      <Card>
        <Header>
          <IconWrap>
            <AdminLogoIcon />
          </IconWrap>
          <Title>
            {pendingLogin
              ? "Save recovery codes"
              : challenge?.setupRequired
                ? "Set up Google Authenticator"
                : challenge
                  ? "Verify your login"
                  : "Admin Login"}
          </Title>
          <Subtitle>
            {pendingLogin
              ? "Keep these codes somewhere safe. They are shown only once. Each code lets you set up a replacement authenticator if you lose your phone."
              : challenge?.setupRequired
                ? "Open Google Authenticator on your phone, tap + → Scan a QR code, and scan the code below. Then enter the 6-digit code shown in the app."
                : challenge
                  ? "Enter the code from Google Authenticator to continue."
                  : "Use your email and PIN to access the dashboard."}
          </Subtitle>
        </Header>
        {pendingLogin ? (
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              finishLogin(pendingLogin);
            }}
          >
            <RecoveryList>
              {pendingLogin.recoveryCodes?.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </RecoveryList>
            <SecondaryButton type="button" onClick={downloadRecoveryCodes}>
              Download recovery codes
            </SecondaryButton>
            <LoginButton type="submit">
              I have saved my codes — continue
            </LoginButton>
          </Form>
        ) : (
          <Form onSubmit={handleLogin}>
            {!challenge ? (
              <>
                <Field>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={loginMutation.isPending}
                  />
                </Field>
                <Field>
                  <Label htmlFor="pin">Security PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••"
                    value={pin}
                    onChange={(event) => setPin(event.target.value)}
                    required
                    disabled={loginMutation.isPending}
                  />
                </Field>
              </>
            ) : (
              <>
                {challenge.setupRequired && challenge.setupKey ? (
                  <AuthenticatorSetup
                    setupKey={challenge.setupKey}
                    accountName={challenge.accountName}
                    email={email}
                  />
                ) : null}
                <Field>
                  <Label htmlFor="verification-code">
                    {useRecovery ? "Recovery code" : "Authenticator code"}
                  </Label>
                  <Input
                    key={`${challenge.setupRequired}-${useRecovery}`}
                    autoFocus
                    id="verification-code"
                    type="text"
                    autoComplete="one-time-code"
                    inputMode={useRecovery ? "text" : "numeric"}
                    pattern={useRecovery ? undefined : "[0-9]{6}"}
                    maxLength={useRecovery ? 64 : 6}
                    placeholder={
                      useRecovery ? "xxxxx-xxxxx-xxxxx-xxxxx" : "000000"
                    }
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    required
                    disabled={loginMutation.isPending}
                  />
                </Field>
              </>
            )}
            {loginMutation.isError ? (
              <ErrorBox role="alert">
                <ErrorIcon />
                <ErrorText>{loginMutation.error?.message}</ErrorText>
              </ErrorBox>
            ) : null}
            <LoginButton type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? (
                <Spinner />
              ) : challenge ? (
                "Verify and continue"
              ) : (
                "Login"
              )}
            </LoginButton>
            {challenge && !challenge.setupRequired ? (
              <SecondaryButton
                type="button"
                onClick={toggleRecovery}
                disabled={loginMutation.isPending}
              >
                {useRecovery
                  ? "Use Google Authenticator"
                  : "Lost your phone? Use a recovery code"}
              </SecondaryButton>
            ) : null}
            {challenge ? (
              <SecondaryButton
                type="button"
                onClick={reset}
                disabled={loginMutation.isPending}
              >
                Back to login
              </SecondaryButton>
            ) : null}
          </Form>
        )}
      </Card>
    </Wrap>
  );
}
