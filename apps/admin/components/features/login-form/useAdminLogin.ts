"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLogin } from "../../../hooks/api/use-login";
import { decodeToken, hasAdminRole, setTokens } from "../../../utils/token";

export function useAdminLogin() {
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

          if (!hasAdminRole(decodedToken)) {
            toast.error("Access denied. Admin role required.");
            return;
          }

          const safeFullName =
            data.fullName?.trim() ||
            (data.email.includes("@") ? data.email.split("@")[0] : "Admin");

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
