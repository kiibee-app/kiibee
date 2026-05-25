"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPostLoginPath, useLogin } from "./useLogin";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { loginFormBase } from "./authFormConfigs";
import {
  AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
  REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth/storageKeys";
export function useLoginForm() {
  const { setSession } = useAuthSession();
  const searchParams = useSearchParams();
  const [remember, setRemember] = useState(false);
  const form = useAuthForm({
    ...loginFormBase,
    useMutation: useLogin,
    onSuccess: (response, { router }) => {
      setSession(response, {
        maxAgeSeconds: remember
          ? REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS
          : AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
      });

      const nextPath = searchParams.get("next");
      const destination = nextPath?.startsWith("/dashboard/")
        ? nextPath
        : getPostLoginPath(response);

      router.push(destination);
    },
  });

  return {
    ...form,
    remember,
    setRemember,
    handleFieldChange: form.updateField,
    isPasswordVisible: form.passwordVisibility as boolean,
    togglePassword: form.togglePassword,
  };
}
