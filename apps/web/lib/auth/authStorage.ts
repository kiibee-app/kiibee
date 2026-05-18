import { STORED_LOGIN_USER_UPDATED } from "@/hooks/auth/useLogin";
import { AUTH_STORAGE_KEYS } from "./storageKeys";
import { isBrowser } from "@/utils/ui";

const notifyStoredLoginUserUpdated = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(STORED_LOGIN_USER_UPDATED));
};

type AuthSessionPayload = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: unknown;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    user?: unknown;
  };
};

export const authStorage = {
  getAccessToken: () => {
    if (!isBrowser) return null;
    return window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  },
  getRefreshToken: () => {
    if (!isBrowser) return null;
    return window.localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
  },
  getUser: () => {
    if (!isBrowser) return null;
    const userStr = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setSession: (payload: AuthSessionPayload) => {
    if (!isBrowser) return null;

    const accessToken =
      payload.accessToken ??
      payload.token ??
      payload.data?.accessToken ??
      payload.data?.token;
    const refreshToken = payload.refreshToken ?? payload.data?.refreshToken;
    const user = payload.user ?? payload.data?.user;

    if (accessToken) {
      window.localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
    }

    if (refreshToken) {
      window.localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
    }

    if (user !== undefined && user !== null) {
      window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
      notifyStoredLoginUserUpdated();
    }

    return accessToken ?? null;
  },
  clearSession: () => {
    if (!isBrowser) return;
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
    window.localStorage.removeItem(AUTH_STORAGE_KEYS.user);
    notifyStoredLoginUserUpdated();
  },
};
