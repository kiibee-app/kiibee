"use client";

import { PATHS } from "@/utils/path";
import { PasswordVisibility } from "@/utils/signup";
import { useViewerSignUp } from "./useViewerSignUp";
import { useAuthSession } from "./useAuthSession";
import { useAuthForm } from "./useAuthForm";
import { viewerSignUpFormBase } from "./authFormConfigs";

import { UNDEFINED_STRING, REDIRECT_NEXT_QUERY_PARAM } from "@/utils/Constants";

export function useViewerSignUpForm(options?: {
  onSuccessOverride?: (response: unknown) => void;
}) {
  const { setSession } = useAuthSession();
  const form = useAuthForm({
    ...viewerSignUpFormBase,
    useMutation: useViewerSignUp,
    onSuccess: (response, { router }) => {
      setSession(response);
      if (options?.onSuccessOverride) {
        options.onSuccessOverride(response);
      } else {
        const nextPath =
          typeof window !== UNDEFINED_STRING
            ? new URLSearchParams(window.location.search).get(
                REDIRECT_NEXT_QUERY_PARAM,
              )
            : null;
        if (nextPath) {
          router.push(
            `${PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES}?${REDIRECT_NEXT_QUERY_PARAM}=${encodeURIComponent(nextPath)}`,
          );
        } else {
          router.push(PATHS.AUTH_SIGNUP_VIEWER_PREFERENCES);
        }
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
