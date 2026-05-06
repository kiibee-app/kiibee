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

export const AUTH_STORAGE_KEYS = {
  accessToken: "kiibee.accessToken",
  refreshToken: "kiibee.refreshToken",
  user: "kiibee.user",
} as const;

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = () => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
};

export const getRefreshToken = () => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
};

export const clearAuthSession = () => {
  if (!isBrowser()) return;

  window.localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.user);
};

export const persistAuthSession = (payload: AuthSessionPayload) => {
  if (!isBrowser()) return null;

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

  if (user) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
  }

  return accessToken ?? null;
};
