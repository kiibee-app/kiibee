import {
  AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
  AUTH_STORAGE_KEYS,
  STORED_LOGIN_USER_UPDATED,
} from "./storageKeys";
import { isBrowser } from "@/utils/ui";

const notifyStoredLoginUserUpdated = () => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(STORED_LOGIN_USER_UPDATED));
};

const COOKIE_PATH = "/";
const COOKIE_SAME_SITE = "Lax";
const SESSION_COOKIE_NAMES = Object.values(AUTH_STORAGE_KEYS);
const LEGACY_LOCAL_STORAGE_NAMES = [
  AUTH_STORAGE_KEYS.accessToken,
  AUTH_STORAGE_KEYS.refreshToken,
  AUTH_STORAGE_KEYS.user,
] as const;

type AuthSessionPayload = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  role?: string;
  user?: unknown;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    token?: string;
    role?: string;
    user?: unknown;
  };
};

type AuthSessionOptions = {
  maxAgeSeconds?: number;
};

const getCookie = (name: string) => {
  if (!isBrowser) return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  const value = cookie.slice(name.length + 1);

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const getJsonValue = (value: string | null) => {
  if (!value) return null;

  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token: string | null) => {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );

    return JSON.parse(window.atob(paddedPayload)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const toRole = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const getCookieAttributes = (maxAgeSeconds: number) => {
  const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  return `Path=${COOKIE_PATH}; Max-Age=${maxAgeSeconds}; Expires=${expires}; SameSite=${COOKIE_SAME_SITE}${secure}`;
};

const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds = AUTH_SESSION_COOKIE_MAX_AGE_SECONDS,
) => {
  if (!isBrowser) return;

  document.cookie = `${name}=${encodeURIComponent(value)}; ${getCookieAttributes(
    maxAgeSeconds,
  )}`;
};

const removeCookie = (name: string) => {
  if (!isBrowser) return;

  document.cookie = `${name}=; Path=${COOKIE_PATH}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${COOKIE_SAME_SITE}`;
};

const clearLegacyLocalStorageSession = () => {
  if (!isBrowser) return;

  for (const name of LEGACY_LOCAL_STORAGE_NAMES) {
    window.localStorage.removeItem(name);
  }
};

const getSessionExpiresAt = () => {
  const rawExpiresAt = getCookie(AUTH_STORAGE_KEYS.expiresAt);
  if (!rawExpiresAt) return null;

  const expiresAt = Number(rawExpiresAt);
  return Number.isFinite(expiresAt) ? expiresAt : null;
};

const getRemainingSessionMaxAgeSeconds = () => {
  const expiresAt = getSessionExpiresAt();
  if (!expiresAt) return null;

  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
};

const getStoredRole = () => {
  const storedRole = toRole(getCookie(AUTH_STORAGE_KEYS.role));
  if (storedRole) return storedRole;

  const userRole = toRole(
    getJsonValue(getCookie(AUTH_STORAGE_KEYS.user))?.role,
  );
  if (userRole) return userRole;

  return toRole(
    decodeJwtPayload(getCookie(AUTH_STORAGE_KEYS.accessToken))?.role,
  );
};

const getSessionRole = (payload: AuthSessionPayload) => {
  const user =
    payload.user && typeof payload.user === "object"
      ? (payload.user as Record<string, unknown>)
      : null;
  const dataUser =
    payload.data?.user && typeof payload.data.user === "object"
      ? (payload.data.user as Record<string, unknown>)
      : null;

  return (
    toRole(payload.role) ??
    toRole(payload.data?.role) ??
    toRole(user?.role) ??
    toRole(dataUser?.role)
  );
};

const clearSession = () => {
  if (!isBrowser) return;

  for (const name of SESSION_COOKIE_NAMES) {
    removeCookie(name);
  }
  clearLegacyLocalStorageSession();
  notifyStoredLoginUserUpdated();
};

export const authStorage = {
  getAccessToken: () => {
    return getCookie(AUTH_STORAGE_KEYS.accessToken);
  },
  getRefreshToken: () => {
    return getCookie(AUTH_STORAGE_KEYS.refreshToken);
  },
  hasSession: () => {
    const hasSessionCookie = Boolean(
      getCookie(AUTH_STORAGE_KEYS.accessToken) ||
      getCookie(AUTH_STORAGE_KEYS.refreshToken),
    );
    const expiresAt = getSessionExpiresAt();

    return hasSessionCookie && (!expiresAt || expiresAt > Date.now());
  },
  getSessionExpiresAt: () => {
    return getSessionExpiresAt();
  },
  getUser: () => {
    return getJsonValue(getCookie(AUTH_STORAGE_KEYS.user));
  },
  getRole: () => {
    return getStoredRole();
  },
  setSession: (payload: AuthSessionPayload, options?: AuthSessionOptions) => {
    if (!isBrowser) return null;

    clearLegacyLocalStorageSession();

    const maxAgeSeconds =
      options?.maxAgeSeconds ??
      getRemainingSessionMaxAgeSeconds() ??
      AUTH_SESSION_COOKIE_MAX_AGE_SECONDS;

    if (maxAgeSeconds <= 0) {
      clearSession();
      return null;
    }

    const accessToken =
      payload.accessToken ??
      payload.token ??
      payload.data?.accessToken ??
      payload.data?.token;
    const refreshToken = payload.refreshToken ?? payload.data?.refreshToken;
    let user: unknown = payload.user ?? payload.data?.user;
    if (!user && payload.data && typeof payload.data === "object") {
      const data = payload.data as Record<string, unknown>;
      if (typeof data.email === "string" || typeof data.id === "string") {
        const identity = { ...data };
        delete identity.accessToken;
        delete identity.token;
        delete identity.refreshToken;
        user = identity;
      }
    }
    const role = getSessionRole(payload);

    if (accessToken) {
      setCookie(AUTH_STORAGE_KEYS.accessToken, accessToken, maxAgeSeconds);
    }

    if (refreshToken) {
      setCookie(AUTH_STORAGE_KEYS.refreshToken, refreshToken, maxAgeSeconds);
    }

    if (user !== undefined && user !== null) {
      setCookie(AUTH_STORAGE_KEYS.user, JSON.stringify(user), maxAgeSeconds);
      notifyStoredLoginUserUpdated();
    }

    if (role) {
      setCookie(AUTH_STORAGE_KEYS.role, role, maxAgeSeconds);
    }

    if (
      options?.maxAgeSeconds ||
      refreshToken ||
      !getCookie(AUTH_STORAGE_KEYS.expiresAt)
    ) {
      setCookie(
        AUTH_STORAGE_KEYS.expiresAt,
        String(Date.now() + maxAgeSeconds * 1000),
        maxAgeSeconds,
      );
    }

    return accessToken ?? null;
  },
  mergeUser: (partial: Record<string, unknown>) => {
    if (!isBrowser) return;

    const prev = authStorage.getUser();
    const next = {
      ...(prev && typeof prev === "object" ? prev : {}),
      ...partial,
    };
    const remainingSeconds =
      getRemainingSessionMaxAgeSeconds() ?? AUTH_SESSION_COOKIE_MAX_AGE_SECONDS;

    if (remainingSeconds <= 0) {
      clearSession();
      return;
    }

    setCookie(AUTH_STORAGE_KEYS.user, JSON.stringify(next), remainingSeconds);
    const role = toRole(next.role);
    if (role) {
      setCookie(AUTH_STORAGE_KEYS.role, role, remainingSeconds);
    }
    notifyStoredLoginUserUpdated();
  },
  clearSession: () => {
    clearSession();
  },
};
