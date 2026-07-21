"use client";

import { useCallback } from "react";
import type { DecodedToken } from "../types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ADMIN_LOGGED_IN_KEY = "adminLoggedIn";
const AUTH_PAYLOAD_KEY = "admin.authPayload";

function getCookieAttributes() {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  return `Path=/; SameSite=Strict${secure}`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Strict`;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function setTokens(accessToken: string, refreshToken: string) {
  clearCookie(ACCESS_TOKEN_KEY);
  clearCookie(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

  document.cookie = `${ADMIN_LOGGED_IN_KEY}=true; ${getCookieAttributes()}`;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  clearCookie(ACCESS_TOKEN_KEY);
  clearCookie(REFRESH_TOKEN_KEY);
  clearCookie(ADMIN_LOGGED_IN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_LOGGED_IN_KEY);
  localStorage.removeItem(AUTH_PAYLOAD_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
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

export function useAdminTokens() {
  const saveTokens = useCallback(
    (accessToken: string, refreshToken: string) => {
      setTokens(accessToken, refreshToken);
    },
    [],
  );

  const removeTokens = useCallback(() => {
    clearTokens();
  }, []);

  const readAccessToken = useCallback(() => getAccessToken(), []);
  const readRefreshToken = useCallback(() => getRefreshToken(), []);

  return {
    setTokens: saveTokens,
    clearTokens: removeTokens,
    getAccessToken: readAccessToken,
    getRefreshToken: readRefreshToken,
  };
}
