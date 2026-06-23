"use client";

import { PATHS, isSafePostLoginPath } from "@/utils/path";
import { PasswordVisibility } from "@/utils/signup";
import { useViewerSignUp } from "./useViewerSignUp";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { viewerSignUpFormBase } from "./authFormConfigs";

export function useViewerSignUpForm() {
  const { setSession } = useAuthSession();
  const form = useAuthForm({
    ...viewerSignUpFormBase,
    useMutation: useViewerSignUp,
    onSuccess: (response, { router }) => {
      setSession(response);
      const nextPath = new URLSearchParams(window.location.search).get("next");
      if (isSafePostLoginPath(nextPath)) {
        router.push(
          `${PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES}?next=${encodeURIComponent(nextPath)}`,
        );
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
