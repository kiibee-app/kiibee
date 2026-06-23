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

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  comedy: [
    'comedy',
    'stand-up',
    'standup',
    'stand up',
    'komik',
    'comedyaid',
    'comedy aid',
    'entertainment',
  ],
  music: ['music', 'song', 'album', 'koncert', 'lyd', 'studio'],
  podcasts: ['podcast'],
  arts: ['art', 'gallery', 'illustration', 'kunst', 'galleri', 'attraction'],
  books: [
    'book',
    'e-bog',
    'ebog',
    'e bog',
    'forlag',
    'writing',
    'tidsskrift',
    'publication',
  ],
  wellness: [
    'wellness',
    'mindfulness',
    'qigong',
    'sundhed',
    'sundt',
    'slank',
    'hypnose',
    'terapi',
    'psykolog',
    'heal',
  ],
  education: [
    'education',
    'learning',
    'kursus',
    'course',
    'skole',
    'conference',
    'miniconference',
    'undervisning',
    'hjælpe',
  ],
  lifestyle: ['lifestyle', 'vlog', 'daily', 'business'],
  food: ['food', 'cooking', 'koge', 'mad', 'kantine', 'indtag', 'opskrift'],
  fitness: ['fitness', 'sport', 'motion', 'gym', 'træning'],
};

const PROFILE_CATEGORY_OVERRIDES: Record<string, string> = {
  Art_attraction: 'arts',
  ElStudio: 'music',
  Elsebeth_Fogh: 'books',
  Kiibee_hjælpe_videoer: 'education',
  'Lindhardt_A-S': 'education',
  Sundt_indtag: 'food',
  slank_og_wellness: 'wellness',
  'TANIA_ELLIS_-_The_Social_Business_Company': 'education',
  'Microphone Entertainment': 'comedy',
  'FBI.DK': 'comedy',
};

const CONTENT_TYPE_CATEGORY_FALLBACK: Record<string, string> = {
  audio: 'music',
  pdf: 'books',
  epub: 'books',
};

const DEFAULT_CONTENT_CATEGORY_ID = 'lifestyle';

export type ContentCategoryInferenceInput = {
  profileKey: string;
  profileContextText?: string | null;
  profileDefaultCategoryId?: string | null;
  tags?: string[];
  title?: string | null;
  description?: string | null;
  contentTypeId: string;
};

function normalizeCategoryHaystack(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchCategoryInText(value: string | null | undefined): string | null {
  const haystack = normalizeCategoryHaystack(value ?? '');
  if (!haystack) {
    return null;
  }

  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return categoryId;
    }
  }

  return null;
}

function matchCategoryInTags(tags: string[] | undefined): string | null {
  if (!tags?.length) {
    return null;
  }

  for (const tag of tags) {
    const matched = matchCategoryInText(tag);
    if (matched) {
      return matched;
    }
  }

  return null;
}

export function inferContentCategoryId(
  input: ContentCategoryInferenceInput,
): string {
  const fromTags = matchCategoryInTags(input.tags);
  if (fromTags) {
    return fromTags;
  }

  const fromTitle = matchCategoryInText(input.title);
  if (fromTitle) {
    return fromTitle;
  }

  const fromDescription = matchCategoryInText(input.description);
  if (fromDescription) {
    return fromDescription;
  }

  if (input.profileDefaultCategoryId) {
    return input.profileDefaultCategoryId;
  }

  const override = PROFILE_CATEGORY_OVERRIDES[input.profileKey];
  if (override) {
    return override;
  }

  const profileHaystack = [input.profileKey, input.profileContextText]
    .filter(Boolean)
    .join(' ');

  const fromProfile = matchCategoryInText(profileHaystack);
  if (fromProfile) {
    return fromProfile;
  }

  const fromContentType =
    CONTENT_TYPE_CATEGORY_FALLBACK[input.contentTypeId] ?? null;
  if (fromContentType) {
    return fromContentType;
  }

  return DEFAULT_CONTENT_CATEGORY_ID;
}

export function loadProfileCategoryContext(
  profileKey: string,
  root: string,
): string | null {
  const layoutPath = join(root, profileKey, 'profile-info', 'layout.json');
  if (!existsSync(layoutPath)) {
    return null;
  }

  const layout = JSON.parse(readFileSync(layoutPath, 'utf8')) as JsonRecord;
  const parts = [
    textOrNull(layout.name),
    textOrNull(layout.logoText),
    textOrNull(layout.headline),
    textOrNull(layout.descriptionHtml),
    textOrNull(layout.description),
    textOrNull((layout.coverImage as JsonRecord | undefined)?.visibleText),
    textOrNull(
      (layout.coverImageMobile as JsonRecord | undefined)?.visibleText,
    ),
  ].filter(Boolean);

  return parts.length ? parts.join(' ') : null;
}

