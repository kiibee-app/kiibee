import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { resolvePublicMediaUrl } from 'src/utils/resolvePublicMediaUrl';

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

/**
 * Directory renames for filesystem safety (e.g. spaces → underscores).
 * Seed UUIDs keep the legacy key so existing DB rows stay linked.
 */
const PROFILE_SEED_KEY_ALIASES: Record<string, string> = {
  Microphone_Entertainment: 'Microphone Entertainment',
};

/** Canonical key used for deterministic seed UUIDs. */
export function profileSeedKey(profileKey: string): string {
  return PROFILE_SEED_KEY_ALIASES[profileKey] ?? profileKey;
}

export function profileUserId(profileKey: string): string {
  return deterministicUuid(
    `umbraco-profile:user:${profileSeedKey(profileKey)}`,
  );
}

export function viewerUserId(email: string): string {
  return deterministicUuid(`umbraco-viewer:${email.toLowerCase().trim()}`);
}

export function showSeedUuid(
  scope: string,
  profileKey: string,
  showKey: string,
): string {
  return deterministicUuid(
    `umbraco-show:${scope}:${profileSeedKey(profileKey)}:${showKey}`,
  );
}

export function umbracoSeedUuid(
  scope: string,
  profileKey: string,
  itemKey: string,
): string {
  return deterministicUuid(
    `umbraco-${scope}:${profileSeedKey(profileKey)}:${itemKey}`,
  );
}

