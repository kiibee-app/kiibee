"use client";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { PATHS } from "@/utils/path";
import { useCreatorRequest } from "./useCreatorRequest";
import { useAuthForm } from "./useAuthForm";
import { creatorRequestFormBase } from "./authFormConfigs";
import {
  applyDigitsOnlyInput,
  CREATOR_SIGNUP_DIGITS_ONLY_SET,
} from "@/utils/numericFields";

export type { CreatorRequestValues } from "./authFormConfigs";

export function useCreatorRequestForm() {
  const { t } = useTranslation();
  const form = useAuthForm({
    ...creatorRequestFormBase,
    useMutation: useCreatorRequest,
    onSuccess: (response, { router, reset, setSuccessFeedback }) => {
      const successMessage =
        response.message || t("authCreator.form.submitSuccess");
      toast.success(successMessage);
      setSuccessFeedback(successMessage);
      reset();
      router.push(PATHS.AUTH_CREATOR_REQUEST_SENT);
    },
  });

  const updateField = (
    field: Parameters<typeof form.updateField>[0],
    value: string | boolean,
  ) => {
    const nextValue =
      typeof value === "string"
        ? applyDigitsOnlyInput(field, value, CREATOR_SIGNUP_DIGITS_ONLY_SET)
        : value;

    form.updateField(field, nextValue);
  };

  return { ...form, updateField, handleFormSubmit: form.handleSubmit };
}
