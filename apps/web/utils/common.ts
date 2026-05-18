export const ALERT = "alert";

export const COLLECTIONS = "collections";
export const APPEARANCE = "appearance";
export const SETTINGS = "settings";
export const COUPONS = "coupons";
export const VIEWER_BILLING_HISTORY_TAB = "billing-history";
export const VIEWER_PAYMENT_METHODS_TAB = "payment-methods";
export const HELP = "Help";
export const COUPON_DISCOUNT_FIXED_AMOUNT = "fixed_amount";
export const COUPON_DISCOUNT_PERCENTAGE = "percentage";
export const COUPON_CODES_LIMIT = 100;

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

export type ContentTab = "collections" | "appearance" | "settings" | "coupons";
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
export const IMG = "img";

export type ProfileTabKey = "home" | "collections" | "about";

export const PROFILE_TABS: {
  key: ProfileTabKey;
  label: string;
  href: string;
}[] = [
  { key: "home", label: "Home", href: "/create-profile1" },
  {
    key: "collections",
    label: "Collections",
    href: "/create-profile1/collections",
  },
  { key: "about", label: "About", href: "/create-profile1/about" },
];

export const PROFILE_TABS3: {
  key: ProfileTabKey;
  label: string;
  href: string;
}[] = [
  { key: "home", label: "Home", href: "/create-profile3" },
  {
    key: "collections",
    label: "Collections",
    href: "/create-profile3/collections",
  },
  { key: "about", label: "About", href: "/create-profile3/about" },
];

export const HOME = "home";
