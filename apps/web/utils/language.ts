import { DA, EN, STORAGE_KEY } from "@/utils/common";

export type AppLanguage = typeof DA | typeof EN;

const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function normalizeAppLanguage(language?: string | null): AppLanguage {
  if (!language) return DA;

  const normalized = language.toLowerCase().split("-")[0];
  return normalized === EN ? EN : DA;
}

export function persistAppLanguage(language: AppLanguage) {
  if (typeof window === "undefined") return;

  document.cookie = `${STORAGE_KEY}=${language};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS};SameSite=Lax`;
  syncDocumentLanguage(language);
}

export function syncDocumentLanguage(language?: string | null) {
  if (typeof document === "undefined") return;

  const lang = normalizeAppLanguage(language);
  document.documentElement.lang = lang;
}
