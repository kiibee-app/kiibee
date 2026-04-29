"use client";

import { API } from "@/lib/http/api/endpoints";
import { usePostAPI } from "@/lib/http/api/postApi";

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
    user?: unknown;
    [key: string]: unknown;
  };
  user?: unknown;
};

const ACCESS_TOKEN_KEY = "kiibee.accessToken";
const REFRESH_TOKEN_KEY = "kiibee.refreshToken";
const USER_KEY = "kiibee.user";

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

export const useLogin = () =>
  usePostAPI<LoginResponse, LoginPayload>(API.auth.login);
