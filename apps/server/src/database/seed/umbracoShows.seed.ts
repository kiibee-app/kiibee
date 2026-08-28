import { createHash } from 'crypto';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { eq } from 'drizzle-orm';

import { hashPassword } from 'src/utils/passwordHash';

import { db } from '../db';
import {
  extractCloudflareVideoId,
  getUmbracoShowValue,
  inferContentCategoryId,
  loadProfileCategoryContext,
  loadUmbracoProfileKeys,
  profileSeedKey,
  resolveProfileDefaultCategoryId,
  resolveUmbracoMediaUrl,
  resolveUmbracoShowThumbnails,
} from './umbracoSeed.helpers';
import {
  auditLogs,
  collectionItems,
  collections,
  creatorChannels,
  mediaFileCategories,
  mediaFileTags,
  mediaFiles,
  tags,
  users,
} from '../schema';

const DEFAULT_RENT_DURATION_HOURS = 48;
const DEFAULT_COLLECTION_NAME = 'Shows';
const DEFAULT_COLLECTION_KEY = 'default';

const LEGACY_TYPE_IDS: Record<string, string> = {
  '73': 'video',
  '74': 'epub',
  '75': 'pdf',
  '76': 'audio',
  '264': 'web',
};

const LEGACY_ACCESS_IDS: Record<
  string,
  'free' | 'paid' | 'password' | 'email_gated'
> = {
  '57': 'email_gated',
  '58': 'paid',
  '59': 'password',
  '60': 'free',
};

type JsonRecord = Record<string, unknown>;

type UmbracoShow = {
  id?: number;
  key: string;
  udi?: string;
  name?: string;
  title?: string;
  contentTypeAlias?: string;
  description?: string;
  expandedDescription?: string;
  published?: boolean;
  hasPublishedVersion?: boolean;
  hidden?: boolean;
  urls?: string[];
  orderID?: string | number;
  sortOrder?: number;
  type?: string[] | string;
  access?: string[] | string;
  rawFile?: string;
  videoID?: string;
  videoDownloadURL?: string;
  videoThumbnailURL?: string;
  videoSize?: string | number;
  webContentURL?: string;
  trailer?: string;
  thumbnail?: unknown;
  year?: string | number;
  length?: string | number;
  production?: string;
  productionLink?: string;
  productLink?: string;
  rentalPrice?: string | number;
  purchasePrice?: string | number;
  code?: string;
  hideDownload?: boolean | string | number;
  hidePlay?: boolean | string | number;
  tags?: string;
  properties?: JsonRecord;
  fields?: JsonRecord;
  sourceFolder?: string;
};

type CollectionMeta = {
  name: string;
  collectionKey: string;
  sortOrder: number;
  description: string | null;
  coverImageUrl: string | null;
  accessType: 'free' | 'paid' | 'password' | 'email_gated';
  buyPrice: string | null;
  rentPrice: string | null;
  accessCode: string | null;
  passwordHash: string | null;
  visibility: 'public' | 'hidden' | 'draft' | 'private';
  isPublished: boolean;
};

type LoadedCollection = CollectionMeta & {
  items: UmbracoShow[];
};

type LoadedProfileShows = {
  profileKey: string;
  collections: LoadedCollection[];
};

