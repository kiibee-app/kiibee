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
import { isSafePostLoginPath } from "@/utils/path";
import { ROLE_ADMIN, STRING } from "@/utils/Constants";

function getPostLoginDestination(response: LoginResponse) {
  if (typeof window === "undefined") return getPostLoginPath(response);

  const nextPath = new URLSearchParams(window.location.search).get("next");
  return isSafePostLoginPath(nextPath) ? nextPath : getPostLoginPath(response);
}

function resolveRole(response: LoginResponse): string | undefined {
  const roles = [
    response.user?.role,
    response.data?.user?.role,
    response.role,
    response.data?.role,
  ];

  return roles.find((role): role is string => typeof role === STRING);
}

export function useLoginForm(options?: {
  onSuccessOverride?: (response: LoginResponse) => void;
}) {
  const { setSession } = useAuthSession();
  const [remember, setRemember] = useState(false);
  const form = useAuthForm({
    ...loginFormBase,
    useMutation: useLogin,
    onSuccess: (response, { router }) => {
      const role = resolveRole(response);

      if (role === ROLE_ADMIN) {
        throw new Error("Admin accounts are not permitted to log in here");
      }

      setSession(response, {
        maxAgeSeconds: remember
          ? REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS
          : AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
      });

      if (options?.onSuccessOverride) {
        options.onSuccessOverride(response);
      } else {
        router.push(getPostLoginDestination(response));
      }
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
