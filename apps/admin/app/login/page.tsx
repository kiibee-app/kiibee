"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.bg.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text.main};
`;

const Subtitle = styled.p`
  margin: 8px 0 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.text.main};
  font-size: 14px;
`;

const Input = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 12px;
  margin-bottom: 14px;
  font-size: 14px;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.brand.dark};
  color: ${({ theme }) => theme.colors.bg.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const ErrorText = styled.p`
  margin: 2px 0 12px;
  color: #dc2626;
  font-size: 13px;
`;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      email.trim().toLowerCase() === "admin@gmail.com" &&
      pin.trim() === "1234"
    ) {
      localStorage.setItem("adminLoggedIn", "true");
      document.cookie =
        "adminLoggedIn=true; Path=/; Max-Age=86400; SameSite=Lax";
      setError("");
      router.push("/dashboard");
      return;
    }

    setError("Invalid credentials. Try admin@gmail.com / 1234");
  };

  return (
    <Wrap>
      <Card>
        <Title>Admin Login</Title>
        <Subtitle>Use your email and PIN to continue.</Subtitle>

        <form onSubmit={handleLogin}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <Label htmlFor="pin">PIN</Label>
          <Input
            id="pin"
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            required
          />

          {error ? <ErrorText>{error}</ErrorText> : null}

          <LoginButton type="submit">Login</LoginButton>
        </form>
      </Card>
    </Wrap>
  );
}
