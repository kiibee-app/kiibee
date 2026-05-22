"use client";

import { useEffect, useState } from "react";
import { authStorage } from "@/lib/auth/authStorage";
import { STORED_LOGIN_USER_UPDATED } from "@/lib/auth/storageKeys";
import { getDashboardPathForRole } from "@/utils/path";

const SESSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;

function readSessionDashboardPath() {
  if (!authStorage.hasSession()) return null;

  const role = authStorage.getRole();
  return role ? getDashboardPathForRole(role) : null;
}

export function useSessionDashboardPath() {
  const [dashboardPath, setDashboardPath] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number | undefined;

    const sync = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);

      setDashboardPath(readSessionDashboardPath());

      const expiresAt = authStorage.getSessionExpiresAt();
      if (!expiresAt) return;

      const delay = expiresAt - Date.now();
      timeoutId = window.setTimeout(
        sync,
        Math.max(0, Math.min(delay, SESSION_CHECK_INTERVAL_MS)),
      );
    };

    sync();
    window.addEventListener(STORED_LOGIN_USER_UPDATED, sync);

    return () => {
      window.removeEventListener(STORED_LOGIN_USER_UPDATED, sync);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return dashboardPath;
}