/** Resolve Umbraco media paths/URLs via shared CDN rewrite logic. */
export function resolveUmbracoMediaUrl(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  return resolvePublicMediaUrl(text);
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

export type CmsMemberRecord = {
  nodeId: number;
  email?: string;
  Email?: string;
  loginName?: string;
  LoginName?: string;
  profileKey?: string | null;
  Password?: string;
};

const CONTENT_NODE_ID_OFFSET = 1;

function cmsMemberEmail(record: CmsMemberRecord): string | null {
  return normalizeEmail(record.email ?? record.Email);
}

function parseOwnerNodeId(owner: unknown): number | null {
  const text = textOrNull(owner);
  if (!text || !/^\d+$/.test(text)) {
    return null;
  }

  return Number(text);
}

export function findCmsMembersFile(): string | null {
  const envPath = process.env.UMBRACO_CMS_MEMBERS_PATH?.trim();
  const candidates = [
    ...(envPath ? [resolve(envPath)] : []),
    resolve(process.cwd(), 'umbraco-data', 'cms-members.json'),
    resolve(process.cwd(), '..', 'umbraco-data', 'cms-members.json'),
    resolve(process.cwd(), '..', '..', 'umbraco-data', 'cms-members.json'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export function findUmbracoExportRunFile(): string | null {
  const envPath = process.env.UMBRACO_EXPORT_RUN_PATH?.trim();
  const candidates = [
    ...(envPath ? [resolve(envPath)] : []),
    resolve(process.cwd(), 'umbraco-data', 'export-runs', 'latest.json'),
    resolve(process.cwd(), '..', 'umbraco-data', 'export-runs', 'latest.json'),
    resolve(
      process.cwd(),
      '..',
      '..',
      'umbraco-data',
      'export-runs',
      'latest.json',
    ),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

export function loadCmsMembersByNodeId(): Map<number, string> {
  const filePath = findCmsMembersFile();
  if (!filePath) {
    return new Map();
  }

  const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as {
    cmsMember?: CmsMemberRecord[];
  };
  const map = new Map<number, string>();

  for (const member of parsed.cmsMember ?? []) {
    const email = cmsMemberEmail(member);
    if (email) {
      map.set(member.nodeId, email);
    }
  }

  return map;
}

export function loadContentUserIdByProfileKey(
  umbracoUsersRoot?: string,
): Map<string, number> {
  const map = new Map<string, number>();

  const remember = (profileKey: string, userId: number) => {
    if (!profileKey || !Number.isFinite(userId) || userId <= 0) {
      return;
    }
    map.set(profileKey, userId);
    const underscored = profileKey.replace(/ /g, '_');
    if (underscored !== profileKey) {
      map.set(underscored, userId);
    }
  };

  const exportRunFile = findUmbracoExportRunFile();
  if (exportRunFile) {
    try {
      const parsed = JSON.parse(readFileSync(exportRunFile, 'utf8')) as {
        users?: Array<{ userDir?: string; userId?: number }>;
      };
      for (const user of parsed.users ?? []) {
        if (user.userDir && user.userId) {
          remember(user.userDir, user.userId);
        }
      }
    } catch {
      // Ignore corrupt export-run files; local folders are the fallback.
    }
  }

  const rootCandidates = [
    ...(umbracoUsersRoot ? [umbracoUsersRoot] : []),
    resolve(process.cwd(), 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', '..', 'umbraco-data', 'users'),
  ];
  const root = rootCandidates.find((candidate) => existsSync(candidate));
  if (!root) {
    return map;
  }

  for (const profileKey of readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)) {
    if (map.has(profileKey)) {
      continue;
    }
    const userId = readContentUserIdFromProfileDir(join(root, profileKey));
    if (userId) {
      remember(profileKey, userId);
    }
  }

  return map;
}

function readContentUserIdFromProfileDir(profileDir: string): number | null {
  const candidates = [
    'content/index.json',
    'stats/index.json',
    'shows/index.json',
    'purchases/index.json',
    'payouts/index.json',
    'logs/index.json',
  ];

  for (const relativePath of candidates) {
    const filePath = join(profileDir, relativePath);
    if (!existsSync(filePath)) {
      continue;
    }

    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as JsonRecord;
      const direct = Number(parsed.userId);
      if (Number.isFinite(direct) && direct > 0) {
        return direct;
      }

      const parent = parsed.parent;
      if (parent && typeof parent === 'object') {
        const pathValue = textOrNull((parent as JsonRecord).path);
        const fromPath = contentUserIdFromUmbracoPath(pathValue);
        if (fromPath) {
          return fromPath;
        }
      }
    } catch {
      // Try the next candidate file.
    }
  }

  return null;
}

/** Umbraco path like "-1,1067,41913,41914" → content user node 41913. */
function contentUserIdFromUmbracoPath(pathValue: string | null): number | null {
  if (!pathValue) {
    return null;
  }

  const parts = pathValue
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((part) => Number.isFinite(part));

  // [-1, usersRoot, contentUser, ...]
  if (parts.length >= 3 && parts[0] === -1) {
    return parts[2];
  }

  return null;
}

/** Match a profile to its Umbraco CMS member login email. */
export function resolveProfileCmsMemberEmail(
  owner: unknown,
  contentUserId: number | undefined,
  cmsByNodeId: Map<number, string>,
): string | null {
  const byContent = contentUserId
    ? (cmsByNodeId.get(contentUserId - CONTENT_NODE_ID_OFFSET) ?? null)
    : null;
  const ownerNodeId = parseOwnerNodeId(owner);
  const byOwner = ownerNodeId ? (cmsByNodeId.get(ownerNodeId) ?? null) : null;

  if (byOwner && byContent && byOwner !== byContent) {
    return byContent;
  }

  return byOwner ?? byContent ?? null;
}

/** Umbraco CMS member login emails keyed by exported profile directory name. */
export function loadCmsMemberEmailByProfileKey(
  umbracoUsersRoot: string,
): Map<string, string> {
  const cmsByNodeId = loadCmsMembersByNodeId();
  if (!cmsByNodeId.size) {
    return new Map();
  }

  const contentUserIdByProfileKey =
    loadContentUserIdByProfileKey(umbracoUsersRoot);
  const map = new Map<string, string>();

  for (const profileKey of loadUmbracoProfileKeys(umbracoUsersRoot)) {
    const generalPath = join(
      umbracoUsersRoot,
      profileKey,
      'profile-info',
      'general.json',
    );
    const general = JSON.parse(readFileSync(generalPath, 'utf8')) as JsonRecord;
    const email = resolveProfileCmsMemberEmail(
      general.owner,
      contentUserIdByProfileKey.get(profileKey),
      cmsByNodeId,
    );

    if (email) {
      map.set(profileKey, email);
    }
  }

  return map;
}

/** Resolve a real Umbraco creator email, or null when none is available. */
export function resolveCreatorEmailFromUmbraco(
  profileKey: string,
  supportEmail: unknown,
  notificationEmails: unknown,
  usedEmails: Set<string>,
  cmsMemberEmailByProfileKey: Map<string, string> = new Map(),
): string | null {
  const cmsMemberEmail = cmsMemberEmailByProfileKey.get(profileKey);
  if (cmsMemberEmail && !usedEmails.has(cmsMemberEmail)) {
    usedEmails.add(cmsMemberEmail);
    return cmsMemberEmail;
  }

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

  return null;
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
  'CamComm',
  'Diy_for_børn',
  'Foreningen_Danske_Revisorer',
  'Fredensborg_Sundhedscenter',
  'Galleri_EVIG',
  'Go_Video',
  'Kiibee',
  'Kiibee_(1)',
  'Kiibee_Comedy',
  'Kiibee_hjælpe_videoer',
  'Kort_&_Dokumentar_Filmskolen',
  'Letsmove_-_Motion_i_Centrum',
  'LindaAndrews',
  'Maria_Birch_Rasmussen',
  'mariebrixtofte',
  'Maximilian_Nielsen',
  'NuVenue',
  'Publika',
  'Puplika',
  'Rikke_Brunner',
  'Rumhed',
  'TjelesVenner',
  'Vocal_Line',
  'gymstream',
  'jwtc',
]);

export function isSkippedUmbracoProfile(profileKey: string): boolean {
  return UMBRACO_SKIP_PROFILE_KEYS.has(profileKey);
}

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
  Microphone_Entertainment: 'comedy',
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

  // Prefer Umbraco thumbnail / creator cover before Cloudflare stream thumbs —
  // many legacy videoIDs no longer resolve on videodelivery.net (404).
  const thumbnailUrl =
    resolveUmbracoThumbnailMediaUrl(getUmbracoShowValue(show, 'thumbnail')) ??
    resolveUmbracoThumbnailMediaUrl(
      getUmbracoShowValue(show, 'videoThumbnailURL'),
    ) ??
    rawFileImageUrl ??
    fallbacks.creatorCoverImageUrl ??
    fallbacks.creatorLogoUrl ??
    cloudflareThumbnail ??
    buildContentPlaceholderThumbnailUrl(title);

  const thumbnailLandscapeUrl =
    resolveUmbracoThumbnailMediaUrl(
      getUmbracoShowValue(show, 'videoThumbnailURL'),
    ) ??
    cloudflareThumbnail ??
    resolveUmbracoThumbnailMediaUrl(getUmbracoShowValue(show, 'thumbnail')) ??
    rawFileImageUrl ??
    fallbacks.creatorCoverImageUrl ??
    fallbacks.creatorLogoUrl ??
    cloudflareThumbnail ??
    thumbnailUrl;

  return { thumbnailUrl, thumbnailLandscapeUrl };
}
