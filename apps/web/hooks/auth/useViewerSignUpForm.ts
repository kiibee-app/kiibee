"use client";

import { PATHS } from "@/utils/path";
import { PasswordVisibility } from "@/utils/signup";
import { useViewerSignUp, ViewerSignUpResponse } from "./useViewerSignUp";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { viewerSignUpFormBase } from "./authFormConfigs";

export type SignUpOptions = {
  onSuccess?: (response: ViewerSignUpResponse) => void;
};

export function useViewerSignUpForm(options?: SignUpOptions) {
  const { setSession } = useAuthSession();
  const form = useAuthForm({
    ...viewerSignUpFormBase,
    useMutation: useViewerSignUp,
    onSuccess: (response, { router }) => {
      setSession(response);
      if (options?.onSuccess) {
        options.onSuccess(response);
      } else {
        router.push(PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES);
      }
    },
  });

  return {
    ...form,
    passwordVisibility: form.passwordVisibility as PasswordVisibility,
    togglePassword: form.togglePassword as (
      field: keyof PasswordVisibility,
    ) => void,
  };
}
