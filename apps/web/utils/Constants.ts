import type { typography } from "@repo/ui/typography";
import { COLLECTIONS, HOME } from "./common";
import { EXPLORE } from "./translationKeys";
import { NavBarProps } from "./profile";
import {
  AdmissionRequirementValue,
  ADMISSION_REQUIREMENT_VALUES,
} from "./admissionRequirements";
import { ADMISSION_TYPE, parsePaymentAmount } from "./paymentRequirements";
import type { ContentFormState } from "@/types/contentTypes";
import {
  EXPLORE_CONTENT_SORT,
  ExploreContentSort,
} from "@/hooks/feed/useExploreContent";

export const CREATOR_CHANNEL_AVATAR_TEXT = {
  HERO: "Heading2",
  NAVBAR: "H4_SemiBold",
  COMPACT: "Heading3",
} as const satisfies Record<string, keyof typeof typography>;
export const UNKNOWN = "Unknown";
export const CREATOR = "Creator";

export type CreatorChannelAvatarTextUse =
  (typeof CREATOR_CHANNEL_AVATAR_TEXT)[keyof typeof CREATOR_CHANNEL_AVATAR_TEXT];

export * from "./variants";
export * from "./media";
export * from "./keyboard";
export * from "@/lib/subscription/constants";
export const EXPORT_DATE_RANGE_KEY = "export-date-range";
export const BLANK = "_blank";
export const SVG_XMLNS = "http://www.w3.org/2000/svg";
export const DEFAULT_WINDOW_WIDTH = 1200;
export const MOBILE_BREAKPOINT = 860;
export const SIDEBAR_COLLAPSE_BREAKPOINT = 1024;
export const REPEAT_PASSWORD = "repeatPassword";
export const PASSWORD = "password";
export const CONTENT_TAB = "tab";
export const CONTENT_COLLECTION_QUERY_KEY = "collectionId";
export const CONTENT_ITEM_QUERY_KEY = "contentId";
export const QUERY_KEY_FORMAT = "format";
export const CONTENT_LAST_EDITED_STORAGE_KEY = "contents:lastEditedContentId";
export const BILLING_TAB = "billingTab";
export const LEGACY_DASHBOARD_TAB_QUERY_KEYS = [
  "settingsTab",
  "usersTab",
] as const;

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function registerGsapPlugins() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export const CTA_CARD = {
  selector: "[data-cta-card]",
  attr: "data-cta-card",
  keyPrefix: "reveal-",
  mobileLabel: "mobile",
  desktopLabel: "desktop",
  fromVars: { autoAlpha: 0, scale: 0.96 } as const,
  toVars: { autoAlpha: 1, scale: 1 } as const,
  initialTransform: "scale(0.96)",
} as const;
export const GENERAL_FORM_FIELDS: Array<keyof ContentFormState> = [
  "webLink",
  "openInNewWindow",
  "openDirectFromList",
  "trailerLink",
  "visibility",
];

export const PASSWORD_VISIBILITY_KEY = {
  PASSWORD,
  REPEAT_PASSWORD,
} as const;

export type PasswordVisibilityKey =
  (typeof PASSWORD_VISIBILITY_KEY)[keyof typeof PASSWORD_VISIBILITY_KEY];

export const STRING = "string";
export const STRING_EMPTY = "";
export const SENSITIVITY_BASE = "base";
export const VIEW = "view";
export const VIEWER_SECTION = "section";
export const VIEWER_SECTION_VALUES = {
  COLLECTIONS: "collections",
} as const;
export const ROLE_CREATOR = "creator";
export const ROLE_VIEWER = "viewer";
export const ROLE_ADMIN = "admin";
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const WEBSITE = "website";
export const OPEN_GRAPH_LOCALE_DA_DK = "da_DK";
export const TWITTER_CARD_SUMMARY_LARGE_IMAGE = "summary_large_image";
export const KIIBEE_LANDING_PAGE_PREVIEW_ALT = "Kiibee landing page preview";

