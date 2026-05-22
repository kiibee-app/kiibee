export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  APPROVE_CREATOR: "/auth/approve-creator",
  REJECT_CREATOR: "/auth/reject-creator",
  ALL_CREATOR_REQUESTS: "/auth/all-creator-requests",
} as const;

export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed",
} as const;
