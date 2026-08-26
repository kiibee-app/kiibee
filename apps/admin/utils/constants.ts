export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  USER_PROFILE: "/auth/user/profile",
  APPROVE_CREATOR: "/auth/approve-creator",
  REJECT_CREATOR: "/auth/reject-creator",
  CREATOR_DELETION_REQUESTS: "/auth/creator-deletion-requests",
  CREATOR_DELETION_HISTORY: "/auth/creator-deletion-history",
  APPROVE_CREATOR_DELETION: "/auth/approve-creator-deletion",
  REJECT_CREATOR_DELETION: "/auth/reject-creator-deletion",
  ALL_CREATORS: "/creators/admin/all-creators",
  CREATOR_VISIBILITY: (creatorId: string) =>
    `/creators/admin/${creatorId}/visibility`,
  CREATOR_BY_ID: (creatorId: string) => `/auth/all-creators/${creatorId}`,
  ALL_CREATOR_REQUESTS: "/auth/all-creator-requests",
  ALL_VIEWERS: "/viewer/admin/all-viewers",
  VIEWER_BY_ID: (viewerId: string) => `/auth/all-viewers/${viewerId}`,
  DASHBOARD_STATS: "/auth/dashboard-stats",
  CREATOR_UPLOADS: "/content/all",
  CREATOR_CONTENTS: (creatorId: string) =>
    `/content/admin/creator-contents/${creatorId}`,
  CONTENT_ENGAGEMENT: (contentId: string) =>
    `/content/admin/content-engagement/${contentId}`,
  REJECT_CONTENT: (contentId: string) => `/content/admin/reject/${contentId}`,
  CREATOR_APPEARANCE: (creatorId: string) =>
    `/content/admin/appearance/${creatorId}`,
  MEDIA_VIDEO_STREAM: "/media/videos/stream",
  MEDIA_SIGNED_URL: "/media/signed-url",
  MEDIA_IMAGES_UPLOAD: "/media/images/upload",
  VIEWER_SALES: (viewerId: string) =>
    `/order/admin/billing-history/${viewerId}`,
  VIEWER_PURCHASED_DATA: (viewerId: string) =>
    `/viewer/admin/purchased-data/${viewerId}`,
  VIEWER_RENTED_DATA: (viewerId: string) =>
    `/viewer/admin/rented-data/${viewerId}`,
  VIEWER_EXPIRED_RENTED_DATA: (viewerId: string) =>
    `/viewer/admin/previously-rented-data/${viewerId}`,
  ALL_PAYOUT_REQUESTS: "/payout/requests",
  PAYOUT_REQUEST_BY_ID: (id: string) => `/payout/requests/${id}`,
  PAYOUT_HISTORY_BY_CREATOR: (creatorId: string) =>
    `/payout/history/${creatorId}`,
  ALL_PAYOUT_HISTORY: "/payout/all-history",
  CREATOR_WALLETS: "/payout/wallets",
  ADMIN_PAYOUT_CALCULATE: (creatorId: string) =>
    `/payout/calculate/${creatorId}`,
  ADMIN_PAYOUT_REQUEST: "/payout/admin-request",
  ADMIN_ACCOUNT_DETAILS: (creatorId: string) =>
    `/payout/account-details/${creatorId}`,
  CREATE_PAYOUT: "/payout/create",
  REJECT_PAYOUT_REQUEST: (id: string) => `/payout/requests/${id}/reject`,
  DOWNLOAD_LIMIT: "/download/limit",
  SET_DOWNLOAD_LIMIT: "/download/limit/set",
} as const;

export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed",
  FETCH_CREATOR_UPLOADS_FAILED: "Failed to fetch creator uploads",
} as const;

export const ACTION_ICONS = {
  APPROVE: "✓",
  REJECT: "✕",
} as const;

export const CREATOR_DELETION_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const CREATOR_DELETION_REQUEST_ACTION = {
  APPROVE: "approve",
  REJECT: "reject",
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

export const MODAL_SIZE = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type ModalSize = (typeof MODAL_SIZE)[keyof typeof MODAL_SIZE];

export const MODAL_WIDTH_BY_SIZE: Record<ModalSize, string> = {
  [MODAL_SIZE.SM]: "440px",
  [MODAL_SIZE.MD]: "640px",
  [MODAL_SIZE.LG]: "960px",
};

export const DEFAULT_MODAL_SIZE = MODAL_SIZE.LG;

export const QUERY_KEY = {
  CREATOR_REQUESTS: "creator-requests",
  CREATOR_DELETION_REQUESTS: "creator-deletion-requests",
  CREATOR_DELETION_HISTORY: "creator-deletion-history",
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
  CREATOR_APPEARANCE: "creator-appearance",
  PAYOUT_REQUESTS: "payout-requests",
  PAYOUT_REQUEST_DETAIL: "payout-request-detail",
  PAYOUT_HISTORY_BY_CREATOR: "payout-history-by-creator",
  ALL_PAYOUT_HISTORY: "all-payout-history",
  CREATOR_WALLETS: "creator-wallets",
  ADMIN_PAYOUT_CALCULATE: "admin-payout-calculate",
  DOWNLOAD_LIMIT: "download-limit",
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

export const SUBSCRIPTION_PLAN = {
  TRY_KIIBEE: "Try Kiibee",
  START_UP: "Start-up",
  PRO: "Pro",
} as const;

export const CREATOR_PLAN_FILTER_OPTIONS = [
  SUBSCRIPTION_PLAN.TRY_KIIBEE,
  SUBSCRIPTION_PLAN.START_UP,
  SUBSCRIPTION_PLAN.PRO,
] as const;

export const DEFAULT_WEB_APP_URL = "http://localhost:3000";

export const CREATOR_ID_QUERY_PARAM = "creatorId";

export const CREATOR_PROFILE_PATH = "/creator";

export const CREATOR_LAYOUT_PARAM = {
  LAYOUT1: "1",
  LAYOUT2: "2",
  LAYOUT3: "3",
} as const;

export const CREATOR_LAYOUT_KEY = {
  LAYOUT1: "layout1",
  LAYOUT2: "layout2",
  LAYOUT3: "layout3",
} as const;

export const DEFAULT_CREATOR_LAYOUT = CREATOR_LAYOUT_KEY.LAYOUT1;

export const CREATOR_LAYOUT_KEY_TO_PARAM: Record<string, string> = {
  [CREATOR_LAYOUT_KEY.LAYOUT1]: CREATOR_LAYOUT_PARAM.LAYOUT1,
  [CREATOR_LAYOUT_KEY.LAYOUT2]: CREATOR_LAYOUT_PARAM.LAYOUT2,
  [CREATOR_LAYOUT_KEY.LAYOUT3]: CREATOR_LAYOUT_PARAM.LAYOUT3,
  [CREATOR_LAYOUT_PARAM.LAYOUT1]: CREATOR_LAYOUT_PARAM.LAYOUT1,
  [CREATOR_LAYOUT_PARAM.LAYOUT2]: CREATOR_LAYOUT_PARAM.LAYOUT2,
  [CREATOR_LAYOUT_PARAM.LAYOUT3]: CREATOR_LAYOUT_PARAM.LAYOUT3,
};

export const ADMIN_ROLE = "admin";

export const ROUTES = {
  PENDING_REQUESTS: "/pending-requests",
  DELETION_REQUESTS: "/deletion-requests",
  PAYOUT_REQUESTS: "/payout-requests",
  PAYOUT: "/payout",
} as const;
