import { NextRequest, NextResponse } from "next/server";
import { AUTH_STORAGE_KEYS } from "@/lib/auth/storageKeys";
import { getDashboardPathForRole, PATHS } from "@/utils/path";

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

function getPostLoginPath(request: NextRequest) {
  const role = request.cookies.get(AUTH_STORAGE_KEYS.role)?.value;
  if (role) return getDashboardPathForRole(role);

  const rawUser = request.cookies.get(AUTH_STORAGE_KEYS.user)?.value;

  try {
    const user = rawUser
      ? (JSON.parse(decodeURIComponent(rawUser)) as { role?: string })
      : null;
    if (user?.role) return getDashboardPathForRole(user.role);
  } catch {}

  const accessToken = request.cookies.get(AUTH_STORAGE_KEYS.accessToken)?.value;
  const tokenRole = decodeJwtPayload(accessToken)?.role;

  if (tokenRole) {
    return getDashboardPathForRole(tokenRole);
  }

  return PATHS.DASHBOARD_CREATOR;
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isLoggedIn = hasAuthSession(request);

  if (pathname === PATHS.AUTH_LOGIN && isLoggedIn) {
    return NextResponse.redirect(
      new URL(getPostLoginPath(request), request.url),
    );
  }

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const loginUrl = new URL(PATHS.AUTH_LOGIN, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
