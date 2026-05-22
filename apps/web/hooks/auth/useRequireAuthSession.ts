"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { PATHS } from "@/utils/path";

const SESSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function useRequireAuthSession() {
  const router = useRouter();

  useEffect(() => {
    let timeoutId: number | undefined;

    const redirectToLogin = () => {
      authStorage.clearSession();
      router.replace(PATHS.AUTH_LOGIN);
    };

    const scheduleSessionCheck = () => {
      if (!authStorage.hasSession()) {
        redirectToLogin();
        return;
      }

      const expiresAt = authStorage.getSessionExpiresAt();
      if (!expiresAt) return;

      const delay = expiresAt - Date.now();

      if (delay <= 0) {
        redirectToLogin();
        return;
      }

      timeoutId = window.setTimeout(
        scheduleSessionCheck,
        Math.min(delay, SESSION_CHECK_INTERVAL_MS),
      );
    };

    scheduleSessionCheck();

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [router]);
}
