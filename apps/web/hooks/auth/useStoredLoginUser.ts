"use client";

import { useEffect, useState } from "react";
import { readStoredLoginUser, type LoginUser } from "@/hooks/auth/useLogin";
import { STORED_LOGIN_USER_UPDATED } from "@/lib/auth/storageKeys";
import { toTrimmedString } from "@/utils/Constants";

export function useStoredLoginUser() {
  const [user, setUser] = useState<LoginUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(readStoredLoginUser());

    sync();
    window.addEventListener(STORED_LOGIN_USER_UPDATED, sync);
    return () => window.removeEventListener(STORED_LOGIN_USER_UPDATED, sync);
  }, []);

  return user;
}

export function getLoginUserInitial(user: LoginUser | null): string {
  const fullName = toTrimmedString(user?.fullName);
  if (fullName) return fullName.charAt(0).toUpperCase();

  const firstName = toTrimmedString(user?.firstName);
  if (firstName) return firstName.charAt(0).toUpperCase();

  const email = toTrimmedString(user?.email);
  return email ? email.charAt(0).toUpperCase() : "?";
}

export function getLoginUserEmail(user: LoginUser | null): string {
  return toTrimmedString(user?.email);
}
