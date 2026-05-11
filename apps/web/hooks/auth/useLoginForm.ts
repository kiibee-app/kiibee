"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createLoginSchema } from "@/lib/validation/schema";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { getPostLoginPath, persistLoginSession, useLogin } from "./useLogin";

export function useLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const { mutateAsync: login, isPending: isSubmitting } = useLogin();
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();

  const [formError, setFormError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        passwordRequired: t("authForm.errors.passwordRequired"),
      }),
    [t],
  );

  type LoginFormValues = ReturnType<typeof schema.parse>;

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { isValid },
  } = methods;

  const handleFieldChange = (field: keyof LoginFormValues, value: string) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    clearErrors(field);
    if (formError) setFormError("");
  };

  const togglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setFormError("");

    try {
      const response = await login(values);

      if (response.success === false) {
        setFormError(response.message || t("authForm.errors.submitFailed"));
        return;
      }

      persistLoginSession(response);
      router.push(getPostLoginPath(response));
    } catch (error) {
      applyFieldErrors(error, setError);
      setFormError(getErrorMessage(error, "authForm.errors.submitFailed"));
    }
  };

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
    handleSubmit: handleSubmit(onSubmit),
  };
}
