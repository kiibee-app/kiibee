"use client";

import { isBrowser } from "@/utils/ui";

const KEY = "payment_return_url";

export const savePaymentReturnUrl = (url?: string) => {
  if (isBrowser) {
    sessionStorage.setItem(
      KEY,
      url || `${window.location.pathname}${window.location.search}`,
    );
  }
};

export const consumePaymentReturnUrl = (
  fallbackUrl: string,
  statusKey: string,
  statusValue: string,
  extraParams: Record<string, string | null | undefined> = {},
): string => {
  if (!isBrowser) return fallbackUrl;
  const stored = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);

  const target = stored || fallbackUrl;
  const [pathname, query = ""] = target.split("?");
  const params = new URLSearchParams(query);
  params.set(statusKey, statusValue);
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return `${pathname}?${params.toString()}`;
};
