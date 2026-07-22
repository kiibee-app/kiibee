"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PATHS } from "@/utils/path";
import { toast } from "react-toastify";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useLogoutMutation } from "@/hooks/auth/useLogin";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearSession } = useAuthSession();
  const { mutateAsync: logoutRequest, isPending } = useLogoutMutation();

  const logout = useCallback(
    async (redirectTo?: string) => {
      await queryClient.cancelQueries();

      try {
        await logoutRequest();
      } catch {
        toast.error("Logout failed. Please try again.");
      } finally {
        clearSession();
        window.location.replace(redirectTo || PATHS.AUTH_LOGIN);
      }
    },
    [clearSession, logoutRequest, queryClient],
  );

  return {
    logout,
    isPending,
  };
};