export const CARD_BRANDS = {
  VISA: "visa",
  MASTERCARD: "mastercard",
} as const;

export type CardBrand = (typeof CARD_BRANDS)[keyof typeof CARD_BRANDS];

export function isString(value: unknown): value is string {
  return typeof value === STRING;
}

export function toTrimmedString(value: unknown): string {
  return isString(value) ? value.trim() : "";
}

export const COUPON_ACTION_EDIT = "edit";
export const COUPON_ACTION_STATUS = "status";
export const COUPON_ACTION_DELETE = "delete";
export const PAYMENT_METHOD_ACTION_MARK_AS_DEFAULT = "markAsDefault";
export const PROFILE_HOME_SECTION = {
  LATEST_UPLOAD: "latestUpload",
  ABOUT: "about",
  COLLECTIONS_PREVIEW: "collectionsPreview",
} as const;

export type ProfileHomeSectionKey =
  (typeof PROFILE_HOME_SECTION)[keyof typeof PROFILE_HOME_SECTION];

export type CouponAction =
  | typeof COUPON_ACTION_EDIT
  | typeof COUPON_ACTION_STATUS
  | typeof COUPON_ACTION_DELETE;

export const TONE_DARK = "dark" as const;
export const TONE_LIGHT = "light" as const;

export const DRAWER_SIDE = {
  LEFT: "left",
  RIGHT: "right",
} as const;

export type DrawerSide = (typeof DRAWER_SIDE)[keyof typeof DRAWER_SIDE];

export const DRAWER_VARIANT = {
  DRAWER: "drawer",
  DROPDOWN: "dropdown",
} as const;

export type DrawerVariant =
  (typeof DRAWER_VARIANT)[keyof typeof DRAWER_VARIANT];

export const profileNavShellProps = {
  position: "absolute",
  innerPadding: "15px 110px",
  tabletInnerPadding: "12px 28px",
  mobileInnerPadding: "10px 16px",
  innerMaxWidth: "1600px",
  navPosition: "right",
  navbarHeight: "70px",
} satisfies Pick<
  NavBarProps,
  | "position"
  | "innerPadding"
  | "tabletInnerPadding"
  | "mobileInnerPadding"
  | "innerMaxWidth"
  | "navPosition"
  | "navbarHeight"
>;

export const PROFILE_LAYOUT_PAGE = {
  HOME,
  COLLECTIONS,
} as const;

export const QUERY_KEYS = {
  PROFILE_HOME_COLLECTIONS_PREVIEW: "profile-home-collections-preview",
  PROFILE_LATEST_UPLOAD: "profile-latest-upload",
  ALL_CONTENT_SUB: "allContentSub",
} as const;

export type ProfileLayoutPageKind =
  (typeof PROFILE_LAYOUT_PAGE)[keyof typeof PROFILE_LAYOUT_PAGE];

export const CONTENT_TYPE_FALLBACK = "video";
export const ADMISSION_REQUIREMENT_PAYMENT = "Payment";
export const ADMISSION_REQUIREMENT_FREE = "Free";
export const ACCESS_TYPE_PAID = "paid";
export const ACCESS_TYPE_FREE = "free";
export const ACCESS_KEYWORD_EN = "access";
export const ACCESS_KEYWORD_DA = "adgang";
export const ACCESS_TYPE_PASSWORD = "password";
export const ACCESS_TYPE_EMAIL_GATED = "email_gated";

export type CollectionAccessType =
  | typeof ACCESS_TYPE_PAID
  | typeof ACCESS_TYPE_FREE
  | typeof ACCESS_TYPE_PASSWORD
  | typeof ACCESS_TYPE_EMAIL_GATED;
