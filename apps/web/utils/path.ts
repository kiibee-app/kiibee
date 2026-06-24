export const PATHS = {
  HOME: "/",
  AUTH_LOGIN: "/auth/login",
  AUTH_SIGNUP: "/auth/signup",
  AUTH_FORGET_PASSWORD: "/auth/forget-password",
  AUTH_SIGNUP_CREATOR: "/auth/signup-creator",
  AUTH_SIGNUP_VIEWER: "/auth/signup-viewer",
  AUTH_CREATOR_REQUEST_SENT: "/auth/signup-creator/request-sent",
  DASHBOARD_CREATOR: "/dashboard/creators",
  DASHBOARD_VIEWER: "/dashboard/viewer",
  PRICING: "/pricing",
  AUTH_SIGNUP_VIEWER_PREFERENCES: "/auth/signup-viewer/preferences",
  EXPLORE_CREATORS: "/creators/all",
  EXPLORE: "/explore",
  DASHBOARD_CREATOR_PROFILE: "/dashboard/creators?view=profile",
  HOW_IT_WORKS: "/how-it-works",
  EXPLORE_EVERYTHING: "/explore/all-content/everything",
  EXPLORE_NEW: "/explore/all-content/new",
  EXPLORE_POPULAR: "/explore/all-content/popular",
  EXPLORE_FREE: "/explore/all-content/free",
  EXPLORE_VIDEO: "/formats/video",
  EXPLORE_AUDIO: "/formats/audio",
  EXPLORE_PDF: "/formats/pdf",
  EXPLORE_EPUB: "/formats/epub",
  EXPLORE_WEB: "/formats/web",
  CATEGORY_COMEDY: "/explore/category/comedy",
  CATEGORY_EDUCATION: "/explore/category/education",
  CATEGORY_BUSINESS: "/explore/category/business",
  CATEGORY_ARTS: "/explore/category/arts",
  CATEGORY_TECH: "/explore/category/tech",
  FOR_CREATORS: "/for-creators",
  CREATORS: "/creators/all",
  CREATORS_FEATURED: "/creators/featured",
  CREATORS_NEW: "/creators/new",
  CREATORS_POPULAR: "/creators/popular",
  ABOUT: "/about-kiibee",
  TUTORIAL_VIDEOS: "/tutorial-videos",
  CONTENT: "/content",
  SUPPORT: "/support",
  TERMS: "/terms-of-service",
  PRIVACY_POLICY: "/privacy-policy",
  SUBSCRIPTION_TERMS: "/subscription-terms",
  CREATOR_PROFILE: "/creator",
} as const;

const VIEWER_ROLE = "viewer";

export const ANONYMOUS_VIEWER_ID = "anonymous";

export function getDashboardPathForRole(role: unknown): string {
  return String(role ?? "").toLowerCase() === VIEWER_ROLE
    ? PATHS.DASHBOARD_VIEWER
    : PATHS.DASHBOARD_CREATOR;
}

export function pathPublishedContent(contentKey: string): string {
  return `${PATHS.CONTENT}/${encodeURIComponent(contentKey)}`;
}

export function resolveContentViewerId(userId?: string | null): string {
  const trimmed = String(userId ?? "").trim();
  return trimmed || ANONYMOUS_VIEWER_ID;
}

export function isSafePostLoginPath(
  path: string | null | undefined,
): path is string {
  if (!path?.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  return (
    path === PATHS.CONTENT ||
    path.startsWith(`${PATHS.CONTENT}/`) ||
    path === PATHS.EXPLORE ||
    path.startsWith(`${PATHS.EXPLORE}/`) ||
    path === PATHS.DASHBOARD_CREATOR ||
    path.startsWith(`${PATHS.DASHBOARD_CREATOR}/`) ||
    path === PATHS.DASHBOARD_VIEWER ||
    path.startsWith(`${PATHS.DASHBOARD_VIEWER}/`) ||
    path.startsWith(`${PATHS.CREATOR_PROFILE}/`)
  );
}

export function pathLoginWithNext(returnTo: string): string {
  const params = new URLSearchParams({ next: returnTo });
  return `${PATHS.AUTH_LOGIN}?${params.toString()}`;
}
