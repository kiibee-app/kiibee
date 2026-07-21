"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLogin } from "../../../hooks/api/use-login";
import { useAdminTokens } from "../../../utils/token";

export function useAdminLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const loginMutation = useLogin();
  const { setTokens } = useAdminTokens();

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loginMutation.mutate(
      { email, password: pin },
      {
        onSuccess: (data) => {
          const safeFullName =
            data.fullName?.trim() ||
            (data.email.includes("@") ? data.email.split("@")[0] : "Admin");

          queryClient.clear();
          setTokens(data.accessToken, data.refreshToken);
          toast.success(`Welcome, ${safeFullName}!`);
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.message || "Login failed");
        },
      },
    );
  };

  return {
    email,
    pin,
    setEmail,
    setPin,
    loginMutation,
    handleLogin,
  };
}
