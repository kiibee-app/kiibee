"use client";

import { useState } from "react";
import { getPostLoginPath, useLogin } from "./useLogin";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { loginFormBase } from "./authFormConfigs";

export function useLoginForm() {
  const { setSession } = useAuthSession();
  const [remember, setRemember] = useState(false);
  const form = useAuthForm({
    ...loginFormBase,
    useMutation: useLogin,
    onSuccess: (response, { router }) => {
      setSession(response);
      router.push(getPostLoginPath(response));
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
