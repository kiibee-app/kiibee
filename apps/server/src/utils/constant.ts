export const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PENDING_SETUP: 'pending-setup',
} as const;

export const ROLE = {
  VIWER: 'viewer',
  CREATOR: 'creator',
  ADMIN: 'admin',
} as const;

export const Time = {
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
