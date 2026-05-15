"use client";

import { useEffect, useState } from "react";
import {
  readStoredLoginUser,
  STORED_LOGIN_USER_UPDATED,
  type LoginUser,
} from "@/hooks/auth/useLogin";

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
  const fullName =
    typeof user?.fullName === "string" ? user.fullName.trim() : "";
  if (fullName) return fullName.charAt(0).toUpperCase();

  const firstName =
    typeof user?.firstName === "string" ? user.firstName.trim() : "";
  if (firstName) return firstName.charAt(0).toUpperCase();

  const email = typeof user?.email === "string" ? user.email.trim() : "";
  return email ? email.charAt(0).toUpperCase() : "?";
}

export function getLoginUserEmail(user: LoginUser | null): string {
  return typeof user?.email === "string" ? user.email.trim() : "";
}
