"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createViewerSignupSchema } from "@/lib/validation/schema";
import { PATHS } from "@/utils/path";
import { PasswordVisibility, ViewerFormValues } from "@/utils/signup";
import { useViewerSignUp } from "./useViewerSignUp";
import { useAuthSession } from "./useAuthSession";
import { useBaseFormHook } from "./useBaseFormHook";

export function useViewerSignUpForm() {
  const router = useRouter();
  const { setSession } = useAuthSession();
  const { mutateAsync: viewerSignUp, isPending } = useViewerSignUp();
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      repeatPassword: false,
    });

  const { methods, isValid, errors, formError, updateField, handleSubmit } =
    useBaseFormHook<ViewerFormValues>({
      createSchema: (t) =>
        createViewerSignupSchema({
          fullNameRequired: t("viewerSignup.form.fixHighlightedFields"),
          emailRequired: t("authForm.errors.emailRequired"),
          emailInvalid: t("authForm.errors.emailInvalid"),
          passwordRequired: t("authForm.errors.passwordRequired"),
          repeatPasswordRequired: t("viewerSignup.form.fixHighlightedFields"),
          passwordMismatch: t("viewerSignup.form.passwordMismatch"),
          consentRequired: t("viewerSignup.form.fixHighlightedFields"),
        }),
      defaultValues: {
        fullName: "",
        email: "",
        password: "",
        repeatPassword: "",
        agreed: false,
      },
      fallbackErrorKey: "viewerSignup.form.signupFailed",
      submit: async (values) => {
        const response = await viewerSignUp({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password,
          confirmPassword: values.repeatPassword,
        });

        if (response.success === false) {
          throw new Error(response.message || "");
        }

        setSession(response);
        router.push(PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES);
      },
    });

  const togglePassword = (field: keyof PasswordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
    handleSubmit,
  };
}
