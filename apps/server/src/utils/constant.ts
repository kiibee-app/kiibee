export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING_SETUP: 'pending-setup',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const;

export const ROLE = {
  VIEWER: 'viewer',
  CREATOR: 'creator',
  ADMIN: 'admin',
} as const;

export const ACCESS_TYPE = {
  FREE: 'free',
  PAID: 'paid',
  PASSWORD: 'password',
  EMAIL_GATED: 'email_gated',
} as const;

export const Time = {
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

export const CORS_HTTP_METHODS: string[] = [
  'GET',
  'HEAD',
  'PUT',
  'PATCH',
  'POST',
  'DELETE',
  'OPTIONS',
];

export const CORS_ALLOWED_HEADERS: string[] = [
  'Content-Type',
  'Authorization',
  'Accept',
];

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  PENDING_SETUP: 'pending-setup',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const;

export const FILE_SIZE_LIMIT = 15 * 1024 * 1024;

export const SIGNED_URL_EXPIRY = {
  SHORT: 3600,
  MEDIUM: 14400,
  LONG: 43200,
  DAY: 86400,
  MAX: 604800,
} as const;

export const CONTENT_VISIBILITY = {
  DRAFT: 'draft',
  PUBLIC: 'public',
  PRIVATE: 'private',
  HIDDEN: 'hidden',
} as const;

const MAX_AVATAR_DATA_URL_CHARS = 500_000;
const MAX_AVATAR_HTTP_URL_CHARS = 2_048;
const IMAGE_DATA_URL_RE =
  /^data:image\/(?:png|jpe?g|webp);base64,[a-zA-Z0-9+/=\s\r\n]+$/;
const HTTP_URL_RE = /^https?:\/\/.+/i;
export const SLUG_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
export const SLUG_EDGE_DASH_RE = /^-+|-+$/g;

export const isValidAvatarUrl = (value: string): boolean => {
  const isDataUrl =
    IMAGE_DATA_URL_RE.test(value) && value.length <= MAX_AVATAR_DATA_URL_CHARS;
  const isHttpUrl =
    HTTP_URL_RE.test(value) && value.length <= MAX_AVATAR_HTTP_URL_CHARS;

  return isDataUrl || isHttpUrl;
};
export const FIXED_LIMIT = 10;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
  NAME: 'name',
  SUBSCRIBER_COUNT: 'subscriberCount',
  NEWEST: 'newest',
  TOP: 'top',
  FEATURED: 'featured',
  NEW: 'new',
  POPULAR: 'popular',
  FREE: 'free',
  ALL: 'all',
} as const;

export const ACCRESS_TYPES = {
  RENTED: 'rented',
  PURCHASED: 'purchased',
  EXPIRED: 'Expired',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const ORDER_TYPES = {
  RENTAL: 'rental',
  PURCHASE: 'purchase',
} as const;

export const PAYMENT_STATUS = {
  PAYMENT_SUCCESS: 'SUCCESS',
  PAYMENT_FAILED: 'FAILED',
  PAYMENT_EXPIRED: 'EXPIRED',
} as const;

export const CONTENT_TYPES = {
  VIDEO: 'Video',
  AUDIO: 'Audio',
  PDF: 'PDF',
} as const;
