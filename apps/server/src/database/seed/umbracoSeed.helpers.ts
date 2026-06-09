import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

export type JsonRecord = Record<string, unknown>;

export function deterministicUuid(value: string): string {
  const hex = createHash('sha256').update(value).digest('hex');
  const uuidHex = `${hex.slice(0, 12)}4${hex.slice(13, 16)}8${hex.slice(
    17,
    20,
  )}${hex.slice(20, 32)}`;

  return [
    uuidHex.slice(0, 8),
    uuidHex.slice(8, 12),
    uuidHex.slice(12, 16),
    uuidHex.slice(16, 20),
    uuidHex.slice(20, 32),
  ].join('-');
}

export function profileUserId(profileKey: string): string {
  return deterministicUuid(`umbraco-profile:user:${profileKey}`);
}

export function viewerUserId(email: string): string {
  return deterministicUuid(`umbraco-viewer:${email.toLowerCase().trim()}`);
}

export function showSeedUuid(
  scope: string,
  profileKey: string,
  showKey: string,
): string {
  return deterministicUuid(`umbraco-show:${scope}:${profileKey}:${showKey}`);
}

export function umbracoSeedUuid(
  scope: string,
  profileKey: string,
  itemKey: string,
): string {
  return deterministicUuid(`umbraco-${scope}:${profileKey}:${itemKey}`);
}

export function textOrNull(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return null;
}

export function isEnabled(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
  }

  return false;
}

export function parseDecimal(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : null;
}

export function parseDate(value: unknown): Date | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  const normalized = text.includes('T') ? text : text.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeEmail(value: unknown): string | null {
  const email = textOrNull(value)?.toLowerCase();
  return email?.includes('@') ? email : null;
}

export function mediaKeyFromUdi(udi: unknown): string | null {
  const text = textOrNull(udi);
  if (!text?.startsWith('umb://document/')) {
    return null;
  }

  const hex = text.slice('umb://document/'.length);
  if (hex.length !== 32) {
    return null;
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

export function resolveMediaFileId(
  profileKey: string,
  mediaKey: string | null | undefined,
): string | null {
  const key = textOrNull(mediaKey)?.toLowerCase();
  if (!key) {
    return null;
  }

  return showSeedUuid('media', profileKey, key);
}

export function findUmbracoUsersRoot(): string | null {
  const envRoot = process.env.UMBRACO_DATA_USERS_PATH?.trim();
  const candidates = [
    ...(envRoot ? [resolve(envRoot)] : []),
    resolve(process.cwd(), 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', '..', 'umbraco-data', 'users'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export function readItemsFile(
  profileKey: string,
  root: string,
  folder: string,
): JsonRecord[] | null {
  const dir = join(root, profileKey, folder);
  const candidates = [join(dir, 'items.json')];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      continue;
    }

    const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    if (!Array.isArray(parsed) || parsed.length === 0) {
      continue;
    }

    return parsed as JsonRecord[];
  }

  return null;
}

export function loadProfileKeys(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export function mapPaymentProvider(
  paytype: unknown,
): 'mobilepay' | 'card' | 'dankort' {
  const value = textOrNull(paytype);
  if (value === '2' || value?.toLowerCase() === 'mobilepay') {
    return 'mobilepay';
  }

  if (value === '3' || value?.toLowerCase() === 'dankort') {
    return 'dankort';
  }

  return 'card';
}

export async function batchInsert<T>(
  items: T[],
  batchSize: number,
  insertBatch: (batch: T[]) => Promise<void>,
): Promise<void> {
  for (let index = 0; index < items.length; index += batchSize) {
    await insertBatch(items.slice(index, index + batchSize));
  }
}