export const VISIBILITY_PUBLIC_LOWER = "public";
export const VISIBILITY_PUBLIC_UPPER = "Public";
export const VISIBILITY_HIDDEN_LOWER = "hidden";
export const VISIBILITY_HIDDEN_UPPER = "Hidden";
export const VISIBILITY_DRAFT_LOWER = "draft";
export const VISIBILITY_DRAFT_UPPER = "Draft";
export const VISIBILITY_PRIVATE_LOWER = "private";
export const VISIBILITY_PRIVATE_UPPER = "Private";

export type CollectionVisibility =
  | typeof VISIBILITY_PUBLIC_LOWER
  | typeof VISIBILITY_HIDDEN_LOWER
  | typeof VISIBILITY_DRAFT_LOWER
  | typeof VISIBILITY_PRIVATE_LOWER;

export type CollectionContentVisibilityType =
  | typeof VISIBILITY_PUBLIC_UPPER
  | typeof VISIBILITY_HIDDEN_UPPER
  | typeof VISIBILITY_DRAFT_UPPER
  | typeof VISIBILITY_PRIVATE_UPPER;
export const CATEGORY_EDUCATION_LOWER = "education";
export const RENT_DURATION_DEFAULT = 48;
export const DOWNLOAD_LIMIT_UNLIMITED = "Unlimited";
export const DOWNLOAD_LIMIT_DEFAULT = "5";

export const CONTENT_TYPE_VIDEO = "video";
export const CONTENT_TYPE_AUDIO = "audio";
export const CONTENT_TYPE_PDF = "pdf";
export const CONTENT_TYPE_EPUB = "epub";

export const MIME_TYPE_VIDEO_MP4 = "video/mp4";
export const MIME_TYPE_APPLICATION_PDF = "application/pdf";

export const ERROR_MESSAGES = {
  NO_CONTENT: "errors.noContentToSave",
  SAVE_CHANGES_FAILED: "errors.saveChangesFailed",
  SAVE_SETTINGS_FAILED: "errors.saveSettingsFailed",
  LOAD_DETAILS_FAILED: "errors.loadDetailsFailed",
};

export const UI_TITLE_FALLBACK = "Content Details";

export const SCROLL_BEHAVIOR = {
  SMOOTH: "smooth",
} as const;

export const SCROLL_BLOCK = {
  CENTER: "center",
  START: "start",
} as const;

export const SCROLL_OPTIONS = {
  behavior: SCROLL_BEHAVIOR.SMOOTH,
  block: SCROLL_BLOCK.CENTER,
} as const;

export const SCROLL_TO_START_OPTIONS = {
  behavior: SCROLL_BEHAVIOR.SMOOTH,
  block: SCROLL_BLOCK.START,
} as const;

export const apiToUiAccessTypeMap: Record<string, AdmissionRequirementValue> = {
  [ACCESS_TYPE_PASSWORD]: ADMISSION_REQUIREMENT_VALUES.password,
  [ACCESS_TYPE_EMAIL_GATED]: ADMISSION_REQUIREMENT_VALUES.email,
  [ACCESS_TYPE_PAID]: ADMISSION_REQUIREMENT_VALUES.payment,
  [ACCESS_TYPE_FREE]: ADMISSION_REQUIREMENT_VALUES.free,
};

export const uiToApiAccessTypeMap: Record<
  string,
  "free" | "paid" | "password" | "email_gated"
> = {
  [ADMISSION_REQUIREMENT_VALUES.payment]: ACCESS_TYPE_PAID,
  [ADMISSION_REQUIREMENT_VALUES.password]: ACCESS_TYPE_PASSWORD,
  [ADMISSION_REQUIREMENT_VALUES.email]: ACCESS_TYPE_EMAIL_GATED,
  [ADMISSION_REQUIREMENT_VALUES.free]: ACCESS_TYPE_FREE,
  set_password: ACCESS_TYPE_PASSWORD,
  request_email: ACCESS_TYPE_EMAIL_GATED,
};

