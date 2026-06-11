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

const KIIBEE_MEDIA_BASE_URL = 'https://kiibee.dk';

function getMediaCdnBase(): string | null {
  const base = process.env.PUBLIC_MEDIA_CDN_URL?.trim();
  return base ? base.replace(/\/$/, '') : null;
}

function toCdnMediaPath(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const stripPrefix = process.env.PUBLIC_MEDIA_CDN_STRIP_PREFIX ?? 'media';
  const mediaPrefix = `/${stripPrefix}`;

  if (stripPrefix && path.startsWith(`${mediaPrefix}/`)) {
    return path.slice(mediaPrefix.length);
  }

  return path;
}

/** Resolve Umbraco `/media/...` paths to CDN or legacy kiibee.dk URLs. */
export function resolveUmbracoMediaUrl(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  if (text.startsWith('http://') || text.startsWith('https://')) {
    const cdn = getMediaCdnBase();
    if (cdn) {
      try {
        const parsed = new URL(text);
        if (
          (parsed.hostname === 'kiibee.dk' ||
            parsed.hostname === 'www.kiibee.dk') &&
          parsed.pathname.startsWith('/media/')
        ) {
          return `${cdn}${toCdnMediaPath(parsed.pathname)}`;
        }
      } catch {
        // fall through
      }
    }

    return text;
  }

  if (text.startsWith('/')) {
    const cdn = getMediaCdnBase();
    if (cdn && text.startsWith('/media/')) {
      return `${cdn}${toCdnMediaPath(text)}`;
    }

    return `${KIIBEE_MEDIA_BASE_URL}${text}`;
  }

  if (text.startsWith('media/')) {
    const cdn = getMediaCdnBase();
    const path = `/${text}`;
    if (cdn) {
      return `${cdn}${toCdnMediaPath(path)}`;
    }

    return `${KIIBEE_MEDIA_BASE_URL}${path}`;
  }

  return text;
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

export const UMBRACO_PROFILE_EMAIL_DOMAIN = 'umbraco-profile.local';

function slugifyProfileKey(value: string): string {
  return (
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'umbraco-profile'
  );
}

export function uniqueSyntheticEmail(profileKey: string): string {
  const slug = slugifyProfileKey(profileKey).slice(0, 48);
  const suffix = createHash('sha256')
    .update(profileKey)
    .digest('hex')
    .slice(0, 8);

  return `${slug}-${suffix}@${UMBRACO_PROFILE_EMAIL_DOMAIN}`;
}

export function plusAddressEmail(
  baseEmail: string,
  profileKey: string,
): string | null {
  const atIndex = baseEmail.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === baseEmail.length - 1) {
    return null;
  }

  const localPart = baseEmail.slice(0, atIndex);
  const domain = baseEmail.slice(atIndex + 1);
  const slug = slugifyProfileKey(profileKey).slice(0, 40);

  return `${localPart}+${slug}@${domain}`;
}

/** Notification inboxes first — supportEmail is often shared (e.g. info@kiibee.dk). */
export function collectProfileEmailCandidates(
  supportEmail: unknown,
  notificationEmails: unknown,
): string[] {
  const candidates: string[] = [];
  const seen = new Set<string>();

  const add = (value: unknown) => {
    const email = normalizeEmail(value);
    if (email && !seen.has(email)) {
      seen.add(email);
      candidates.push(email);
    }
  };

  if (Array.isArray(notificationEmails)) {
    for (const email of notificationEmails) {
      add(email);
    }
  }

  add(supportEmail);

  return candidates;
}

export function resolveCreatorEmailFromUmbraco(
  profileKey: string,
  supportEmail: unknown,
  notificationEmails: unknown,
  usedEmails: Set<string>,
): string {
  const candidates = collectProfileEmailCandidates(
    supportEmail,
    notificationEmails,
  );

  for (const email of candidates) {
    if (!usedEmails.has(email)) {
      usedEmails.add(email);
      return email;
    }
  }

  const primaryUmbracoEmail = candidates[0];
  if (primaryUmbracoEmail) {
    const plusEmail = plusAddressEmail(primaryUmbracoEmail, profileKey);
    if (plusEmail && !usedEmails.has(plusEmail)) {
      usedEmails.add(plusEmail);
      return plusEmail;
    }
  }

  const synthetic = uniqueSyntheticEmail(profileKey);
  usedEmails.add(synthetic);
  return synthetic;
}

