export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  APPROVE_CREATOR: "/auth/approve-creator",
  REJECT_CREATOR: "/auth/reject-creator",
  ALL_CREATOR_REQUESTS: "/auth/all-creator-requests",
} as const;

export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed",
} as const;

export const ACTION_ICONS = {
  APPROVE: "✓",
  REJECT: "✕",
} as const;

export const STORAGE_KEYS = {
  PAGE_SIZE_ALL_CREATORS: "kiibee.admin.allCreators.pageSize",
} as const;

export const isBrowser = typeof window !== "undefined";
