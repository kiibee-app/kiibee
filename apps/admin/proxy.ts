import { NextRequest, NextResponse } from "next/server";

function isPublicPath(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/login/");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("adminLoggedIn")?.value === "true";

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
