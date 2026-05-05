"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLoginFormSchema } from "@/utils/useLoginFormSchema";
import type { LoginFormErrors } from "@/utils/authLoginFormSchema";
import z from "zod";
import { getPostLoginPath, persistLoginSession, useLogin } from "./useLogin";

export function useLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const loginSchema = useLoginFormSchema();
  const { mutateAsync: login, isPending } = useLogin();
  const isMounted = useRef(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const clearErrors = () => {
    setFieldErrors({});
    setFormError("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email || formError) {
      setFieldErrors((p) => ({ ...p, email: undefined }));
      setFormError("");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password || formError) {
      setFieldErrors((p) => ({ ...p, password: undefined }));
      setFormError("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const tree = z.treeifyError(parsed.error);
      const errors = {
        email: tree.properties?.email?.errors?.[0],
        password: tree.properties?.password?.errors?.[0],
      };

      if (isMounted.current) {
        setFieldErrors(errors);
        setFormError(t("authForm.errors.fixHighlightedFields"));
      }

      return;
    }

    clearErrors();

    try {
      const response = await login(parsed.data);
      if (!response.success) {
        if (isMounted.current) {
          setFormError(response.message || t("authForm.errors.submitFailed"));
        }
        return;
      }
      persistLoginSession(response);
      router.push(getPostLoginPath(response));
    } catch (error) {
      if (!isMounted.current) return;

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
