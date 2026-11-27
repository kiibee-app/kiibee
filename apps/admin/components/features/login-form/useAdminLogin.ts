"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLogin } from "../../../hooks/api/use-login";
import { useAdminTokens } from "../../../utils/token";
import type { AdminMfaChallenge, LoginSuccess } from "../../../types/api";

export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [code, setCode] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [challenge, setChallenge] = useState<AdminMfaChallenge | null>(null);
  const [pendingLogin, setPendingLogin] = useState<LoginSuccess | null>(null);
  const loginMutation = useLogin();
  const { setTokens } = useAdminTokens();

  const finishLogin = (data: LoginSuccess) => {
    const name = data.fullName?.trim() || data.email.split("@")[0] || "Admin";
    setPendingLogin(null);
    setPin("");
    setCode("");
    setChallenge(null);
    loginMutation.reset();
    queryClient.clear();
    setTokens(data.accessToken, data.refreshToken);
    toast.success(`Welcome, ${name}!`);
    router.push("/");
  };

  const reset = () => {
    setChallenge(null);
    setCode("");
    setPin("");
    setUseRecovery(false);
    loginMutation.reset();
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginMutation.isPending) return;
    loginMutation.mutate(
      {
        email,
        password: pin,
        ...(challenge
          ? useRecovery && !challenge.setupRequired
            ? { recoveryCode: code.trim() }
            : { twoFactorCode: code.trim() }
          : {}),
      },
      {
        onSuccess: (data) => {
          if ("requiresTwoFactor" in data) {
            setChallenge(data);
            setCode("");
            setUseRecovery(false);
            return;
          }
          setPin("");
          setCode("");
          if (data.recoveryCodes?.length) {
            setPendingLogin(data);
            setChallenge(null);
            loginMutation.reset();
          } else finishLogin(data);
        },
        onError: (error) => toast.error(error.message || "Login failed"),
      },
    );
  };

  const downloadRecoveryCodes = () => {
    if (!pendingLogin?.recoveryCodes) return;
    const blob = new Blob(
      [
        `Kiibee Admin recovery codes\nAccount: ${email}\nKeep these private. Each code can be used once to set up a replacement authenticator.\n\n${pendingLogin.recoveryCodes.join("\n")}\n`,
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kiibee-admin-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    email,
    pin,
    code,
    setEmail,
    setPin,
    setCode,
    challenge,
    useRecovery,
    toggleRecovery: () => {
      setUseRecovery(!useRecovery);
      setCode("");
      loginMutation.reset();
    },
    pendingLogin,
    finishLogin,
    downloadRecoveryCodes,
    reset,
    loginMutation,
    handleLogin,
  };
}
