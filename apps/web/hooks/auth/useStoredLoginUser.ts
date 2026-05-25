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

export function getNameInitials(name: string): string {
  const trimmed = toTrimmedString(name);
  if (!trimmed) return "?";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first} ${last}`;
}

export function getLoginUserInitial(user: LoginUser | null): string {
  const firstName = toTrimmedString(user?.firstName);
  const lastName = toTrimmedString(user?.lastName);
  if (firstName || lastName) {
    return getNameInitials([firstName, lastName].filter(Boolean).join(" "));
  }

  const fullName = toTrimmedString(user?.fullName);
  if (fullName) return getNameInitials(fullName);

  const email = toTrimmedString(user?.email);
  return email ? email.charAt(0).toUpperCase() : "?";
}

export function getLoginUserEmail(user: LoginUser | null): string {
  return toTrimmedString(user?.email);
}

export function getLoginUserDisplayName(user: LoginUser | null): string {
  const fullName = toTrimmedString(user?.fullName);
  if (fullName) return fullName;

  const firstName = toTrimmedString(user?.firstName);
  const lastName = toTrimmedString(user?.lastName);
  const combined = [firstName, lastName].filter(Boolean).join(" ");
  if (combined) return combined;

  return getLoginUserEmail(user);
}

export function getDisplayInitial(
  displayName: string,
  user: LoginUser | null,
): string {
  const trimmed = toTrimmedString(displayName);
  if (trimmed) return getNameInitials(trimmed);

  return getLoginUserInitial(user);
}