export const contentTypeMimeMap: Record<string, string> = {
  [CONTENT_TYPE_VIDEO]: MIME_TYPE_VIDEO_MP4,
  [CONTENT_TYPE_PDF]: MIME_TYPE_APPLICATION_PDF,
};

export const contentTypeSizeMap: Record<string, number> = {
  [CONTENT_TYPE_VIDEO]: 1.2 * 1024 * 1024 * 1024,
  [CONTENT_TYPE_AUDIO]: 45 * 1024 * 1024,
  [CONTENT_TYPE_PDF]: 4.5 * 1024 * 1024,
  [CONTENT_TYPE_EPUB]: 4.5 * 1024 * 1024,
};

export const mockSizeFallback = 12 * 1024 * 1024;

export function buildContentUpdatePayload(formState: ContentFormState) {
  const isPaymentAdmission =
    formState.admissionRequirement === ADMISSION_TYPE.PAYMENT;
  const parsedBuyPrice = parsePaymentAmount(formState.purchaseAmount);
  const parsedRentPrice = parsePaymentAmount(formState.rentalAmount);

  return {
    title: formState.title,
    description: formState.description,
    trailerUrl: formState.trailerLink || undefined,
    thumbnailUrl: formState.mediaCardThumbnail || undefined,
    thumbnailLandscapeUrl: formState.portraitThumbnail || undefined,
    publishedYear: formState.publishedYear
      ? parseInt(formState.publishedYear)
      : undefined,
    duration: formState.duration ? parseInt(formState.duration) : undefined,
    categoryId: formState.category
      ? formState.category.toLowerCase()
      : undefined,
    productionCompany: formState.productionCompany || undefined,
    manufacturerLink: formState.manufacturerLink || undefined,
    tags: formState.tags
      ? formState.tags
          .split(/[\n,]+/)
          .map((tag) => tag.trim())
          .filter(Boolean)
      : undefined,
    visibility: formState.visibility
      ? formState.visibility.toLowerCase()
      : undefined,
    accessType: formState.admissionRequirement
      ? (uiToApiAccessTypeMap[formState.admissionRequirement.toLowerCase()] ??
        ACCESS_TYPE_FREE)
      : undefined,
    buyPrice: isPaymentAdmission ? (parsedBuyPrice ?? undefined) : undefined,
    rentPrice: isPaymentAdmission ? (parsedRentPrice ?? undefined) : undefined,
    rentDurationHours:
      isPaymentAdmission && parsedRentPrice != null
        ? RENT_DURATION_DEFAULT
        : undefined,
    maximumDownloadCount:
      formState.maxDownloadLimit &&
      formState.maxDownloadLimit !== DOWNLOAD_LIMIT_UNLIMITED
        ? parseInt(formState.maxDownloadLimit)
        : undefined,
    physicalProductLink: formState.physicalProductLink || undefined,
    contentUrl: formState.webLink || undefined,
    openInNewWindow: formState.openInNewWindow ?? undefined,
    openDirectFromList: formState.openDirectFromList ?? undefined,
  };
}

export const CONTENT_FORM_FIELDS = {
  TITLE: "title",
  DESCRIPTION: "description",
  PUBLISHED_YEAR: "publishedYear",
  DURATION: "duration",
  CATEGORY: "category",
  PRODUCTION_COMPANY: "productionCompany",
  MANUFACTURER_LINK: "manufacturerLink",
  TAGS: "tags",
} as const;

export const TAG_DELIMITER = /[\n,]+/;

export function parseTags(value: string): string[] {
  return value
    ? value
        .split(TAG_DELIMITER)
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
}

