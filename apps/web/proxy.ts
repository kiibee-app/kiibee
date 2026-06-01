import { NextRequest, NextResponse } from "next/server";
import { AUTH_STORAGE_KEYS } from "@/lib/auth/storageKeys";
import { getDashboardPathForRole, PATHS } from "@/utils/path";
import { ROLE_ADMIN, ROLE_CREATOR, ROLE_VIEWER } from "@/utils/Constants";

const PROTECTED_PATHS = [PATHS.DASHBOARD_CREATOR, PATHS.DASHBOARD_VIEWER];

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
  } catch {
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
  } catch {}

  const accessToken = request.cookies.get(AUTH_STORAGE_KEYS.accessToken)?.value;
  const tokenRole = decodeJwtPayload(accessToken)?.role;
  return tokenRole?.trim().toLowerCase() ?? null;
}

function getDashboardPath(request: NextRequest) {
  const role = getSessionRole(request);
  return role ? getDashboardPathForRole(role) : PATHS.DASHBOARD_CREATOR;
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function canAccessDashboard(requiredRole: string, sessionRole: string) {
  if (sessionRole === requiredRole) return true;
  if (requiredRole === ROLE_CREATOR && sessionRole === ROLE_ADMIN) {
    return true;
  }
  return false;
}

function getRequiredRole(pathname: string) {
  if (
    pathname === PATHS.DASHBOARD_VIEWER ||
    pathname.startsWith(`${PATHS.DASHBOARD_VIEWER}/`)
  ) {
    return ROLE_VIEWER;
  }

  if (
    pathname === PATHS.DASHBOARD_CREATOR ||
    pathname.startsWith(`${PATHS.DASHBOARD_CREATOR}/`)
  ) {
    return ROLE_CREATOR;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoggedIn = hasAuthSession(request);

  if (pathname === PATHS.AUTH_LOGIN && isLoggedIn) {
    return NextResponse.redirect(
      new URL(getDashboardPath(request), request.url),
    );
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL(PATHS.AUTH_LOGIN, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = getRequiredRole(pathname);
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
