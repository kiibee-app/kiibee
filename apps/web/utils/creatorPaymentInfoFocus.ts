import { SCROLL_OPTIONS } from "@/utils/Constants";

export const CREATOR_PAYMENT_INFO_SECTION_ID = "creator-payment-information";
export const FOCUS_CREATOR_PAYMENT_INFO_EVENT = "focus-creator-payment-info";
export const FOCUS_CREATOR_PAYMENT_INFO_STORAGE_KEY =
  "kiibee.focusCreatorPaymentInfo";

const HIGHLIGHT_DURATION_MS = 4500;

export function requestCreatorPaymentInfoFocus() {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(FOCUS_CREATOR_PAYMENT_INFO_STORAGE_KEY, "1");
  } catch {
    // ignore storage failures
  }

  window.dispatchEvent(new CustomEvent(FOCUS_CREATOR_PAYMENT_INFO_EVENT));
}

export function consumeCreatorPaymentInfoFocusRequest(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const shouldFocus =
      sessionStorage.getItem(FOCUS_CREATOR_PAYMENT_INFO_STORAGE_KEY) === "1";
    if (shouldFocus) {
      sessionStorage.removeItem(FOCUS_CREATOR_PAYMENT_INFO_STORAGE_KEY);
    }
    return shouldFocus;
  } catch {
    return false;
  }
}

export function scrollToCreatorPaymentInfo() {
  if (typeof document === "undefined") return false;

  const element = document.getElementById(CREATOR_PAYMENT_INFO_SECTION_ID);
  if (!element) return false;

  element.scrollIntoView(SCROLL_OPTIONS);
  return true;
}

export const CREATOR_PAYMENT_INFO_HIGHLIGHT_MS = HIGHLIGHT_DURATION_MS;
