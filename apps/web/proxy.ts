import { NextRequest, NextResponse } from "next/server";
import { AUTH_STORAGE_KEYS } from "@/lib/auth/storageKeys";
import { getDashboardPathForRole, PATHS } from "@/utils/path";
import { ROLE_ADMIN, ROLE_CREATOR, ROLE_VIEWER } from "@/utils/Constants";
import {
  localizePathname,
  readLanguageFromCookieHeader,
  toCanonicalPathname,
  formatSearch,
  localizeSearchParams,
  searchParamsPreferEqual,
} from "@/utils/localizedRoutes";
import { logger } from "./lib/logger";

const PROTECTED_PATHS = [PATHS.DASHBOARD_CREATOR, PATHS.DASHBOARD_VIEWER];
const AUTH_REDIRECT_PATHS = [
  PATHS.AUTH_LOGIN,
  PATHS.AUTH_SIGNUP,
  PATHS.AUTH_SIGNUP_CREATOR,
  PATHS.AUTH_SIGNUP_VIEWER,
];

function hasAuthSession(request: NextRequest) {
  const hasSessionCookie = Boolean(
    request.cookies.get(AUTH_STORAGE_KEYS.accessToken)?.value ||
    request.cookies.get(AUTH_STORAGE_KEYS.refreshToken)?.value,
  );
  const rawExpiresAt = request.cookies.get(AUTH_STORAGE_KEYS.expiresAt)?.value;
  const expiresAt = Number(rawExpiresAt);

  return (
    hasSessionCookie &&
    (!rawExpiresAt || (Number.isFinite(expiresAt) && expiresAt > Date.now()))
  );
}

function decodeJwtPayload(token?: string) {
  const payload = token?.split(".")[1];
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );

    return JSON.parse(atob(paddedPayload)) as { role?: string };
  } catch (error) {
    logger.error("Failed to decode JWT payload:", error);
    return null;
  }
}

function getSessionRole(request: NextRequest) {
  const role = request.cookies
    .get(AUTH_STORAGE_KEYS.role)
    ?.value?.trim()
    .toLowerCase();
  if (role) return role;

  const rawUser = request.cookies.get(AUTH_STORAGE_KEYS.user)?.value;

  try {
    const user = rawUser
      ? (JSON.parse(decodeURIComponent(rawUser)) as { role?: string })
      : null;
    if (user?.role) return user.role.trim().toLowerCase();
  } catch (error) {
    logger.error("Failed to parse user cookie for role lookup:", error);
  }

  const accessToken = request.cookies.get(AUTH_STORAGE_KEYS.accessToken)?.value;
  const tokenRole = decodeJwtPayload(accessToken)?.role;
  return tokenRole?.trim().toLowerCase() ?? null;
}

function getDashboardPath(request: NextRequest) {
  const role = getSessionRole(request);
  const language = readLanguageFromCookieHeader(request.headers.get("cookie"));
  const dashboard = role
    ? getDashboardPathForRole(role)
    : PATHS.DASHBOARD_CREATOR;
  return localizePathname(dashboard, language);
}

function isProtectedPath(canonicalPathname: string) {
  return PROTECTED_PATHS.some(
    (path) =>
      canonicalPathname === path || canonicalPathname.startsWith(`${path}/`),
  );
}

function isAuthRedirectPath(canonicalPathname: string) {
  return AUTH_REDIRECT_PATHS.includes(
    canonicalPathname as (typeof AUTH_REDIRECT_PATHS)[number],
  );
}

function canAccessDashboard(requiredRole: string, sessionRole: string) {
  if (sessionRole === requiredRole) return true;
  if (requiredRole === ROLE_CREATOR && sessionRole === ROLE_ADMIN) {
    return true;
  }
  return false;
}

function getRequiredRole(canonicalPathname: string) {
  if (
    canonicalPathname === PATHS.DASHBOARD_VIEWER ||
    canonicalPathname.startsWith(`${PATHS.DASHBOARD_VIEWER}/`)
  ) {
    return ROLE_VIEWER;
  }

  if (
    canonicalPathname === PATHS.DASHBOARD_CREATOR ||
    canonicalPathname.startsWith(`${PATHS.DASHBOARD_CREATOR}/`)
  ) {
    return ROLE_CREATOR;
  }

  return null;
}

function applyLocaleRouting(request: NextRequest, pathname: string) {
  const language = readLanguageFromCookieHeader(request.headers.get("cookie"));
  const canonicalPathname = toCanonicalPathname(pathname);
  const preferredPathname = localizePathname(canonicalPathname, language);
  const preferredSearch = localizeSearchParams(
    request.nextUrl.searchParams,
    language,
  );
  const searchMatches = searchParamsPreferEqual(
    request.nextUrl.searchParams,
    preferredSearch,
  );

  if (pathname !== preferredPathname || !searchMatches) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = preferredPathname;
    redirectUrl.search = formatSearch(preferredSearch);
    return {
      canonicalPathname,
      redirect: NextResponse.redirect(redirectUrl),
      rewrite: null,
    };
  }

  if (canonicalPathname !== pathname) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = canonicalPathname;
    return {
      canonicalPathname,
      redirect: null,
      rewrite: NextResponse.rewrite(rewriteUrl),
    };
  }

  return { canonicalPathname, redirect: null, rewrite: null };
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const localeResult = applyLocaleRouting(request, pathname);

  if (localeResult.redirect) {
    return localeResult.redirect;
  }

  const canonicalPathname = localeResult.canonicalPathname;
  const isLoggedIn = hasAuthSession(request);
  const language = readLanguageFromCookieHeader(request.headers.get("cookie"));

  if (isAuthRedirectPath(canonicalPathname) && isLoggedIn) {
    return NextResponse.redirect(
      new URL(getDashboardPath(request), request.url),
    );
  }

  if (!isProtectedPath(canonicalPathname)) {
    return localeResult.rewrite ?? NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginPath = localizePathname(PATHS.AUTH_LOGIN, language);
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = getRequiredRole(canonicalPathname);
  const sessionRole = getSessionRole(request);

  if (
    requiredRole &&
    sessionRole &&
    !canAccessDashboard(requiredRole, sessionRole)
  ) {
    return NextResponse.redirect(
      new URL(getDashboardPath(request), request.url),
    );
  }

  return localeResult.rewrite ?? NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
