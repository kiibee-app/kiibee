import { normalizeApiError } from "@/lib/http/errors/apiError";

const COUPON_ERROR_MESSAGE_KEYS: Record<string, string> = {
  "Invalid coupon code": "singleContent.pricing.couponInvalid",
  "Coupon has expired": "singleContent.pricing.couponExpired",
  "Coupon is not yet valid": "singleContent.pricing.couponNotYetValid",
  "Coupon code has already been used":
    "singleContent.pricing.couponAlreadyUsed",
  "Coupon is not active": "singleContent.pricing.couponInactive",
  "Coupon has reached maximum uses": "singleContent.pricing.couponMaxUses",
  "Coupon is not applicable to this content":
    "singleContent.pricing.couponNotApplicable",
  "Failed to verify coupon": "singleContent.pricing.couponVerifyFailed",
  "Percentage discount cannot be greater than 50":
    "singleContent.pricing.couponMaxPercentage",
  "validUntil must be today or a future date":
    "singleContent.pricing.couponEndDatePast",
  "validUntil must be later than validFrom":
    "singleContent.pricing.couponEndDateBeforeStart",
};

export function getCouponErrorMessage(
  error: unknown,
  t: (key: string) => string,
  fallbackKey = "singleContent.pricing.couponInvalid",
): string {
  const normalizedError = normalizeApiError(error);
  const apiMessage = normalizedError.message?.trim();

  if (apiMessage && COUPON_ERROR_MESSAGE_KEYS[apiMessage]) {
    return t(COUPON_ERROR_MESSAGE_KEYS[apiMessage]);
  }

  if (apiMessage && apiMessage !== "Request failed") {
    return apiMessage;
  }

  return t(fallbackKey);
}
