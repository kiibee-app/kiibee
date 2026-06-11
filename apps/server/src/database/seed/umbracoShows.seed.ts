import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { eq } from 'drizzle-orm';

import { hashPassword } from 'src/utils/passwordHash';

import { db } from '../db';
import {
  loadUmbracoProfileKeys,
  resolveUmbracoMediaUrl,
} from './umbracoSeed.helpers';
import {
  auditLogs,
  collectionItems,
  collections,
  creatorChannels,
  mediaFileTags,
  mediaFiles,
  tags,
  users,
} from '../schema';

const DEFAULT_RENT_DURATION_HOURS = 48;
const DEFAULT_COLLECTION_NAME = 'Shows';

const LEGACY_TYPE_IDS: Record<string, string> = {
  '73': 'video',
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
};

type LoadedProfileShows = {
  profileKey: string;
  shows: UmbracoShow[];
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
  return deterministicUuid(`umbraco-profile:user:${profileKey}`);
}

function showSeedUuid(
  scope: string,
  profileKey: string,
  showKey: string,
): string {
  return deterministicUuid(`umbraco-show:${scope}:${profileKey}:${showKey}`);
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

function inferContentTypeId(show: UmbracoShow): string {
  const legacyTypeId = firstLegacyId(show.type);
  const mapped = legacyTypeId ? LEGACY_TYPE_IDS[legacyTypeId] : null;

  if (mapped) {
    return mapped;
  }

  const rawFile = textOrNull(show.rawFile) ?? '';
  const lowerRawFile = rawFile.toLowerCase();

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

  if (lowerRawFile.endsWith('.epub')) {
    return 'epub';
  }

  if (textOrNull(show.webContentURL)) {
    return 'web';
  }

  if (textOrNull(show.videoID) || textOrNull(show.videoDownloadURL)) {
    return 'video';
  }

  return 'video';
}

function resolveAccessType(
  show: UmbracoShow,
): 'free' | 'paid' | 'password' | 'email_gated' {
  const legacyAccessId = firstLegacyId(show.access);
  const mapped = legacyAccessId ? LEGACY_ACCESS_IDS[legacyAccessId] : null;

  if (mapped) {
    return mapped;
  }

  const buyPrice = textOrNull(show.purchasePrice);
  const rentPrice = textOrNull(show.rentalPrice);

  if (buyPrice || rentPrice) {
    return 'paid';
  }

  if (textOrNull(show.code)) {
    return 'password';
  }

  return 'free';
}

function resolveVisibility(
  show: UmbracoShow,
): 'public' | 'hidden' | 'draft' | 'private' {
  if (isEnabled(show.hidden)) {
    return 'hidden';
  }

  if (show.published && show.hasPublishedVersion) {
    return 'public';
  }

  return 'draft';
}

function parseInteger(value: unknown): number | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  const parsed = Number.parseInt(text, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDecimal(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) {
    return null;
  }

  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : null;
}

function resolveContentFields(show: UmbracoShow, contentTypeId: string) {
  const videoId = textOrNull(show.videoID);
  const rawFile = textOrNull(show.rawFile);
  const webContentUrl = textOrNull(show.webContentURL);
  const videoDownloadUrl = textOrNull(show.videoDownloadURL);

  if (contentTypeId === 'web') {
    return {
      fileKey: null,
      contentUrl: webContentUrl,
      fileSize: null,
    };
  }

  if (contentTypeId === 'video') {
    return {
      fileKey: videoId,
      contentUrl: videoDownloadUrl,
      fileSize: parseInteger(show.videoSize),
    };
  }

  return {
    fileKey: rawFile?.replace(/^\//, '') ?? null,
    contentUrl: resolveMediaUrl(rawFile),
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

function readShowsFile(profileKey: string, root: string): UmbracoShow[] | null {
  const showsDir = join(root, profileKey, 'shows');
  const candidates = [
    join(showsDir, 'items.json'),
    join(showsDir, 'shows.json'),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      continue;
    }

    const parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    if (!Array.isArray(parsed) || parsed.length === 0) {
      continue;
    }

    return parsed as UmbracoShow[];
  }

  return null;
}

function loadProfileShows(root: string): LoadedProfileShows[] {
  return loadUmbracoProfileKeys(root)
    .filter((profileKey) => readShowsFile(profileKey, root))
    .map((profileKey) => ({
      profileKey,
      shows: readShowsFile(profileKey, root) ?? [],
    }));
}

async function resolveChannelSlug(creatorId: string): Promise<string | null> {
  const [channel] = await db
    .select({ slug: creatorChannels.slug })
    .from(creatorChannels)
    .where(eq(creatorChannels.creatorId, creatorId))
    .limit(1);

  return channel?.slug ?? null;
}

async function ensureDefaultCollection(
  profileKey: string,
  creatorId: string,
  channelSlug: string,
  now: Date,
): Promise<string> {
  const collectionId = showSeedUuid('collection', profileKey, 'default');
  const collectionSlug = truncate(`${channelSlug}-shows`, 500);

  await db
    .insert(collections)
    .values({
      id: collectionId,
      creatorId,
      name: DEFAULT_COLLECTION_NAME,
      slug: collectionSlug,
      visibility: 'public',
      accessType: 'free',
      sortOrder: 0,
      isPublished: true,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: collections.id,
      set: {
        name: DEFAULT_COLLECTION_NAME,
        slug: collectionSlug,
        visibility: 'public',
        isPublished: true,
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

  let profilesProcessed = 0;
  let showsProcessed = 0;
  let showsSkipped = 0;

  for (const profile of profiles) {
    const creatorId = profileUserId(profile.profileKey);

    const [creator] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, creatorId))
      .limit(1);

    if (!creator) {
      showsSkipped += profile.shows.length;
      continue;
    }

    const channelSlug = await resolveChannelSlug(creatorId);
    if (!channelSlug) {
      showsSkipped += profile.shows.length;
      continue;
    }

    const now = new Date();
    const collectionId = await ensureDefaultCollection(
      profile.profileKey,
      creatorId,
      channelSlug,
      now,
    );

    for (const show of profile.shows) {
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
        textOrNull(show.title) ?? textOrNull(show.name) ?? 'Untitled',
        500,
      );
      const description =
        stripHtml(
          textOrNull(show.expandedDescription) ?? textOrNull(show.description),
        ) ?? '';
      const slug = buildContentSlug(channelSlug, { ...show, key: showKey });
      const sortOrder =
        parseInteger(show.orderID) ?? parseInteger(show.sortOrder) ?? 0;
      const publishedYear = parseInteger(show.year);
      const duration = parseInteger(show.length);
      const buyPrice = parseDecimal(show.purchasePrice);
      const rentPrice = parseDecimal(show.rentalPrice);
      const thumbnailUrl =
        resolveMediaUrl(show.thumbnail) ??
        resolveMediaUrl(show.videoThumbnailURL);
      const thumbnailLandscapeUrl = resolveMediaUrl(show.videoThumbnailURL);
      const trailerUrl = resolveMediaUrl(show.trailer);
      const accessCode = textOrNull(show.code);
      const passwordHash = accessCode ? await hashPassword(accessCode) : null;
      const mediaFileId = showSeedUuid('media', profile.profileKey, showKey);
      const collectionItemId = showSeedUuid(
        'collection-item',
        profile.profileKey,
        showKey,
      );
      const auditLogId = showSeedUuid('audit', profile.profileKey, showKey);
      const isPublished = visibility === 'public';
      const publishedAt = isPublished ? now : null;

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
            production_company: textOrNull(show.production),
            manufacturerLink:
              resolveMediaUrl(show.productionLink) ??
              textOrNull(show.productionLink),
            visibility,
            accessType,
            buyPrice,
            rentPrice,
            rentDurationHours:
              rentPrice && accessType === 'paid'
                ? DEFAULT_RENT_DURATION_HOURS
                : null,
            currency: 'DKK',
            physicalProductLink:
              resolveMediaUrl(show.productLink) ?? textOrNull(show.productLink),
            passwordHash,
            isDownloadable: !isEnabled(show.hideDownload),
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
              production_company: textOrNull(show.production),
              manufacturerLink:
                resolveMediaUrl(show.productionLink) ??
                textOrNull(show.productionLink),
              visibility,
              accessType,
              buyPrice,
              rentPrice,
              rentDurationHours:
                rentPrice && accessType === 'paid'
                  ? DEFAULT_RENT_DURATION_HOURS
                  : null,
              physicalProductLink:
                resolveMediaUrl(show.productLink) ??
                textOrNull(show.productLink),
              passwordHash,
              isDownloadable: !isEnabled(show.hideDownload),
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
          .onConflictDoNothing({ target: collectionItems.id });

        const showTags = parseTags(show.tags);
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
          .insert(auditLogs)
          .values({
            id: auditLogId,
            userId: creatorId,
            action: 'umbraco_show_seed',
            entityType: 'media_file',
            entityId: mediaFileId,
            details: {
              source: 'umbraco-data/shows',
              profileKey: profile.profileKey,
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
              },
              raw: show,
            },
            createdAt: now,
          })
          .onConflictDoNothing({ target: auditLogs.id });
      });

      showsProcessed += 1;
    }

    profilesProcessed += 1;
  }

  console.log(
    `Umbraco shows seed completed (${showsProcessed} shows across ${profilesProcessed} profiles, ${showsSkipped} skipped from ${root})`,
  );
};
