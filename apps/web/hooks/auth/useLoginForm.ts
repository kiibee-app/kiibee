"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLoginSchema } from "@/lib/validation/schema";
import { getPostLoginPath, useLogin } from "./useLogin";
import { useAuthSession } from "./useAuthSession";
import { useBaseFormHook } from "./useBaseFormHook";

export function useLoginForm() {
  const router = useRouter();
  const { setSession } = useAuthSession();
  const { mutateAsync: login, isPending: isSubmitting } = useLogin();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);

  const { methods, isValid, formError, updateField, handleSubmit } =
    useBaseFormHook({
      createSchema: (t) =>
        createLoginSchema({
          emailRequired: t("authForm.errors.emailRequired"),
          emailInvalid: t("authForm.errors.emailInvalid"),
          passwordRequired: t("authForm.errors.passwordRequired"),
        }),
      defaultValues: { email: "", password: "" },
      fallbackErrorKey: "authForm.errors.submitFailed",
      submit: async (values) => {
        const response = await login(values);
        if (response.success === false) {
          throw new Error(response.message || "");
        }
        setSession(response);
        router.push(getPostLoginPath(response));
      },
    });

  const handleFieldChange = (field: "email" | "password", value: string) =>
    updateField(field, value);
  const togglePassword = () => setIsPasswordVisible((prev) => !prev);

  return {
    methods,
    isValid,
    isSubmitting,
    formError,
    remember,
    setRemember,
    isPasswordVisible,
    handleFieldChange,
    togglePassword,
    handleSubmit,
  };
}
