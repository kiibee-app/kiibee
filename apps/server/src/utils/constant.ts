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