export function resolveProfileDefaultCategoryId(
  profileKey: string,
  profileContextText: string | null,
  showCategoryInputs: Array<{
    tags: string[];
    title: string | null;
    description: string | null;
    contentTypeId: string;
  }>,
): string | null {
  for (const show of showCategoryInputs) {
    const matched = inferContentCategoryId({
      profileKey,
      profileContextText,
      tags: show.tags,
      title: show.title,
      description: show.description,
      contentTypeId: show.contentTypeId,
    });

    if (matched !== DEFAULT_CONTENT_CATEGORY_ID) {
      return matched;
    }
  }

  const override = PROFILE_CATEGORY_OVERRIDES[profileKey];
  if (override) {
    return override;
  }

  const fromProfile = matchCategoryInText(
    [profileKey, profileContextText].filter(Boolean).join(' '),
  );
  if (fromProfile) {
    return fromProfile;
  }

  return null;
}

const CLOUDFLARE_VIDEO_ID_PATTERN =
  /(?:videodelivery\.net|cloudflarestream\.com|customer-[a-z0-9-]+\.cloudflarestream\.com)\/([a-f0-9]{32})/i;

const IMAGE_MEDIA_PATH_PATTERN = /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i;

export function getUmbracoShowValue(show: JsonRecord, key: string): unknown {
  const direct = show[key];
  if (direct !== undefined && direct !== null && direct !== '') {
    return direct;
  }

  const fromProperties = (show.properties as JsonRecord | undefined)?.[key];
  if (
    fromProperties !== undefined &&
    fromProperties !== null &&
    fromProperties !== ''
  ) {
    return fromProperties;
  }

  const fromFields = (show.fields as JsonRecord | undefined)?.[key];
  if (fromFields !== undefined && fromFields !== null && fromFields !== '') {
    return fromFields;
  }

  return undefined;
}

export function extractCloudflareVideoId(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  if (/^[a-f0-9]{32}$/i.test(text)) {
    return text.toLowerCase();
  }

  const match = text.match(CLOUDFLARE_VIDEO_ID_PATTERN);
  return match?.[1]?.toLowerCase() ?? null;
}

export function buildCloudflareVideoThumbnailUrl(videoId: string): string {
  return `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`;
}

export function isImageMediaPath(value: string): boolean {
  return IMAGE_MEDIA_PATH_PATTERN.test(value);
}

export function buildContentPlaceholderThumbnailUrl(title: string): string {
  const label = (title || 'Content').trim().slice(0, 72);
  const escaped = label
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-label="${escaped}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f2937"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="url(#bg)"/>
  <text x="320" y="180" fill="#f9fafb" font-family="system-ui,-apple-system,sans-serif" font-size="28" font-weight="600" text-anchor="middle">${escaped}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export type UmbracoShowThumbnailFallbacks = {
  creatorCoverImageUrl?: string | null;
  creatorLogoUrl?: string | null;
};

function resolveUmbracoThumbnailMediaUrl(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return resolveUmbracoMediaUrl(value);
  }

  if (typeof value === 'object' && value !== null) {
    return resolveUmbracoThumbnailMediaUrl((value as JsonRecord).src);
  }

  return null;
}

export function resolveUmbracoShowThumbnails(
  show: JsonRecord,
  title: string,
  fallbacks: UmbracoShowThumbnailFallbacks = {},
): { thumbnailUrl: string; thumbnailLandscapeUrl: string } {
  const videoId =
    extractCloudflareVideoId(getUmbracoShowValue(show, 'videoID')) ??
    extractCloudflareVideoId(getUmbracoShowValue(show, 'videoDownloadURL')) ??
    extractCloudflareVideoId(getUmbracoShowValue(show, 'contentUrl'));

  const cloudflareThumbnail = videoId
    ? buildCloudflareVideoThumbnailUrl(videoId)
    : null;

  const rawFile = textOrNull(getUmbracoShowValue(show, 'rawFile'));
  const rawFileImageUrl =
    rawFile && isImageMediaPath(rawFile)
      ? resolveUmbracoMediaUrl(rawFile)
      : null;

  const thumbnailUrl =
    resolveUmbracoThumbnailMediaUrl(getUmbracoShowValue(show, 'thumbnail')) ??
    resolveUmbracoThumbnailMediaUrl(
      getUmbracoShowValue(show, 'videoThumbnailURL'),
    ) ??
    cloudflareThumbnail ??
    rawFileImageUrl ??
    fallbacks.creatorCoverImageUrl ??
    fallbacks.creatorLogoUrl ??
    buildContentPlaceholderThumbnailUrl(title);

  const thumbnailLandscapeUrl =
    resolveUmbracoThumbnailMediaUrl(
      getUmbracoShowValue(show, 'videoThumbnailURL'),
    ) ??
    cloudflareThumbnail ??
    thumbnailUrl;

  return { thumbnailUrl, thumbnailLandscapeUrl };
}
