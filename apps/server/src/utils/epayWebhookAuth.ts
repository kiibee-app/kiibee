import { timingSafeEqual } from 'node:crypto';

export type EpayWebhookAuthFailureReason =
  | 'missing_config'
  | 'missing_header'
  | 'mismatch';

export type EpayWebhookAuthResult = {
  authorized: boolean;
  reason?: EpayWebhookAuthFailureReason;
  hasAuthorization: boolean;
  scheme?: string;
};

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const headerScheme = (authorization: string) => {
  const scheme = authorization.split(/\s+/, 1)[0];

  return /^[A-Za-z][A-Za-z0-9-]{0,31}$/.test(scheme) ? scheme : 'unknown';
};

export const verifyEpayWebhookAuthorization = (
  authorization: string | string[] | undefined,
): EpayWebhookAuthResult => {
  const expected = process.env.EPAY_WEBHOOK_AUTHORIZATION?.trim();
  const value = Array.isArray(authorization) ? authorization[0] : authorization;

  if (!expected) {
    return {
      authorized: false,
      reason: 'missing_config',
      hasAuthorization: Boolean(value),
      scheme: value ? headerScheme(value) : undefined,
    };
  }

  if (!value) {
    return {
      authorized: false,
      reason: 'missing_header',
      hasAuthorization: false,
    };
  }

  const authorized = safeEqual(value, expected);

  return {
    authorized,
    reason: authorized ? undefined : 'mismatch',
    hasAuthorization: true,
    scheme: headerScheme(value),
  };
};

export const isEpayWebhookAuthorized = (
  authorization: string | string[] | undefined,
) => verifyEpayWebhookAuthorization(authorization).authorized;
