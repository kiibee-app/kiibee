"use client";

import { API } from "@/lib/http/api/endpoints";
import { authStorage } from "@/lib/auth/authStorage";
import { usePostAPI } from "@/lib/http/api/postApi";
import { getDashboardPathForRole } from "@/utils/path";

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

export const readStoredLoginUser = (): LoginUser | null => {
  return authStorage.getUser() as LoginUser | null;
};

export type LogoutResponse = {
  success?: boolean;
  message?: string;
};

export const mergeStoredLoginUser = (partial: Partial<LoginUser>) => {
  authStorage.mergeUser(partial);
};

export const getPostLoginPath = (response: LoginResponse) => {
  const user = (response.user ?? response.data?.user) as LoginUser | undefined;
  return getDashboardPathForRole(
    user?.role ?? response.role ?? response.data?.role,
  );
};

export const useLogin = () =>
  usePostAPI<LoginResponse, LoginPayload>(API.auth.login);

export const useLogoutMutation = () =>
  usePostAPI<LogoutResponse, void>(API.auth.logout);