export function slugFromUrls(urls: unknown): string | null {
  if (!Array.isArray(urls)) {
    return null;
  }

  const url = textOrNull(urls[0]);
  if (!url) {
    return null;
  }

  const parts = url.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
}

export function slugifyUmbracoValue(value: string): string {
  return (
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'content'
  );
}

export function resolvePurchaseMediaKey(purchase: JsonRecord): string | null {
  const mediaItems = purchase.media;
  if (Array.isArray(mediaItems) && mediaItems.length > 0) {
    const first = mediaItems[0] as JsonRecord;
    const directKey = textOrNull(first.key);
    if (directKey) {
      return directKey.toLowerCase();
    }
  }

  const mediaUdis = purchase.mediaUdis;
  if (Array.isArray(mediaUdis) && mediaUdis.length > 0) {
    const fromUdi = mediaKeyFromUdi(mediaUdis[0]);
    if (fromUdi) {
      return fromUdi.toLowerCase();
    }
  }

  const properties = (purchase.properties as JsonRecord | undefined) ?? {};
  const propertyMedia = textOrNull(properties.media);
  if (propertyMedia) {
    return (
      mediaKeyFromUdi(propertyMedia) ??
      textOrNull(propertyMedia)?.toLowerCase() ??
      null
    );
  }

  return null;
}

export function resolveStatsMediaKey(entry: JsonRecord): string | null {
  const directKey = textOrNull(entry.mediaKey);
  if (directKey) {
    return directKey.toLowerCase();
  }

  const fields = (entry.fields as JsonRecord | undefined) ?? {};
  const fromFields = mediaKeyFromUdi(fields.media);
  if (fromFields) {
    return fromFields.toLowerCase();
  }

  return mediaKeyFromUdi(entry.mediaUdi)?.toLowerCase() ?? null;
}

export function resolveOrderUserId(
  buyerEmail: string,
  existingUsersByEmail: Map<string, string>,
): string {
  return existingUsersByEmail.get(buyerEmail) ?? viewerUserId(buyerEmail);
}

export function shouldInsertViewerAccount(
  viewer: { id: string; email: string },
  existingUsersByEmail: Map<string, string>,
  seededProfileUserIds: Set<string>,
): boolean {
  if (existingUsersByEmail.has(viewer.email)) {
    return false;
  }

  if (seededProfileUserIds.has(viewer.id)) {
    return false;
  }

  return true;
}

export type ReferencedUmbracoMedia = {
  profileKey: string;
  mediaKey: string;
  title: string;
  slugSuffix: string;
  thumbnailUrl: string | null;
  thumbnailLandscapeUrl: string | null;
  contentUrl: string | null;
  fileKey: string | null;
  buyPrice: string | null;
  rentPrice: string | null;
};

function readJsonArrayFile(filePath: string): JsonRecord[] {
  if (!existsSync(filePath)) {
    return [];
  }

  const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
  return Array.isArray(parsed) ? (parsed as JsonRecord[]) : [];
}

function thumbnailFromMediaRecord(media: JsonRecord): string | null {
  const thumbnail = media.thumbnail;
  if (typeof thumbnail === 'string') {
    return resolveUmbracoMediaUrl(thumbnail);
  }

  if (thumbnail && typeof thumbnail === 'object') {
    return resolveUmbracoMediaUrl((thumbnail as JsonRecord).src);
  }

  return resolveUmbracoMediaUrl(media.videoThumbnailURL);
}

function mapReferencedMediaRecord(
  profileKey: string,
  mediaKey: string,
  media: JsonRecord,
): ReferencedUmbracoMedia {
  const title =
    textOrNull(media.title) ??
    textOrNull(media.name) ??
    `Archived content ${mediaKey.slice(0, 8)}`;
  const slugSuffix =
    slugFromUrls(media.urls) ??
    slugifyUmbracoValue(title) ??
    mediaKey.slice(0, 8);

  return {
    profileKey,
    mediaKey: mediaKey.toLowerCase(),
    title,
    slugSuffix,
    thumbnailUrl: thumbnailFromMediaRecord(media),
    thumbnailLandscapeUrl: resolveUmbracoMediaUrl(media.videoThumbnailURL),
    contentUrl:
      textOrNull(media.videoDownloadURL) ?? textOrNull(media.webContentURL),
    fileKey: textOrNull(media.videoID),
    buyPrice: parseDecimal(media.purchasePrice),
    rentPrice: parseDecimal(media.rentalPrice),
  };
}

