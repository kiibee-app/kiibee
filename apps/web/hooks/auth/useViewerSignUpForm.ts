"use client";

import { useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { normalizeApiError } from "@/lib/http/errors/apiError";
import {
  INITIAL_VIEWER_FORM,
  PASSWORD_FIELD_KEYS,
  PasswordVisibility,
  ViewerFormValues,
  ViewerFieldKey,
  VIEWER_FIELDS,
} from "@/utils/signup";
import { useViewerSignUp } from "./useViewerSignUp";
import { PATHS } from "@/utils/path";
import { persistAuthSession } from "@/lib/auth/authSession";

export type PasswordFieldKey = keyof PasswordVisibility;

export function useViewerSignUpForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutateAsync: viewerSignUp, isPending: isSubmitting } =
    useViewerSignUp();
  const [formValues, setFormValues] =
    useState<ViewerFormValues>(INITIAL_VIEWER_FORM);
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      password: false,
      repeatPassword: false,
    });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const passwordsDoNotMatch =
    formValues.repeatPassword.length > 0 &&
    formValues.password !== formValues.repeatPassword;

  const isSubmitEnabled = useMemo(
    () =>
      VIEWER_FIELDS.every((field) => Boolean(formValues[field.key].trim())) &&
      formValues.agreed &&
      !passwordsDoNotMatch,
    [formValues, passwordsDoNotMatch],
  );

  const updateField = (
    field: keyof ViewerFormValues,
    value: string | boolean,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (formError) {
      setFormError("");
    }
  };

  const togglePassword = (key: keyof PasswordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getSubmitErrorMessage = () => {
    if (passwordsDoNotMatch) {
      return t("viewerSignup.form.passwordMismatch");
    }

    return t("viewerSignup.form.fixHighlightedFields");
  };

  const getPayload = () => ({
    fullName: formValues.fullName.trim(),
    email: formValues.email.trim(),
    password: formValues.password,
    confirmPassword: formValues.repeatPassword,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isSubmitEnabled) {
      setFormError(getSubmitErrorMessage());
      return;
    }
    setFormError("");

    try {
      const response = await viewerSignUp(getPayload());

      persistAuthSession(response);
      router.push(PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES);
    } catch (err) {
      const apiError = normalizeApiError(err);
      setFormError(apiError.message || t("viewerSignup.form.signupFailed"));
    }
  };

  const isPasswordField = (
    fieldKey: ViewerFieldKey,
  ): fieldKey is PasswordFieldKey =>
    PASSWORD_FIELD_KEYS.includes(fieldKey as PasswordFieldKey);

  return {
    formValues,
    passwordVisibility,
    submitted,
    formError,
    isSubmitting,
    isSubmitEnabled,
    passwordsDoNotMatch,
    updateField,
    togglePassword,
    handleSubmit,
    isPasswordField,
  };
}