function deterministicUuid(value: string): string {
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

function profileUserId(profileKey: string): string {
  return deterministicUuid(
    `umbraco-profile:user:${profileSeedKey(profileKey)}`,
  );
}

function showSeedUuid(
  scope: string,
  profileKey: string,
  showKey: string,
): string {
  return deterministicUuid(
    `umbraco-show:${scope}:${profileSeedKey(profileKey)}:${showKey}`,
  );
}

function textOrNull(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return null;
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : value.slice(0, maxLength);
}

function slugify(value: string): string {
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

function stripHtml(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const text = value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text || null;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  return [String(value)];
}

function isEnabled(value: unknown): boolean {
  if (value === true || value === 1) {
    return true;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
  }

  return false;
}

function resolveMediaUrl(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return resolveUmbracoMediaUrl(value);
  }

  if (typeof value === 'object' && value !== null) {
    return resolveMediaUrl((value as JsonRecord).src);
  }

  return null;
}

function slugFromUrls(urls: string[] | undefined): string | null {
  const url = urls?.[0];
  if (!url) {
    return null;
  }

  const parts = url.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : null;
}

function buildContentSlug(channelSlug: string, show: UmbracoShow): string {
  const title = textOrNull(show.title) ?? textOrNull(show.name) ?? 'content';
  const fromUrl = slugFromUrls(show.urls);
  const base = slugify(fromUrl ?? title);
  const suffix = show.key.replace(/-/g, '').slice(0, 8);

  return truncate(`${channelSlug}-${base}-${suffix}`, 500);
}

function firstLegacyId(
  value: unknown,
  fallback: string | null = null,
): string | null {
  const ids = toArray(value);
  return ids[0] ?? fallback;
}

function showValue(show: UmbracoShow, key: string): unknown {
  return getUmbracoShowValue(show as JsonRecord, key);
}

function inferContentTypeId(show: UmbracoShow): string {
  const rawFile = textOrNull(showValue(show, 'rawFile')) ?? '';
  const lowerRawFile = rawFile.toLowerCase();
  const title = (
    textOrNull(showValue(show, 'title')) ??
    textOrNull(show.name) ??
    ''
  ).toLowerCase();

  // File extension / title beat legacy Umbraco type ids (many ebooks are typed as 75/pdf).
  if (
    lowerRawFile.endsWith('.epub') ||
    title.includes('e-pub') ||
    title.includes('epub')
  ) {
    return 'epub';
  }

  if (lowerRawFile.endsWith('.pdf')) {
    return 'pdf';
  }

  if (
    lowerRawFile.endsWith('.mp3') ||
    lowerRawFile.endsWith('.wav') ||
    lowerRawFile.endsWith('.m4a')
  ) {
    return 'audio';
  }

  const legacyTypeId = firstLegacyId(showValue(show, 'type'));
  const mapped = legacyTypeId ? LEGACY_TYPE_IDS[legacyTypeId] : null;

  if (mapped) {
    return mapped;
  }

  if (textOrNull(showValue(show, 'webContentURL'))) {
    return 'web';
  }

  if (
    textOrNull(showValue(show, 'videoID')) ||
    textOrNull(showValue(show, 'videoDownloadURL'))
  ) {
    return 'video';
  }

  return 'video';
}

function resolveAccessType(
  show: UmbracoShow,
): 'free' | 'paid' | 'password' | 'email_gated' {
  const legacyAccessId = firstLegacyId(showValue(show, 'access'));
  const mapped = legacyAccessId ? LEGACY_ACCESS_IDS[legacyAccessId] : null;

  if (mapped) {
    return mapped;
  }

  if (
    hasPositivePrice(showValue(show, 'purchasePrice')) ||
    hasPositivePrice(showValue(show, 'rentalPrice'))
  ) {
    return 'paid';
  }

  if (textOrNull(showValue(show, 'code'))) {
    return 'password';
  }

  return 'free';
}

function resolveVisibility(
  show: UmbracoShow,
): 'public' | 'hidden' | 'draft' | 'private' {
  if (isEnabled(showValue(show, 'hidden'))) {
    return 'hidden';
  }

  if (show.published && show.hasPublishedVersion) {
    return 'public';
  }

  return 'draft';
}

const PG_INT4_MAX = 2_147_483_647;
const PG_INT4_MIN = -2_147_483_648;

function parseInteger(value: unknown): number | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  const parsed = Number.parseInt(text, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  // Postgres integer columns reject values outside int4 (e.g. large videoSize).
  if (parsed > PG_INT4_MAX || parsed < PG_INT4_MIN) {
    return null;
  }

  return parsed;
}

function parseDecimal(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : null;
}

function hasPositivePrice(value: unknown): boolean {
  const parsed = parseDecimal(value);
  return parsed != null && Number.parseFloat(parsed) > 0;
}

function normalizeStorageFileKey(value: string | null): string | null {
  if (!value) {
    return null;
  }

  let key = value.replace(/^\/+/, '').trim();
  if (!key) {
    return null;
  }

  // Umbraco paths are `/media/<id>/<file>`; DO Spaces object keys omit the `media/` prefix.
  if (/^media\//i.test(key)) {
    key = key.replace(/^media\//i, '');
  }

  return key || null;
}

function resolveContentFields(show: UmbracoShow, contentTypeId: string) {
  const videoDownloadUrl = textOrNull(showValue(show, 'videoDownloadURL'));
  const videoId =
    extractCloudflareVideoId(showValue(show, 'videoID')) ??
    extractCloudflareVideoId(videoDownloadUrl);
  const rawFile = textOrNull(showValue(show, 'rawFile'));
  const webContentUrl = textOrNull(showValue(show, 'webContentURL'));

  if (contentTypeId === 'web') {
    // External links (YouTube, product pages) — no storage key; URL is required.
    return {
      fileKey: null,
      contentUrl: webContentUrl,
      fileSize: null,
    };
  }

  if (contentTypeId === 'video') {
    return {
      fileKey: videoId,
      // Playback via Cloudflare stream from fileKey; do not store public download URLs.
      contentUrl: null,
      fileSize: parseInteger(showValue(show, 'videoSize')),
    };
  }

  // pdf / epub / audio — signed URL from fileKey; keep web URL only when no file exists.
  const fileKey = normalizeStorageFileKey(rawFile);
  return {
    fileKey,
    contentUrl: fileKey ? null : webContentUrl,
    fileSize: null,
  };
}

function parseTags(value: unknown): string[] {
  const text = textOrNull(value);
  if (!text) {
    return [];
  }

  return text
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function hasSeedableMediaPayload(show: UmbracoShow): boolean {
  const alias = String(show.contentTypeAlias || '').toLowerCase();
  if (alias === 'collection' || alias === 'folder') {
    return false;
  }

  return Boolean(
    textOrNull(showValue(show, 'videoID')) ||
    textOrNull(showValue(show, 'videoDownloadURL')) ||
    textOrNull(showValue(show, 'rawFile')) ||
    textOrNull(showValue(show, 'webContentURL')),
  );
}

function normalizePurchaseMediaToShow(entry: JsonRecord): UmbracoShow | null {
  const key =
    textOrNull(entry.key) ??
    textOrNull(entry.udi)?.replace(/^umb:\/\/document\//i, '') ??
    null;
  if (!key) {
    return null;
  }

  const normalizedKey = key.includes('-')
    ? key.toLowerCase()
    : [
        key.slice(0, 8),
        key.slice(8, 12),
        key.slice(12, 16),
        key.slice(16, 20),
        key.slice(20, 32),
      ]
        .filter(Boolean)
        .join('-')
        .toLowerCase();

  const urls = Array.isArray(entry.urls)
    ? entry.urls.map((url) => String(url))
    : undefined;

  return {
    id: typeof entry.id === 'number' ? entry.id : undefined,
    key: normalizedKey,
    udi: textOrNull(entry.udi) ?? undefined,
    name: textOrNull(entry.name) ?? undefined,
    title: textOrNull(entry.title) ?? textOrNull(entry.name) ?? undefined,
    urls,
    contentTypeAlias: textOrNull(entry.contentTypeAlias) ?? undefined,
    videoID: textOrNull(entry.videoID) ?? undefined,
    videoDownloadURL: textOrNull(entry.videoDownloadURL) ?? undefined,
    videoThumbnailURL: textOrNull(entry.videoThumbnailURL) ?? undefined,
    rawFile: textOrNull(entry.rawFile) ?? undefined,
    webContentURL: textOrNull(entry.webContentURL) ?? undefined,
    thumbnail: entry.thumbnail,
    purchasePrice: textOrNull(entry.purchasePrice) ?? undefined,
    rentalPrice: textOrNull(entry.rentalPrice) ?? undefined,
    published: true,
    hasPublishedVersion: true,
    hidden: false,
    sourceFolder: collectionNameFromUrls(urls) ?? DEFAULT_COLLECTION_NAME,
  };
}

function collectionNameFromUrls(urls: string[] | undefined): string | null {
  const url = urls?.[0];
  if (!url || url.toLowerCase().includes('endnu ikke')) {
    return null;
  }

  const parts = url.split('/').filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  return parts[1]
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function looksLikeUmbracoOrderCode(value: string): boolean {
  const trimmed = value.trim();
  // Compact alphanumeric with BOTH letters and digits (e.g. 54l827102024162452).
  return /^(?=.*[a-z])(?=.*\d)[a-z0-9]{12,28}$/i.test(trimmed);
}

function isHumanContentTitle(
  value: string | null | undefined,
): value is string {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === 'untitled') {
    return false;
  }

  return !looksLikeUmbracoOrderCode(trimmed);
}

function firstPurchaseMediaName(purchase: JsonRecord): string | null {
  const candidates: unknown[] = [];
  if (Array.isArray(purchase.mediaNames)) {
    candidates.push(...purchase.mediaNames);
  }

  const props = (purchase.properties as JsonRecord | undefined) ?? {};
  if (Array.isArray(props.mediaNames)) {
    candidates.push(...props.mediaNames);
  }

  const mediaList = Array.isArray(purchase.media) ? purchase.media : [];
  for (const entry of mediaList) {
    const record = entry as JsonRecord;
    candidates.push(record.name, record.title);
  }

  for (const candidate of candidates) {
    const name = textOrNull(candidate);
    if (isHumanContentTitle(name)) {
      return name;
    }
  }

  return null;
}

function enrichPurchaseMediaFromPurchases(
  profileKey: string,
  root: string,
  media: UmbracoShow[],
): UmbracoShow[] {
  const purchasesPath = join(root, profileKey, 'purchases', 'items.json');
  const purchases = readShowsArray(purchasesPath) as unknown as JsonRecord[];
  if (!purchases.length) {
    return media;
  }

  const byMediaKey = new Map<string, JsonRecord>();
  for (const purchase of purchases) {
    const mediaList = Array.isArray(purchase.media) ? purchase.media : [];
    for (const mediaEntry of mediaList) {
      const record = mediaEntry as JsonRecord;
      const key = textOrNull(record.key)?.toLowerCase();
      if (key) {
        byMediaKey.set(key, purchase);
      }
    }

    const relationUdis = Array.isArray(purchase.mediaUdis)
      ? purchase.mediaUdis
      : [];
    for (const udi of relationUdis) {
      const key = String(udi)
        .replace(/^umb:\/\/document\//i, '')
        .toLowerCase();
      const normalized = key.includes('-')
        ? key
        : [
            key.slice(0, 8),
            key.slice(8, 12),
            key.slice(12, 16),
            key.slice(16, 20),
            key.slice(20, 32),
          ]
            .filter(Boolean)
            .join('-');
      byMediaKey.set(normalized, purchase);
    }
  }

  return media.map((show) => {
    const existingTitle =
      textOrNull(show.title) || textOrNull(show.name) || null;
    if (hasSeedableMediaPayload(show) && isHumanContentTitle(existingTitle)) {
      return show;
    }

    const purchase = byMediaKey.get(show.key.toLowerCase());
    if (!purchase) {
      return show;
    }

    const props = (purchase.properties as JsonRecord | undefined) ?? {};
    const videoID =
      textOrNull(props.videoID) ?? textOrNull(purchase.videoID) ?? undefined;
    const rawFile =
      textOrNull(props.rawFile) ?? textOrNull(purchase.rawFile) ?? undefined;
    const webContentURL =
      textOrNull(props.webContentURL) ??
      textOrNull(purchase.webContentURL) ??
      undefined;

    const name =
      (isHumanContentTitle(existingTitle) ? existingTitle : null) ||
      firstPurchaseMediaName(purchase);

    if (!isHumanContentTitle(name)) {
      return show;
    }

    return {
      ...show,
      name,
      title: textOrNull(show.title) || name,
      videoID: textOrNull(show.videoID) || videoID,
      rawFile: textOrNull(show.rawFile) || rawFile,
      webContentURL: textOrNull(show.webContentURL) || webContentURL,
      contentTypeAlias: textOrNull(show.contentTypeAlias) || 'media',
    };
  });
}

function readPurchaseMediaAsShows(
  profileKey: string,
  root: string,
): UmbracoShow[] {
  const mediaPath = join(root, profileKey, 'purchases', 'media.json');
  const parsed = readJsonFile(mediaPath);
  if (!Array.isArray(parsed) || !parsed.length) {
    return [];
  }

  const shows = parsed
    .map((entry) => normalizePurchaseMediaToShow(entry as JsonRecord))
    .filter((show): show is UmbracoShow => Boolean(show));

  return enrichPurchaseMediaFromPurchases(profileKey, root, shows).filter(
    (show) =>
      hasSeedableMediaPayload(show) &&
      isHumanContentTitle(textOrNull(show.title) || textOrNull(show.name)),
  );
}

function collectSeededShowKeys(collections: LoadedCollection[]): Set<string> {
  const keys = new Set<string>();
  for (const collection of collections) {
    for (const item of collection.items) {
      if (item.key) {
        keys.add(item.key.toLowerCase());
      }
    }
  }
  return keys;
}

function mergePurchaseMediaCollections(
  existing: LoadedCollection[],
  purchaseShows: UmbracoShow[],
): LoadedCollection[] {
  if (!purchaseShows.length) {
    return existing;
  }

  const knownKeys = collectSeededShowKeys(existing);
  const missing = purchaseShows.filter(
    (show) => !knownKeys.has(show.key.toLowerCase()),
  );
  if (!missing.length) {
    return existing;
  }

  return [...existing, ...groupShowsBySourceFolder(missing)];
}

function findUmbracoUsersRoot(): string | null {
  const envRoot = process.env.UMBRACO_DATA_USERS_PATH?.trim();
  const candidates = [
    ...(envRoot ? [resolve(envRoot)] : []),
    resolve(process.cwd(), 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', '..', 'umbraco-data', 'users'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function readJsonFile(filePath: string): unknown | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readShowsArray(filePath: string): UmbracoShow[] {
  const parsed = readJsonFile(filePath);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return [];
  }

  return parsed as UmbracoShow[];
}

function readShowsFile(profileKey: string, root: string): UmbracoShow[] {
  const showsDir = join(root, profileKey, 'shows');
  const candidates = [
    join(showsDir, 'items.json'),
    join(showsDir, 'shows.json'),
  ];

  for (const filePath of candidates) {
    const items = readShowsArray(filePath).filter(hasSeedableMediaPayload);
    if (items.length) {
      return items;
    }
  }

  return [];
}

function resolveAccessTypeFromFields(
  fields: JsonRecord | undefined,
): 'free' | 'paid' | 'password' | 'email_gated' {
  if (!fields) {
    return 'free';
  }

  const legacyAccessId = firstLegacyId(fields.access);
  const mapped = legacyAccessId ? LEGACY_ACCESS_IDS[legacyAccessId] : null;
  if (mapped) {
    return mapped;
  }

  if (
    hasPositivePrice(fields.purchasePrice) ||
    hasPositivePrice(fields.rentalPrice)
  ) {
    return 'paid';
  }

  if (textOrNull(fields.code)) {
    return 'password';
  }

  return 'free';
}

function buildCollectionMetaFromParent(
  collectionKey: string,
  fallbackName: string,
  parent: JsonRecord | null,
  sortOrder: number,
): CollectionMeta {
  const fields = (parent?.fields as JsonRecord | undefined) ?? undefined;
  const name =
    textOrNull(fields?.headline) ||
    textOrNull(parent?.name) ||
    fallbackName ||
    DEFAULT_COLLECTION_NAME;
  const accessType = resolveAccessTypeFromFields(fields);
  const published =
    parent?.published === true && parent?.hasPublishedVersion !== false;
  const hidden = isEnabled(fields?.hidden);

  return {
    name,
    collectionKey,
    sortOrder:
      parseInteger(fields?.orderID) ??
      parseInteger(parent?.sortOrder) ??
      sortOrder,
    description:
      stripHtml(
        textOrNull(fields?.description) ?? textOrNull(fields?.headline),
      ) ?? null,
    coverImageUrl: resolveMediaUrl(fields?.coverImage),
    accessType,
    buyPrice: parseDecimal(fields?.purchasePrice),
    rentPrice: parseDecimal(fields?.rentalPrice),
    accessCode: textOrNull(fields?.code),
    passwordHash: null,
    visibility: hidden ? 'hidden' : published ? 'public' : 'draft',
    isPublished: !hidden && published,
  };
}

function readContentCollections(
  profileKey: string,
  root: string,
): LoadedCollection[] {
  const contentDirs = [
    join(root, profileKey, 'content'),
    ...(profileKey === 'Rikke_Brünner'
      ? [join(root, 'Rikke_Brunner', 'content')]
      : []),
  ].filter((dir, index, all) => existsSync(dir) && all.indexOf(dir) === index);

  if (!contentDirs.length) {
    return [];
  }

  const loadedByKey = new Map<string, LoadedCollection>();

  for (const contentDir of contentDirs) {
    const folderEntries = readdirSync(contentDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const [index, entry] of folderEntries.entries()) {
      const folderDir = join(contentDir, entry.name);
      const items = readShowsArray(join(folderDir, 'items.json')).filter(
        hasSeedableMediaPayload,
      );
      if (!items.length) {
        continue;
      }

      const indexJson = readJsonFile(
        join(folderDir, 'index.json'),
      ) as JsonRecord | null;
      const parent = (indexJson?.parent as JsonRecord | undefined) ?? null;
      const collectionName =
        textOrNull(indexJson?.collectionName) ||
        textOrNull(parent?.name) ||
        entry.name.replace(/_/g, ' ');
      const parentKey = textOrNull(parent?.key)?.toLowerCase();
      const collectionKey = parentKey || slugify(entry.name) || entry.name;

      if (loadedByKey.has(collectionKey)) {
        continue;
      }

      loadedByKey.set(collectionKey, {
        ...buildCollectionMetaFromParent(
          collectionKey,
          collectionName,
          parent,
          index,
        ),
        name: collectionName,
        items,
      });
    }
  }

  return [...loadedByKey.values()];
}

function groupShowsBySourceFolder(shows: UmbracoShow[]): LoadedCollection[] {
  const groups = new Map<string, UmbracoShow[]>();

  for (const show of shows) {
    const folder =
      textOrNull(show.sourceFolder)?.trim() || DEFAULT_COLLECTION_NAME;
    const list = groups.get(folder) ?? [];
    list.push(show);
    groups.set(folder, list);
  }

  return [...groups.entries()].map(([name, items], index) => ({
    name,
    collectionKey:
      name === DEFAULT_COLLECTION_NAME
        ? DEFAULT_COLLECTION_KEY
        : slugify(name) || `folder-${index}`,
    sortOrder: index,
    description: null,
    coverImageUrl: null,
    accessType: 'free' as const,
    buyPrice: null,
    rentPrice: null,
    accessCode: null,
    passwordHash: null,
    visibility: 'public' as const,
    isPublished: true,
    items,
  }));
}

function loadProfileShows(root: string): LoadedProfileShows[] {
  return loadUmbracoProfileKeys(root)
    .map((profileKey) => {
      const fromContent = readContentCollections(profileKey, root);
      const fromPurchaseMedia = readPurchaseMediaAsShows(profileKey, root);

      if (fromContent.length) {
        return {
          profileKey,
          collections: mergePurchaseMediaCollections(
            fromContent,
            fromPurchaseMedia,
          ),
        };
      }

      const fromShows = readShowsFile(profileKey, root);
      const combined = (() => {
        if (!fromShows.length) {
          return fromPurchaseMedia;
        }
        if (!fromPurchaseMedia.length) {
          return fromShows;
        }

        const known = new Set(fromShows.map((show) => show.key.toLowerCase()));
        return [
          ...fromShows,
          ...fromPurchaseMedia.filter(
            (show) => !known.has(show.key.toLowerCase()),
          ),
        ];
      })();

      if (!combined.length) {
        return { profileKey, collections: [] };
      }

      return {
        profileKey,
        collections: groupShowsBySourceFolder(combined),
      };
    })
    .filter((profile) => profile.collections.length > 0);
}

async function resolveCreatorChannel(creatorId: string): Promise<{
  slug: string;
  coverImageUrl: string | null;
  logoUrl: string | null;
} | null> {
  const [channel] = await db
    .select({
      slug: creatorChannels.slug,
      coverImageUrl: creatorChannels.coverImageUrl,
      logoUrl: creatorChannels.logoUrl,
    })
    .from(creatorChannels)
    .where(eq(creatorChannels.creatorId, creatorId))
    .limit(1);

  return channel ?? null;
}

async function ensureCollection(
  profileKey: string,
  creatorId: string,
  channelSlug: string,
  collection: LoadedCollection,
  now: Date,
  defaultPasswordHash: string,
): Promise<string> {
  const collectionId = showSeedUuid(
    'collection',
    profileKey,
    collection.collectionKey,
  );
  const nameSlug = slugify(collection.name) || 'collection';
  const collectionSlug = truncate(
    collection.collectionKey === DEFAULT_COLLECTION_KEY
      ? `${channelSlug}-${nameSlug}`
      : `${channelSlug}-${nameSlug}-${slugify(collection.collectionKey) || collection.collectionKey}`,
    500,
  );
  const passwordHash =
    collection.accessType === 'password'
      ? collection.accessCode
        ? await hashPassword(collection.accessCode)
        : defaultPasswordHash
      : collection.passwordHash;

  await db
    .insert(collections)
    .values({
      id: collectionId,
      creatorId,
      name: truncate(collection.name, 500),
      slug: collectionSlug,
      coverImageUrl: collection.coverImageUrl,
      description: collection.description,
      visibility: collection.visibility,
      accessType: collection.accessType,
      buyPrice: collection.buyPrice,
      rentPrice: collection.rentPrice,
      rentDuration:
        collection.accessType === 'paid' &&
        hasPositivePrice(collection.rentPrice)
          ? String(DEFAULT_RENT_DURATION_HOURS)
          : null,
      sortOrder: collection.sortOrder,
      passwordHash,
      isPublished: collection.isPublished,
      publishedAt: collection.isPublished ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: collections.id,
      set: {
        name: truncate(collection.name, 500),
        slug: collectionSlug,
        coverImageUrl: collection.coverImageUrl,
        description: collection.description,
        visibility: collection.visibility,
        accessType: collection.accessType,
        buyPrice: collection.buyPrice,
        rentPrice: collection.rentPrice,
        rentDuration:
          collection.accessType === 'paid' &&
          hasPositivePrice(collection.rentPrice)
            ? String(DEFAULT_RENT_DURATION_HOURS)
            : null,
        sortOrder: collection.sortOrder,
        passwordHash,
        isPublished: collection.isPublished,
        publishedAt: collection.isPublished ? now : null,
        updatedAt: now,
      },
    });

  return collectionId;
}

export const seedUmbracoShows = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco shows seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const profiles = loadProfileShows(root);
  if (!profiles.length) {
    console.log(`Umbraco shows seed skipped (no shows found in ${root})`);
    return;
  }

  const defaultSeedPasswordHash = await hashPassword('123456');

  let profilesProcessed = 0;
  let collectionsProcessed = 0;
  let showsProcessed = 0;
  let showsSkipped = 0;

  for (const profile of profiles) {
    const creatorId = profileUserId(profile.profileKey);
    const profileItemCount = profile.collections.reduce(
      (sum, collection) => sum + collection.items.length,
      0,
    );

    const [creator] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, creatorId))
      .limit(1);

    if (!creator) {
      showsSkipped += profileItemCount;
      continue;
    }

    const channel = await resolveCreatorChannel(creatorId);
    if (!channel?.slug) {
      showsSkipped += profileItemCount;
      continue;
    }

    const channelSlug = channel.slug;
    const now = new Date();
    const allItems = profile.collections.flatMap(
      (collection) => collection.items,
    );

    const profileContextText = loadProfileCategoryContext(
      profile.profileKey,
      root,
    );
    const profileDefaultCategoryId = resolveProfileDefaultCategoryId(
      profile.profileKey,
      profileContextText,
      allItems.map((show) => ({
        tags: parseTags(showValue(show, 'tags')),
        title: textOrNull(showValue(show, 'title')) ?? textOrNull(show.name),
        description:
          stripHtml(
            textOrNull(showValue(show, 'expandedDescription')) ??
              textOrNull(showValue(show, 'description')),
          ) ?? null,
        contentTypeId: inferContentTypeId(show),
      })),
    );

    for (const collection of profile.collections) {
      const collectionId = await ensureCollection(
        profile.profileKey,
        creatorId,
        channelSlug,
        collection,
        now,
        defaultSeedPasswordHash,
      );
      collectionsProcessed += 1;

      for (const show of collection.items) {
        const showKey = String(show.key || '').toLowerCase();
        if (!showKey) {
          showsSkipped += 1;
          continue;
        }

        const contentTypeId = inferContentTypeId(show);
        const accessType = resolveAccessType(show);
        const visibility = resolveVisibility(show);
        const contentFields = resolveContentFields(show, contentTypeId);
        const title = truncate(
          textOrNull(showValue(show, 'title')) ??
            textOrNull(show.name) ??
            'Untitled',
          500,
        );
        if (!isHumanContentTitle(title)) {
          showsSkipped += 1;
          continue;
        }
        const description =
          stripHtml(
            textOrNull(showValue(show, 'expandedDescription')) ??
              textOrNull(showValue(show, 'description')),
          ) ?? '';
        const slug = buildContentSlug(channelSlug, { ...show, key: showKey });
        const sortOrder =
          parseInteger(showValue(show, 'orderID')) ??
          parseInteger(show.sortOrder) ??
          0;
        const publishedYear = parseInteger(showValue(show, 'year'));
        const duration = parseInteger(showValue(show, 'length'));
        const buyPrice = parseDecimal(showValue(show, 'purchasePrice'));
        const rentPrice = parseDecimal(showValue(show, 'rentalPrice'));
        const { thumbnailUrl, thumbnailLandscapeUrl } =
          resolveUmbracoShowThumbnails(show, title, {
            creatorCoverImageUrl: channel.coverImageUrl,
            creatorLogoUrl: channel.logoUrl,
          });
        const trailerRaw =
          textOrNull(showValue(show, 'trailer')) ?? textOrNull(show.trailer);
        const trailerUrl = trailerRaw
          ? /^https?:\/\//i.test(trailerRaw)
            ? trailerRaw.trim()
            : resolveMediaUrl(trailerRaw)
          : null;
        const accessCode = textOrNull(showValue(show, 'code'));
        const passwordHash = accessCode
          ? await hashPassword(accessCode)
          : accessType === 'password'
            ? defaultSeedPasswordHash
            : null;
        const mediaFileId = showSeedUuid('media', profile.profileKey, showKey);
        const collectionItemId = showSeedUuid(
          'collection-item',
          profile.profileKey,
          showKey,
        );
        const auditLogId = showSeedUuid('audit', profile.profileKey, showKey);
        const isPublished = visibility === 'public';
        const publishedAt = isPublished ? now : null;
        const categoryId = inferContentCategoryId({
          profileKey: profile.profileKey,
          profileContextText,
          profileDefaultCategoryId,
          tags: parseTags(showValue(show, 'tags')),
          title,
          description: description || null,
          contentTypeId,
        });
        const mediaCategoryId = showSeedUuid(
          'media-category',
          profile.profileKey,
          showKey,
        );

        await db.transaction(async (tx) => {
          await tx
            .insert(mediaFiles)
            .values({
              id: mediaFileId,
              creatorId,
              title,
              slug,
              description,
              fileKey: contentFields.fileKey,
              contentUrl: contentFields.contentUrl,
              contentTypeId,
              fileSize: contentFields.fileSize,
              publishedYear,
              duration,
              thumbnailUrl,
              thumbnailLandscapeUrl,
              trailerUrl,
              production_company: textOrNull(showValue(show, 'production')),
              manufacturerLink:
                resolveMediaUrl(showValue(show, 'productionLink')) ??
                textOrNull(showValue(show, 'productionLink')),
              visibility,
              accessType,
              buyPrice,
              rentPrice,
              rentDurationHours:
                accessType === 'paid' && hasPositivePrice(rentPrice)
                  ? DEFAULT_RENT_DURATION_HOURS
                  : null,
              currency: 'DKK',
              physicalProductLink:
                resolveMediaUrl(showValue(show, 'productLink')) ??
                textOrNull(showValue(show, 'productLink')),
              passwordHash,
              isDownloadable: !isEnabled(showValue(show, 'hideDownload')),
              sortOrder,
              isPublished,
              publishedAt,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoUpdate({
              target: mediaFiles.id,
              set: {
                title,
                slug,
                description,
                fileKey: contentFields.fileKey,
                contentUrl: contentFields.contentUrl,
                contentTypeId,
                fileSize: contentFields.fileSize,
                publishedYear,
                duration,
                thumbnailUrl,
                thumbnailLandscapeUrl,
                trailerUrl,
                production_company: textOrNull(showValue(show, 'production')),
                manufacturerLink:
                  resolveMediaUrl(showValue(show, 'productionLink')) ??
                  textOrNull(showValue(show, 'productionLink')),
                visibility,
                accessType,
                buyPrice,
                rentPrice,
                rentDurationHours:
                  accessType === 'paid' && hasPositivePrice(rentPrice)
                    ? DEFAULT_RENT_DURATION_HOURS
                    : null,
                physicalProductLink:
                  resolveMediaUrl(showValue(show, 'productLink')) ??
                  textOrNull(showValue(show, 'productLink')),
                passwordHash,
                isDownloadable: !isEnabled(showValue(show, 'hideDownload')),
                sortOrder,
                isPublished,
                updatedAt: now,
              },
            });

          await tx
            .insert(collectionItems)
            .values({
              id: collectionItemId,
              collectionId,
              mediaFileId,
              sortOrder,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoUpdate({
              target: collectionItems.id,
              set: {
                collectionId,
                mediaFileId,
                sortOrder,
                updatedAt: now,
              },
            });

          const showTags = parseTags(showValue(show, 'tags'));
          for (const tagName of showTags) {
            const tagSlug = truncate(`${channelSlug}-${slugify(tagName)}`, 255);
            const tagId = showSeedUuid('tag', profile.profileKey, tagSlug);

            await tx
              .insert(tags)
              .values({
                id: tagId,
                name: truncate(tagName, 255),
                slug: tagSlug,
                creatorId,
                isActive: true,
                createdAt: now,
                updatedAt: now,
              })
              .onConflictDoUpdate({
                target: tags.id,
                set: {
                  name: truncate(tagName, 255),
                  slug: tagSlug,
                  creatorId,
                  isActive: true,
                  updatedAt: now,
                },
              });

            const mediaTagId = showSeedUuid(
              'media-tag',
              profile.profileKey,
              `${showKey}:${tagSlug}`,
            );

            await tx
              .insert(mediaFileTags)
              .values({
                id: mediaTagId,
                mediaFileId,
                tagId,
                createdAt: now,
                updatedAt: now,
              })
              .onConflictDoNothing();
          }

          await tx
            .delete(mediaFileCategories)
            .where(eq(mediaFileCategories.mediaFileId, mediaFileId));

          await tx.insert(mediaFileCategories).values({
            id: mediaCategoryId,
            mediaFileId,
            categoryId,
            createdAt: now,
            updatedAt: now,
          });

          await tx
            .insert(auditLogs)
            .values({
              id: auditLogId,
              userId: creatorId,
              action: 'umbraco_show_seed',
              entityType: 'media_file',
              entityId: mediaFileId,
              details: {
                source: 'umbraco-data/content',
                profileKey: profile.profileKey,
                collection: {
                  id: collectionId,
                  key: collection.collectionKey,
                  name: collection.name,
                },
                umbraco: {
                  id: show.id ?? null,
                  key: showKey,
                  udi: show.udi ?? null,
                  urls: show.urls ?? [],
                },
                mapped: {
                  slug,
                  contentTypeId,
                  accessType,
                  visibility,
                  collectionId,
                  categoryId,
                },
                raw: show,
              },
              createdAt: now,
            })
            .onConflictDoNothing({ target: auditLogs.id });
        });

        showsProcessed += 1;
      }
    }

    // Prefer content/ collections: drop leftover empty default "Shows" from older seeds.
    const defaultCollectionId = showSeedUuid(
      'collection',
      profile.profileKey,
      DEFAULT_COLLECTION_KEY,
    );
    const seededCollectionIds = new Set(
      profile.collections.map((collection) =>
        showSeedUuid(
          'collection',
          profile.profileKey,
          collection.collectionKey,
        ),
      ),
    );
    if (!seededCollectionIds.has(defaultCollectionId)) {
      const [remaining] = await db
        .select({ id: collectionItems.id })
        .from(collectionItems)
        .where(eq(collectionItems.collectionId, defaultCollectionId))
        .limit(1);

      if (!remaining) {
        await db
          .delete(collections)
          .where(eq(collections.id, defaultCollectionId));
      }
    }

    profilesProcessed += 1;
  }

  console.log(
    `Umbraco shows seed completed (${showsProcessed} items in ${collectionsProcessed} collections across ${profilesProcessed} profiles, ${showsSkipped} skipped from ${root})`,
  );
};
