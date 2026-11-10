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
  expectedScheme?: string;
  expectedLength?: number;
  expectedCount?: number;
  expectedLengths?: number[];
  receivedLength?: number;
  receivedHasOuterWhitespace?: boolean;
  receivedFormat?: 'jwt' | 'uuid' | 'opaque';
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
  const scheme = authorization.trim().split(/\s+/, 1)[0];

  return /^[A-Za-z][A-Za-z0-9-]{0,31}$/.test(scheme) ? scheme : 'unknown';
};

const stripOuterQuotes = (value: string) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).trim();
  }

  return value;
};

const configuredAuthorizations = () => {
  const configured = process.env.EPAY_WEBHOOK_AUTHORIZATION?.trim();

  if (!configured) return [];

  return stripOuterQuotes(configured)
    .split(',')
    .map((value) => stripOuterQuotes(value.trim()))
    .filter(Boolean);
};

export const describeEpayWebhookAuthorization = () => {
  const values = configuredAuthorizations();

  if (!values.length) return { configured: false as const };

  return {
    configured: true as const,
    count: values.length,
    schemes: values.map(headerScheme),
    lengths: values.map((value) => value.length),
  };
};

const parseAuthorization = (authorization: string) => {
  const value = authorization.trim();
  const match = value.match(/^(\S+)\s+(.+)$/s);

  if (!match) {
    return { scheme: undefined, credentials: value };
  }

  return { scheme: match[1], credentials: match[2].trim() };
};

const receivedFormat = (authorization: string): 'jwt' | 'uuid' | 'opaque' => {
  const credentials = parseAuthorization(authorization).credentials;

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      credentials,
    )
  ) {
    return 'uuid';
  }

  if ((credentials.match(/\./g) ?? []).length === 2) {
    return 'jwt';
  }

  return 'opaque';
};

const authorizationMatches = (received: string, expected: string) => {
  const receivedParts = parseAuthorization(received);
  const expectedParts = parseAuthorization(expected);

  if (receivedParts.scheme && expectedParts.scheme) {
    return (
      receivedParts.scheme.toLowerCase() ===
        expectedParts.scheme.toLowerCase() &&
      safeEqual(receivedParts.credentials, expectedParts.credentials)
    );
  }

  return safeEqual(received.trim(), expected.trim());
};

export const verifyEpayWebhookAuthorization = (
  authorization: string | string[] | undefined,
): EpayWebhookAuthResult => {
  const expected = configuredAuthorizations();
  const value = Array.isArray(authorization) ? authorization[0] : authorization;

  if (!expected.length) {
    return {
      authorized: false,
      reason: 'missing_config',
      hasAuthorization: Boolean(value),
      scheme: value ? headerScheme(value) : undefined,
      receivedFormat: value ? receivedFormat(value) : undefined,
    };
  }

  if (!value) {
    return {
      authorized: false,
      reason: 'missing_header',
      hasAuthorization: false,
      expectedScheme: headerScheme(expected[0]),
      expectedLength: expected[0].length,
      expectedCount: expected.length,
      expectedLengths: expected.map((item) => item.length),
    };
  }

  const authorized = expected.some((item) => authorizationMatches(value, item));

  return {
    authorized,
    reason: authorized ? undefined : 'mismatch',
    hasAuthorization: true,
    scheme: headerScheme(value),
    expectedScheme: headerScheme(expected[0]),
    expectedLength: expected[0].length,
    expectedCount: expected.length,
    expectedLengths: expected.map((item) => item.length),
    receivedLength: value.length,
    receivedHasOuterWhitespace: value !== value.trim(),
    receivedFormat: receivedFormat(value),
  };
};

export const isEpayWebhookAuthorized = (
  authorization: string | string[] | undefined,
) => verifyEpayWebhookAuthorization(authorization).authorized;
