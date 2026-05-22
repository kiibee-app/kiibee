"use client";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { PATHS } from "@/utils/path";
import { useCreatorRequest } from "./useCreatorRequest";
import { useAuthForm } from "./useAuthForm";
import { creatorRequestFormBase } from "./authFormConfigs";

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

  return { ...form, handleFormSubmit: form.handleSubmit };
}