export const MEDIA_TYPE_VIDEO_KEY = "discoverContent.mediaTypes.video";
export const MEDIA_TYPE_EPUB_KEY = "discoverContent.mediaTypes.epub";
export const FREE_LABEL = "Free";
export const RENT_PREFIX = "Rent";
export const BUY_PREFIX = "Buy";
export const BUY_COLLECTION_PREFIX = "Buy collection";
export const BUY_KEYWORDS = ["buy", "køb"];
export const FALLBACK_MEDIA_TYPE_LABEL = "Video";
export const MARQUEE_LIMIT = 8;
export const EXPLORE_PAGE_SIZE = 12;
export const TOP_CREATORS_LIMIT = 6;
export const LOAD_MORE_SIZE = 12;
export const CATEGORY_ALL = "all";
export const SKELETON_COUNT = 5;

export const SORT_OPTION_NEW = "new";
export const SORT_OPTION_POPULAR = "popular";
export const SORT_OPTION_AZ = "a-z";
export const EXPLORE_SUBSECTION_EVERYTHING = "everything";

export const FILTER_SECTION_CREATORS = "creators";
export const FILTER_SECTION_FORMATS = "formats";
export const FILTER_SECTION_PRICE = "price";
export const FILTER_SECTION_RATING = "rating";

export type AccessGateType = "code" | "email";
export type AccessGateVariant = "page" | "content";

export const VARIANT_CONTENT: AccessGateVariant = "content";
export const VARIANT_PAGE: AccessGateVariant = "page";
export const TYPE_CODE: AccessGateType = "code";
export const TYPE_EMAIL: AccessGateType = "email";
export const GATE_QUERY_PARAM = "gate";
export const ID_QUERY_PARAM = "id";
export const SET_PASSWORD_ACCESS = "set_password";
export const REQUEST_EMAIL_ACCESS = "request_email";

export const INPUT_TYPE_TEXT = "text";
export const INPUT_TYPE_EMAIL = "email";
export const BUTTON_TYPE_SUBMIT = "submit";

export const AUTOCOMPLETE_OFF = "off";
export const AUTOCOMPLETE_NAME = "name";
export const AUTOCOMPLETE_EMAIL = "email";

export const HTML_ID_CODE = "access-gate-code";
export const HTML_ID_NAME = "access-gate-name";
export const HTML_ID_EMAIL = "access-gate-email";

export const SHARE_STATUS = {
  IDLE: "idle",
  COPIED: "copied",
  SHARED: "shared",
  FAILED: "failed",
} as const;

export type ShareStatus = (typeof SHARE_STATUS)[keyof typeof SHARE_STATUS];

export const DEFAULT_DEBOUNCE_DELAY = 300;
export const COMPLETED = "completed";
export const FAILED = "failed";

export const ORDER_TYPES = {
  PURCHASE: "purchase",
  RENTAL: "rental",
} as const;

export const EXPLORE_TABS: { labelKey: string; sort: ExploreContentSort }[] = [
  { labelKey: EXPLORE.sortNew, sort: EXPLORE_CONTENT_SORT.NEW },
  { labelKey: EXPLORE.sortTrending, sort: EXPLORE_CONTENT_SORT.POPULAR },
  { labelKey: EXPLORE.sortCreatedForYou, sort: EXPLORE_CONTENT_SORT.ALL },
];

export const URL_FORMAT_IDS = new Set(["video", "audio", "pdf", "epub", "web"]);

export type OrderItemType = (typeof ORDER_TYPES)[keyof typeof ORDER_TYPES];

export const STATUS_TONE = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
} as const;

export type StatusTone = (typeof STATUS_TONE)[keyof typeof STATUS_TONE];

export const PAYMENT_QUERY_KEY = "payment";

export const BILLING_TYPES = {
  RENTED: { value: "rented", label: "Rented" },
  PURCHASED: { value: "purchased", label: "Purchased" },
} as const;

export const ACCESS_TYPE_RENTED = "rented";
export const ACCESS_TYPE_PURCHASED = "purchased";
export const ACCESS_STATUS_EXPIRED = "expired";

export const NUMERIC_ONLY_REGEX = /^\d+$/;
export const NON_DIGIT_REGEX = /\D/g;
