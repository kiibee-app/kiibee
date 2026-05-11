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

export type LogoutResponse = {
  success?: boolean;
  message?: string;
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
