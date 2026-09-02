import { createHmac, timingSafeEqual } from 'crypto';

const PRIVATE_UPLOAD_PREFIX = /^(documents|audio|ebooks)\//i;
const UMBRACO_FILE_KEY = /^(?:media\/)?\d+\/.+/i;
const CLOUDFLARE_STREAM_VIDEO_ID = /^[a-f0-9]{32}$/i;

export const KIIBEE_MEDIA_ORIGIN = 'https://kiibee.dk';

export function isCloudflareStreamVideoId(key?: string | null): boolean {
  const trimmed = key?.trim() ?? '';
  return CLOUDFLARE_STREAM_VIDEO_ID.test(trimmed) && !trimmed.includes('/');
}

export function isPrivateUploadKey(key?: string | null): boolean {
  const normalized = normalizeMediaKey(key);
  return Boolean(normalized && PRIVATE_UPLOAD_PREFIX.test(normalized));
}

export function isLegacyUmbracoMediaKey(key?: string | null): boolean {
  const normalized = normalizeMediaKey(key);
  if (
    !normalized ||
    isPrivateUploadKey(normalized) ||
    isCloudflareStreamVideoId(normalized)
  ) {
    return false;
  }
  return UMBRACO_FILE_KEY.test(normalized);
}

export function normalizeMediaKey(key?: string | null): string {
  if (!key) {
    return '';
  }

  let value = key.trim();
  if (!value) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      value = decodeURIComponent(new URL(value).pathname);
    } catch {
      return '';
    }
  }

  return value.replace(/^\/+/, '');
}

export function toKiibeeMediaUrl(key?: string | null): string | null {
  const normalized = normalizeMediaKey(key);
  if (!normalized || isPrivateUploadKey(normalized)) {
    return null;
  }

  const path = normalized.replace(/^media\//i, '');
  if (!/^\d+\//.test(path)) {
    return null;
  }

  return `${KIIBEE_MEDIA_ORIGIN}/media/${path
    .split('/')
    .map((segment) => encodeURIComponent(decodeUriSegment(segment)))
    .join('/')}`;
}

export function signLegacyMediaProxy(key: string, exp: number): string {
  return createHmac('sha256', getLegacyMediaSecret())
    .update(`${normalizeMediaKey(key)}:${exp}`)
    .digest('base64url');
}

export function verifyLegacyMediaProxy(
  key: string,
  exp: string | number,
  signature: string,
): boolean {
  const expiresAt = Number(exp);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) {
    return false;
  }

  const expected = signLegacyMediaProxy(key, expiresAt);
  const actual = signature.trim();
  if (!actual) {
    return false;
  }

  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(actual);
  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }

  return timingSafeEqual(expectedBuf, actualBuf);
}

export function buildLegacyMediaProxyUrl(
  key: string,
  apiBaseUrl: string,
): string {
  const exp = Math.floor(Date.now() / 1000) + 4 * 60 * 60;
  const sig = signLegacyMediaProxy(key, exp);
  const base = apiBaseUrl.replace(/\/$/, '');

  return `${base}/media/legacy-file?key=${encodeURIComponent(normalizeMediaKey(key))}&exp=${exp}&sig=${encodeURIComponent(sig)}`;
}

function decodeUriSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function getLegacyMediaSecret(): string {
  return (
    process.env.JWT_ACCESS_SECRET ||
    process.env.DO_SECRET_KEY ||
    'kiibee-legacy-media'
  );
}
