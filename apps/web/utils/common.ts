export const ALERT = "alert";

export const COLLECTIONS = "collections";
export const ABOUT = "about";
export const APPEARANCE = "appearance";
export const SETTINGS = "settings";
export const COUPONS = "coupons";
export const VIEWER_BILLING_HISTORY_TAB = "billing-history";
export const VIEWER_PAYMENT_METHODS_TAB = "payment-methods";
export const HELP = "Help";
export const COUPON_DISCOUNT_FIXED_AMOUNT = "fixed_amount";
export const COUPON_DISCOUNT_PERCENTAGE = "percentage";
export const COUPON_CODES_LIMIT = 100;
export const QUERY_REFETCH_TYPE_ACTIVE = "active";
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

type ContentTabItem = {
  key: ContentTab;
  labelKey: string;
  descriptionKey?: string;
  description?: string;
};

type ViewerBillingTabItem = {
  key: ViewerBillingTab;
  labelKey: string;
};

export type ViewerBillingTab = "billing-history" | "payment-methods";

export const COUPON_DISCOUNT_TYPE = {
  FIXED_AMOUNT: COUPON_DISCOUNT_FIXED_AMOUNT,
  PERCENTAGE: COUPON_DISCOUNT_PERCENTAGE,
} as const;
export type CouponDiscountType =
  (typeof COUPON_DISCOUNT_TYPE)[keyof typeof COUPON_DISCOUNT_TYPE];

export const CONTENT_TABS: readonly ContentTabItem[] = [
  {
    key: COLLECTIONS,
    labelKey: "contents.tabs.collections",
    descriptionKey: "Collections content will appear here",
  },
  {
    key: APPEARANCE,
    labelKey: "contents.tabs.appearance",
    descriptionKey: "Appearance content will appear here",
  },
  {
    key: SETTINGS,
    labelKey: "contents.tabs.settings",
    descriptionKey: "Settings content will appear here",
  },
  {
    key: COUPONS,
    labelKey: "contents.tabs.coupons",
    description: "Coupons content will appear here.",
  },
] as const;

export const VIEWER_BILLING_TABS: readonly ViewerBillingTabItem[] = [
  {
    key: VIEWER_BILLING_HISTORY_TAB,
    labelKey: "dashboard.viewerBillings.tabs.billingHistory",
  },
  {
    key: VIEWER_PAYMENT_METHODS_TAB,
    labelKey: "dashboard.viewerBillings.tabs.paymentMethods",
  },
] as const;

export const NAME = "name";
export const PAGE_VISITS = "pageVisits";
export const CLICKS = "clicks";
export const VIEWS = "views";
export const MOUSE_DOWN = "mousedown";
export const CLICK = "click";
export const IMG = "img";

export type ProfileTabKey = "home" | "collections" | "about";

export const HOME = "home";

export const ADD_CONTENT_TABS = {
  GENERAL: "general",
  METADATA: "metadata",
  PAYMENT: "payment",
} as const;

export const PAYMENT_ADMISSION_VALUE = "payment" as const;
export const PAYMENT_DEFAULT_DOWNLOAD_LIMIT = "5" as const;
export const PAYMENT_UNLIMITED_DOWNLOAD_LIMIT = "unlimited" as const;
export const PAYMENT_DOWNLOAD_LIMIT_VALUES = [
  "1",
  "3",
  "5",
  "10",
  PAYMENT_UNLIMITED_DOWNLOAD_LIMIT,
] as const;

export type PaymentDownloadLimitValue =
  (typeof PAYMENT_DOWNLOAD_LIMIT_VALUES)[number];

export type AddContentTab =
  (typeof ADD_CONTENT_TABS)[keyof typeof ADD_CONTENT_TABS];

export const CONTENT_TABS_KEYS = {
  COLLECTIONS: "collections",
  APPEARANCE: "appearance",
  SETTINGS: "settings",
  COUPONS: "coupons",
} as const;

export type ContentTab =
  | (typeof CONTENT_TABS_KEYS)[keyof typeof CONTENT_TABS_KEYS]
  | (typeof ADD_CONTENT_TABS)[keyof typeof ADD_CONTENT_TABS];

export const MIME_TYPE = {
  VIDEO: "video/",
  AUDIO: "audio/",
  PDF: "application/pdf",
} as const;

export const FILE_EXTENSION = {
  EPUB: ".epub",
} as const;

export const tabs = ["New", "Trending", "Created for you"];
export const ACCESS_DURATION_VALUES = [
  "1_month",
  "3_months",
  "6_months",
  "12_months",
] as const;

export type AccessDurationValue = (typeof ACCESS_DURATION_VALUES)[number];

export const PAYMENT_DEFAULT_ACCESS_DURATION = "1_month" as const;

export function toCamelCaseKey(value: string): string {
  return value
    .replace(/&|\/|and/gi, "and")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

export const URL_PROTOCOL_REGEX = /^https?:\/\//i;

export function formatExternalUrl(url: string): string {
  if (URL_PROTOCOL_REGEX.test(url)) {
    return url;
  }
  return `https://${url}`;
}
