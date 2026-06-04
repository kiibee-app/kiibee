"use client";

import { useState } from "react";
import { getPostLoginPath, useLogin, type LoginResponse } from "./useLogin";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { loginFormBase } from "./authFormConfigs";
import {
  AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
  REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth/storageKeys";
const ALLOWED_NEXT_PREFIXES = ["/dashboard/", "/creator/"];

function getPostLoginDestination(response: LoginResponse) {
  if (typeof window === "undefined") return getPostLoginPath(response);

  const nextPath = new URLSearchParams(window.location.search).get("next");
  if (
    nextPath &&
    ALLOWED_NEXT_PREFIXES.some((prefix) => nextPath.startsWith(prefix))
  ) {
    return nextPath;
  }
  return getPostLoginPath(response);
}

export function useLoginForm() {
  const { setSession } = useAuthSession();
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

      router.push(getPostLoginDestination(response));
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
