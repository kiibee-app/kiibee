import { DA, EN, STORAGE_KEY, SUPPORTED_LANGS } from "@/utils/common";

export type AppLanguage = typeof DA | typeof EN;

const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function normalizeAppLanguage(language?: string | null): AppLanguage {
  if (!language) return DA;

  const normalized = language.toLowerCase().split("-")[0];
  return normalized === EN ? EN : DA;
}

function readLanguageCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function getStoredAppLanguage(): AppLanguage {
  if (typeof window === "undefined") return DA;

  const fromCookie = readLanguageCookie();
  if (fromCookie && SUPPORTED_LANGS.includes(fromCookie)) {
    return normalizeAppLanguage(fromCookie);
  }

  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (fromStorage && SUPPORTED_LANGS.includes(fromStorage)) {
    return normalizeAppLanguage(fromStorage);
  }

  return DA;
}

export function persistAppLanguage(language: AppLanguage) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, language);
  document.cookie = `${STORAGE_KEY}=${language};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS};SameSite=Lax`;
  syncDocumentLanguage(language);
}

export function syncDocumentLanguage(language?: string | null) {
  if (typeof document === "undefined") return;

  const lang = normalizeAppLanguage(language);
  document.documentElement.lang = lang;
}
