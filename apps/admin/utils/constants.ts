export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  USER_PROFILE: "/auth/user/profile",
  APPROVE_CREATOR: "/auth/approve-creator",
  REJECT_CREATOR: "/auth/reject-creator",
  ALL_CREATORS: "/auth/all-creators",
  CREATOR_BY_ID: (creatorId: string) => `/auth/all-creators/${creatorId}`,
  ALL_CREATOR_REQUESTS: "/auth/all-creator-requests",
  ALL_VIEWERS: "/auth/all-viewers",
  VIEWER_BY_ID: (viewerId: string) => `/auth/all-viewers/${viewerId}`,
  DASHBOARD_STATS: "/auth/dashboard-stats",
  CREATOR_UPLOADS: "/content/all",
  CREATOR_CONTENTS: (creatorId: string) =>
    `/content/admin/creator-contents/${creatorId}`,
  CONTENT_ENGAGEMENT: (contentId: string) =>
    `/content/admin/content-engagement/${contentId}`,
  VIEWER_SALES: (viewerId: string) =>
    `/order/admin/billing-history/${viewerId}`,
  VIEWER_PURCHASED_DATA: (viewerId: string) =>
    `/viewer/admin/purchased-data/${viewerId}`,
  VIEWER_RENTED_DATA: (viewerId: string) =>
    `/viewer/admin/rented-data/${viewerId}`,
  VIEWER_EXPIRED_RENTED_DATA: (viewerId: string) =>
    `/viewer/admin/previously-rented-data/${viewerId}`,
} as const;

export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed",
  FETCH_CREATOR_UPLOADS_FAILED: "Failed to fetch creator uploads",
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

export const QUERY_KEY = {
  CREATOR_REQUESTS: "creator-requests",
  EXISTING_CREATORS: "existing-creators",
  VIEWERS: "viewers",
  VIEWER_DETAIL: "viewer-detail",
  VIEWER_SALES: "viewer-sales",
  VIEWER_PURCHASED: "viewer-purchased",
  VIEWER_RENTED: "viewer-rented",
  VIEWER_EXPIRED_RENTED: "viewer-expired-rented",
  DASHBOARD_STATS: "dashboard-stats",
  CREATOR_UPLOADS: "creator-uploads",
  CREATOR_DETAIL: "creator-detail",
  CREATOR_CONTENTS: "creator-contents",
  CONTENT_ENGAGEMENT: "content-engagement",
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
  SEARCH_VIEWERS: "Search viewers...",
} as const;

export const CREATOR_PLAN_FILTER_OPTIONS = [
  "Try Kiibee",
  "Start-up",
  "Pro",
] as const;
