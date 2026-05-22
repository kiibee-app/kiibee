export const AUTH_STORAGE_KEYS = {
  accessToken: "kiibee.accessToken",
  refreshToken: "kiibee.refreshToken",
  user: "kiibee.user",
  expiresAt: "kiibee.expiresAt",
} as const;

export const AUTH_SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const REMEMBERED_AUTH_SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const STORED_LOGIN_USER_UPDATED = "kiibee:user-updated";
