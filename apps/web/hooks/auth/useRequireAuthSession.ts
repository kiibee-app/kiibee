"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { pathLoginWithNext } from "@/utils/path";

const SESSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export function useRequireAuthSession() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;

    const redirectToLogin = () => {
      authStorage.clearSession();
      const search = searchParams?.toString();
      const returnTo = search ? `${pathname}?${search}` : pathname;
      router.replace(pathLoginWithNext(returnTo));
    };

    const scheduleSessionCheck = () => {
      if (!authStorage.hasSession()) {
        setIsReady(false);
        redirectToLogin();
        return;
      }

      setIsReady(true);

      const expiresAt = authStorage.getSessionExpiresAt();
      if (!expiresAt) return;

      const delay = expiresAt - Date.now();

      if (delay <= 0) {
        setIsReady(false);
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
  }, [pathname, router, searchParams]);

  return { isReady };
}
