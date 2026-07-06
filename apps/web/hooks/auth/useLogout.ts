"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { PATHS } from "@/utils/path";
import { toast } from "react-toastify";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useLogoutMutation } from "@/hooks/auth/useLogin";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearSession } = useAuthSession();
  const { mutateAsync: logoutRequest, isPending } = useLogoutMutation();

  const logout = useCallback(
    async (redirectTo?: string) => {
      try {
        await logoutRequest();
      } catch {
        toast.error("Logout failed. Please try again.");
      } finally {
        clearSession();
        queryClient.clear();
        router.push(redirectTo || PATHS.AUTH_LOGIN);
      }
    },
    [clearSession, logoutRequest, queryClient, router],
  );

  return {
    logout,
    isPending,
  };
};
