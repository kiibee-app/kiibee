export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  USER_PROFILE: "/auth/user/profile",
  APPROVE_CREATOR: "/auth/approve-creator",
  REJECT_CREATOR: "/auth/reject-creator",
  ALL_CREATORS: "/auth/all-creators",
  ALL_CREATOR_REQUESTS: "/auth/all-creator-requests",
  ALL_VIEWERS: "/auth/all-viewers",
  DASHBOARD_STATS: "/auth/dashboard-stats",
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
  PAGE_SIZE_CREATOR_REQUESTS: "kiibee.admin.creatorRequests.pageSize",
  PAGE_SIZE_VIEWERS: "kiibee.admin.viewers.pageSize",
} as const;

export const isBrowser = typeof window !== "undefined";

export const STAT_ACCENT = {
  BLUE: "blue",
  GREEN: "green",
  TEAL: "teal",
  ORANGE: "orange",
  PURPLE: "purple",
} as const;

export type StatAccent = (typeof STAT_ACCENT)[keyof typeof STAT_ACCENT];

export const ALL_CREATORS_TAB = {
  CREATORS: "creators",
  VIEWERS: "viewers",
  REQUESTS: "requests",
} as const;

export type AllCreatorsTab =
  (typeof ALL_CREATORS_TAB)[keyof typeof ALL_CREATORS_TAB];

export const QUERY_KEY = {
  CREATOR_REQUESTS: "creator-requests",
  EXISTING_CREATORS: "existing-creators",
  VIEWERS: "viewers",
  DASHBOARD_STATS: "dashboard-stats",
} as const;

export const DASHBOARD_STAT_KEY = {
  TOTAL_USERS: "total-users",
  CREATORS: "creators",
  VIEWERS: "viewers",
  PENDING_REQUESTS: "pending-requests",
  TOTAL_CONTENT: "total-content",
  FREE_CONTENT: "free-content",
  PAID_CONTENT: "paid-content",
} as const;

export const DEBOUNCE_DELAY = 300;

export const PLACEHOLDERS = {
  SEARCH_USERS: "Search creators...",
} as const;

export const CREATOR_PLAN_FILTER_OPTIONS = [
  "Try Kiibee",
  "Start-up",
  "Pro",
] as const;
