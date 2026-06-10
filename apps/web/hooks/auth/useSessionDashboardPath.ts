"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { authStorage } from "@/lib/auth/authStorage";
import { STORED_LOGIN_USER_UPDATED } from "@/lib/auth/storageKeys";
import { getDashboardPathForRole } from "@/utils/path";

const SESSION_CHECK_INTERVAL_MS = 60 * 60 * 1000;

function readSessionDashboardPath() {
  if (!authStorage.hasSession()) return null;

  const role = authStorage.getRole();
  return role ? getDashboardPathForRole(role) : null;
}

function subscribe(callback: () => void) {
  window.addEventListener(STORED_LOGIN_USER_UPDATED, callback);
  return () => window.removeEventListener(STORED_LOGIN_USER_UPDATED, callback);
}

function getServerSnapshot(): null {
  return null;
}

export function useSessionDashboardPath() {
  const dashboardPath = useSyncExternalStore(
    subscribe,
    readSessionDashboardPath,
    getServerSnapshot,
  );

  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scheduleExpiry = () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);

      const expiresAt = authStorage.getSessionExpiresAt();
      if (!expiresAt) return;

      const delay = expiresAt - Date.now();
      timerRef.current = window.setTimeout(
        () => {
          window.dispatchEvent(new Event(STORED_LOGIN_USER_UPDATED));
          scheduleExpiry();
        },
        Math.max(0, Math.min(delay, SESSION_CHECK_INTERVAL_MS)),
      );
    };

    scheduleExpiry();
    window.addEventListener(STORED_LOGIN_USER_UPDATED, scheduleExpiry);

    return () => {
      window.removeEventListener(STORED_LOGIN_USER_UPDATED, scheduleExpiry);
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    };
  }, []);

  return dashboardPath;
}
