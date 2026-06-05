"use client";

import type { DecodedToken } from "../types/auth";

type StoredAuthPayload = {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
};

export function setTokens(accessToken: string, refreshToken: string) {
  document.cookie = `accessToken=${accessToken}; Path=/; Max-Age=86400; SameSite=Lax`;
  document.cookie = `refreshToken=${refreshToken}; Path=/; Max-Age=604800; SameSite=Lax`;
  document.cookie = `adminLoggedIn=true; Path=/; Max-Age=86400; SameSite=Lax`;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens() {
  document.cookie = "accessToken=; Path=/; Max-Age=0";
  document.cookie = "refreshToken=; Path=/; Max-Age=0";
  document.cookie = "adminLoggedIn=; Path=/; Max-Age=0";
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("admin.authPayload");
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(atob(padded));
    return decoded as DecodedToken;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return Date.now() >= decoded.exp * 1000;
}

export function hasAdminRole(decodedToken: DecodedToken | null): boolean {
  return decodedToken?.role === "admin";
}

export function setAuthPayload(payload: StoredAuthPayload) {
  localStorage.setItem("admin.authPayload", JSON.stringify(payload));
}
