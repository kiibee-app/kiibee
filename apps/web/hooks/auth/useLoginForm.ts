"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLoginFormSchema } from "@/utils/useLoginFormSchema";
import type { LoginFormErrors } from "@/utils/authLoginFormSchema";
import z from "zod";
import { getPostLoginPath, persistLoginSession, useLogin } from "./useLogin";

type ZodTreeNode = {
  errors?: string[];
  properties?: Record<string, ZodTreeNode>;
};

export function useLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const loginSchema = useLoginFormSchema();
  const { mutateAsync: login, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState("");

  const clearErrors = () => {
    setFieldErrors({});
    setFormError("");
  };

  const getValidationErrors = (error: z.ZodError): LoginFormErrors => {
    const tree = z.treeifyError(error) as ZodTreeNode;

    return {
      email: tree.properties?.email?.errors?.[0],
      password: tree.properties?.password?.errors?.[0],
    };
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (fieldErrors.email || formError) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
      setFormError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (fieldErrors.password || formError) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
      setFormError("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setFieldErrors(getValidationErrors(parsed.error));
      setFormError(t("authForm.errors.fixHighlightedFields"));
      return;
    }

    clearErrors();

    try {
      const response = await login(parsed.data);

      if (!response.success) {
        setFormError(response.message || t("authForm.errors.submitFailed"));
        return;
      }

      persistLoginSession(response);
      router.push(getPostLoginPath(response));
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : t("authForm.errors.submitFailed"),
      );
    }
  };

  return {
    state: {
      email,
      password,
      remember,
      fieldErrors,
      formError,
      isPending,
    },
    actions: {
      setRemember,
      handleEmailChange,
      handlePasswordChange,
      handleSubmit,
    },
  };
}
