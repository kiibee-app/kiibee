export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4003/api/v1";

export const REQUEST_TIMEOUT = 30_000;

export const HTTP_STATUS = {
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
} as const;
