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

export const FIXED_LIMIT = 10;