export function collectReferencedUmbracoMedia(
  root: string,
  profileKeys: string[],
  existingShowKeysByProfile: Map<string, Set<string>>,
): Map<string, ReferencedUmbracoMedia> {
  const referenced = new Map<string, ReferencedUmbracoMedia>();

  const remember = (candidate: ReferencedUmbracoMedia) => {
    const showKeys =
      existingShowKeysByProfile.get(candidate.profileKey) ?? new Set<string>();
    if (
      showKeys.has(candidate.mediaKey) ||
      referenced.has(candidate.mediaKey)
    ) {
      return;
    }

    referenced.set(candidate.mediaKey, candidate);
  };

  for (const profileKey of profileKeys) {
    const purchases = readJsonArrayFile(
      join(root, profileKey, 'purchases', 'items.json'),
    );

    for (const purchase of purchases) {
      const mediaKey = resolvePurchaseMediaKey(purchase);
      if (!mediaKey) {
        continue;
      }

      const mediaItems = purchase.media;
      if (Array.isArray(mediaItems) && mediaItems.length > 0) {
        remember(
          mapReferencedMediaRecord(
            profileKey,
            mediaKey,
            mediaItems[0] as JsonRecord,
          ),
        );
        continue;
      }

      remember({
        profileKey,
        mediaKey,
        title: `Archived content ${mediaKey.slice(0, 8)}`,
        slugSuffix: mediaKey.slice(0, 8),
        thumbnailUrl: null,
        thumbnailLandscapeUrl: null,
        contentUrl: null,
        fileKey: null,
        buyPrice: parseDecimal(purchase.price),
        rentPrice: null,
      });
    }

    const mediaMatchPath = join(
      root,
      profileKey,
      'purchases',
      'media-match.json',
    );
    let matchedMedia: JsonRecord[] = [];
    if (existsSync(mediaMatchPath)) {
      const parsed = JSON.parse(
        readFileSync(mediaMatchPath, 'utf8'),
      ) as JsonRecord;
      matchedMedia = Array.isArray(parsed.matchedMedia)
        ? (parsed.matchedMedia as JsonRecord[])
        : [];
    }

    for (const media of matchedMedia) {
      const mediaKey = textOrNull(media.key)?.toLowerCase();
      if (!mediaKey) {
        continue;
      }

      remember(mapReferencedMediaRecord(profileKey, mediaKey, media));
    }

    const stats = readJsonArrayFile(
      join(root, profileKey, 'stats', 'items.json'),
    );
    for (const entry of stats) {
      const mediaKey = resolveStatsMediaKey(entry);
      if (!mediaKey) {
        continue;
      }

      remember({
        profileKey,
        mediaKey,
        title:
          textOrNull(entry.name) ?? `Archived content ${mediaKey.slice(0, 8)}`,
        slugSuffix: mediaKey.slice(0, 8),
        thumbnailUrl: null,
        thumbnailLandscapeUrl: null,
        contentUrl: null,
        fileKey: null,
        buyPrice: null,
        rentPrice: null,
      });
    }
  }

  return referenced;
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

export const UMBRACO_SKIP_PROFILE_KEYS = new Set([
  'Admin',
  'ADHDFOKUS',
  'APHypnose',
  'Ahmed_Mittani',
  'Diy_for_børn',
  'Foreningen_Danske_Revisorer',
  'Fredensborg_Sundhedscenter',
  'Galleri_EVIG',
  'Go_Video',
  'LindaAndrews',
  'Maria_Birch_Rasmussen',
  'Maximilian_Nielsen',
  'Rumhed',
  'TjelesVenner',
  'Vocal_Line',
  'gymstream',
  'jwtc',
]);

export function isSkippedUmbracoProfile(profileKey: string): boolean {
  return UMBRACO_SKIP_PROFILE_KEYS.has(profileKey);
}

/** Umbraco profiles that have exported profile-info (real creator data). */
export function loadUmbracoProfileKeys(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((profileKey) => !isSkippedUmbracoProfile(profileKey))
    .filter((profileKey) => existsSync(join(root, profileKey, 'profile-info')))
    .sort((left, right) => left.localeCompare(right));
}

export function loadProfileKeys(root: string): string[] {
  return loadUmbracoProfileKeys(root);
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
