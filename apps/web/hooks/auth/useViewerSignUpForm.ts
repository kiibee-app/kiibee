"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useApiErrorMessage } from "@/lib/http/useApiErrorMessage";
import { createViewerSignupSchema } from "@/lib/validation/schema";
import { PATHS } from "@/utils/path";

import { PasswordVisibility, ViewerFormValues } from "@/utils/signup";
import { useViewerSignUp } from "./useViewerSignUp";
import { useAuthSession } from "./useAuthSession";

export function useViewerSignUpForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setSession } = useAuthSession();
  const { mutateAsync: viewerSignUp, isPending } = useViewerSignUp();
  const { getErrorMessage, applyFieldErrors } = useApiErrorMessage();

  const [formError, setFormError] = useState("");
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      repeatPassword: false,
    });

  const schema = useMemo(
    () =>
      createViewerSignupSchema({
        fullNameRequired: t("viewerSignup.form.fixHighlightedFields"),
        emailRequired: t("authForm.errors.emailRequired"),
        emailInvalid: t("authForm.errors.emailInvalid"),
        passwordRequired: t("authForm.errors.passwordRequired"),
        repeatPasswordRequired: t("viewerSignup.form.fixHighlightedFields"),
        passwordMismatch: t("viewerSignup.form.passwordMismatch"),
        consentRequired: t("viewerSignup.form.fixHighlightedFields"),
      }),
    [t],
  );

  const methods = useForm<ViewerFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      repeatPassword: "",
      agreed: false,
    },
  });

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { isValid, errors },
  } = methods;

  const updateField = (
    field: keyof ViewerFormValues,
    value: string | boolean,
  ) => {
    setValue(field, value as never, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (formError) setFormError("");
  };

  const togglePassword = (field: keyof PasswordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (values: ViewerFormValues) => {
    setFormError("");

    try {
      const response = await viewerSignUp({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.repeatPassword,
      });
      setSession(response);
      router.push(PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES);
    } catch (error) {
      applyFieldErrors(error, setError);
      setFormError(getErrorMessage(error, "viewerSignup.form.signupFailed"));
    }
  };

  return {
    methods,
    isValid,
    errors,
    isSubmitting: isPending,
    formError,
    passwordVisibility,
    updateField,
    togglePassword,
    handleSubmit: handleSubmit(onSubmit),
  };
}
