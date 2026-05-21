"use client";

import { API } from "@/lib/http/api/endpoints";
import { AUTH_STORAGE_KEYS } from "@/lib/auth/storageKeys";
import { usePostAPI } from "@/lib/http/api/postApi";
import { PATHS } from "@/utils/path";
import { toTrimmedString } from "@/utils/Constants";
import { isBrowser } from "@/utils/ui";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    user?: LoginUser;
    role?: string;
    status?: string;
    [key: string]: unknown;
  };
  user?: LoginUser;
  role?: string;
  status?: string;
};

export type LoginUser = {
  id?: string;
  fullName?: string | null;
  email?: string;
  role?: string;
  status?: string;
  avatarUrl?: string | null;
  [key: string]: unknown;
};

const USER_ROLES = {
  VIEWER: "viewer",
} as const;

export const STORED_LOGIN_USER_UPDATED = "kiibee:user-updated";

const notifyStoredLoginUserUpdated = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(STORED_LOGIN_USER_UPDATED));
};

export const readStoredLoginUser = (): LoginUser | null => {
  if (!isBrowser) return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);
    return raw ? (JSON.parse(raw) as LoginUser) : null;
  } catch {
    return null;
  }
};

export type LogoutResponse = {
  success?: boolean;
  message?: string;
};

export const mergeStoredLoginUser = (partial: Partial<LoginUser>) => {
  if (!isBrowser) return;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);
    const prev = raw ? (JSON.parse(raw) as LoginUser) : {};
    window.localStorage.setItem(
      AUTH_STORAGE_KEYS.user,
      JSON.stringify({ ...prev, ...partial }),
    );
    notifyStoredLoginUserUpdated();
  } catch {}
};

export const persistLoginSession = (response: LoginResponse) => {
  if (!isBrowser) {
    return;
  }

  const accessToken =
    response.accessToken ??
    response.token ??
    response.data?.accessToken ??
    response.data?.token;
  const refreshToken = response.refreshToken ?? response.data?.refreshToken;
  const user = response.user ?? response.data?.user;

  if (accessToken) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  }

  if (refreshToken) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  }

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
    notifyStoredLoginUserUpdated();
  }
};

export const clearLoginSession = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  notifyStoredLoginUserUpdated();
};

export const getStoredLoginUserEmail = () => {
  if (!isBrowser) {
    return "";
  }

  try {
    const rawUser = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);
    if (!rawUser) return "";

    const parsedUser = JSON.parse(rawUser) as LoginUser;
    return toTrimmedString(parsedUser.email);
  } catch {
    return "";
  }
};

export const getPostLoginPath = (response: LoginResponse) => {
  const user = (response.user ?? response.data?.user) as LoginUser | undefined;
  const role = (user?.role ?? response.role ?? response.data?.role ?? "")
    .toString()
    .toLowerCase();

  return role === USER_ROLES.VIEWER
    ? PATHS.DASHBOARD_VIEWER
    : PATHS.DASHBOARD_CREATOR;
};

export const useLogin = () =>
  usePostAPI<LoginResponse, LoginPayload>(API.auth.login);

export const useLogoutMutation = () =>
  usePostAPI<LogoutResponse, void>(API.auth.logout);
