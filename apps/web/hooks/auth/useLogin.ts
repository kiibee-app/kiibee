"use client";

import { API } from "@/lib/http/api/endpoints";

import { usePostAPI } from "@/lib/http/api/postApi";
import { PATHS } from "@/utils/path";

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
  email?: string;
  role?: string;
  status?: string;
  [key: string]: unknown;
};

const USER_ROLES = {
  VIEWER: "viewer",
} as const;

const ACCESS_TOKEN_KEY = "kiibee.accessToken";
const REFRESH_TOKEN_KEY = "kiibee.refreshToken";
const USER_KEY = "kiibee.user";
export type LogoutResponse = {
  success?: boolean;
  message?: string;
};

export const persistLoginSession = (response: LoginResponse) => {
  if (typeof window === "undefined") {
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
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearLoginSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};

export const getStoredLoginUserEmail = () => {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const rawUser = window.localStorage.getItem(USER_KEY);
    if (!rawUser) return "";

    const parsedUser = JSON.parse(rawUser) as LoginUser;
    return typeof parsedUser.email === "string" ? parsedUser.email : "";
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

export const useLogout = () =>
  usePostAPI<LogoutResponse, void>(API.auth.logout);