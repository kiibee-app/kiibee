import 'dotenv/config';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { and, eq, inArray, sql } from 'drizzle-orm';

import { db } from '../src/database/db';
import {
  auditLogs,
  collectionItems,
  collections,
  contentAppearance,
  creatorChannels,
  creatorInfo,
  creatorOwners,
  creatorPlans,
  mediaFileCategories,
  mediaFiles,
  plans,
  users,
} from '../src/database/schema';
import {
  DEFAULT_CONTENT_APPEARANCE_LAYOUT,
  resolveLogoName,
  resolveLogoType,
  truncateContentAppearanceDescription,
} from 'src/utils/contentAppearance';
import { ROLE } from 'src/utils/constant';
import { hashPassword } from 'src/utils/passwordHash';
import {
  deterministicUuid,
  extractCloudflareVideoId,
  getUmbracoShowValue,
  inferContentCategoryId,
  isSkippedUmbracoProfile,
  loadCmsMemberEmailByProfileKey,
  loadProfileCategoryContext,
  parseDate,
  profileSeedKey,
  resolveProfileDefaultCategoryId,
  resolveUmbracoMediaUrl,
  resolveUmbracoShowThumbnails,
} from '../src/database/seed/umbracoSeed.helpers';

type JsonRecord = Record<string, unknown>;

const DEFAULT_RENT_DURATION_HOURS = 48;
const DEFAULT_COLLECTION_NAME = 'Shows';
const FALLBACK_PLAN_NAME = 'Creator Pro';

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
  '57': 'free',
  '58': 'paid',
  '59': 'password',
  '60': 'email_gated',
};

function seedUuid(scope: string, profileKey: string): string {
  return deterministicUuid(
    `umbraco-profile:${scope}:${profileSeedKey(profileKey)}`,
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
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'a')
      .replace(/['’‘`"“”]/g, '')
      .replace(/(^|[a-z0-9])-s(-|$)/gi, '$1s$2')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'content'
  );
}

function stripHtml(value: string | null): string | null {
  if (!value) return null;
  const text = value
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text || null;
}

function isEnabled(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
  }
  return false;
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (value === undefined || value === null || value === '') return [];
  return [String(value)];
}

function resolveMediaUrl(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return resolveUmbracoMediaUrl(value);
  if (typeof value === 'object' && value !== null) {
    return resolveMediaUrl((value as JsonRecord).src);
  }
  return null;
}

function parseInteger(value: unknown): number | null {
  const text = textOrNull(value);
  if (!text) return null;
  const parsed = Number.parseInt(text, 10);
  if (!Number.isFinite(parsed)) return null;
  if (parsed > 2_147_483_647 || parsed < -2_147_483_648) return null;
  return parsed;
}

function parseDecimal(value: unknown): string | null {
  const text = textOrNull(value);
  if (!text) return null;
  const parsed = Number.parseFloat(text);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : null;
}

function hasPositivePrice(value: unknown): boolean {
  const parsed = parseDecimal(value);
  return parsed != null && Number.parseFloat(parsed) > 0;
}

function normalizeStorageFileKey(value: string | null): string | null {
  if (!value) return null;
  let key = value.replace(/^\/+/, '').trim();
  if (!key) return null;
  if (/^media\//i.test(key)) {
    key = key.replace(/^media\//i, '');
  }
  return key || null;
}

function showValue(show: JsonRecord, key: string): unknown {
  return getUmbracoShowValue(show, key);
}

function inferContentTypeId(show: JsonRecord): string {
  const rawFile = textOrNull(showValue(show, 'rawFile')) ?? '';
  const lowerRawFile = rawFile.toLowerCase();
  const title = (
    textOrNull(showValue(show, 'title')) ??
    textOrNull(show.name) ??
    ''
  ).toLowerCase();

  if (
    lowerRawFile.endsWith('.epub') ||
    title.includes('e-pub') ||
    title.includes('epub')
  ) {
    return 'epub';
  }
  if (lowerRawFile.endsWith('.pdf')) return 'pdf';
  if (
    lowerRawFile.endsWith('.mp3') ||
    lowerRawFile.endsWith('.wav') ||
    lowerRawFile.endsWith('.m4a')
  ) {
    return 'audio';
  }

  const ids = toArray(showValue(show, 'type'));
  const mapped = ids[0] ? LEGACY_TYPE_IDS[ids[0]] : null;
  if (mapped) return mapped;

  if (textOrNull(showValue(show, 'webContentURL'))) return 'web';
  if (
    textOrNull(showValue(show, 'videoID')) ||
    textOrNull(showValue(show, 'videoDownloadURL'))
  ) {
    return 'video';
  }

  return 'video';
}

function resolveAccessType(
  show: JsonRecord,
): 'free' | 'paid' | 'password' | 'email_gated' {
  const ids = toArray(showValue(show, 'access'));
  const mapped = ids[0] ? LEGACY_ACCESS_IDS[ids[0]] : null;
  if (mapped) return mapped;

  if (
    hasPositivePrice(showValue(show, 'purchasePrice')) ||
    hasPositivePrice(showValue(show, 'rentalPrice'))
  ) {
    return 'paid';
  }

  if (textOrNull(showValue(show, 'code'))) return 'password';
  return 'free';
}

function resolveVisibility(
  show: JsonRecord,
): 'public' | 'hidden' | 'draft' | 'private' {
  if (isEnabled(showValue(show, 'hidden'))) return 'hidden';
  if (show.published && show.hasPublishedVersion) return 'public';
  return 'draft';
}

function resolveContentFields(show: JsonRecord, contentTypeId: string) {
  const videoDownloadUrl = textOrNull(showValue(show, 'videoDownloadURL'));
  const videoId =
    extractCloudflareVideoId(showValue(show, 'videoID')) ??
    extractCloudflareVideoId(videoDownloadUrl);
  const rawFile = textOrNull(showValue(show, 'rawFile'));
  const webContentUrl = textOrNull(showValue(show, 'webContentURL'));

  if (contentTypeId === 'web') {
    return { fileKey: null, contentUrl: webContentUrl, fileSize: null };
  }
  if (contentTypeId === 'video') {
    return {
      fileKey: videoId,
      contentUrl: null,
      fileSize: parseInteger(showValue(show, 'videoSize')),
    };
  }

  const fileKey = normalizeStorageFileKey(rawFile);
  const contentUrl = fileKey ? null : webContentUrl;
  return {
    fileKey,
    contentUrl,
    fileSize: parseInteger(showValue(show, 'videoSize')),
  };
}

function buildContentSlug(channelSlug: string, show: JsonRecord): string {
  const title = textOrNull(show.title) ?? textOrNull(show.name) ?? 'content';
  const urls = show.urls as string[] | undefined;
  const url = urls?.[0];
  const fromUrl = url ? url.split('/').filter(Boolean).pop() : null;
  const base = slugify(fromUrl ?? title);
  const key = String(show.key || '');
  const suffix = key.replace(/-/g, '').slice(0, 8);
  return truncate(`${channelSlug}-${base}-${suffix}`, 500);
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const text = textOrNull(value);
  if (!text) return [];
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function isHumanContentTitle(title: string): boolean {
  if (!title || title.length <= 1) return false;
  const normalized = title.trim();
  if (/^(untitled|item|folder)$/i.test(normalized)) return false;
  return true;
}

function findUmbracoUsersRoot(): string | null {
  const candidates = [
    process.env.UMBRACO_DATA_USERS_PATH?.trim(),
    resolve(process.cwd(), 'umbraco-data/users'),
    resolve(process.cwd(), '../../umbraco-data/users'),
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function readJsonFile<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function splitName(fullName: string): {
  firstName: string | null;
  lastName: string | null;
} {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: null, lastName: null };
  if (parts.length === 1) return { firstName: parts[0], lastName: null };
  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1],
  };
}

const KNOWN_TRASHED_PROFILE_KEYS = new Set([
  'lykkeneumann',
  'tomfrankrasmussen',
]);

function normalizeProfileKey(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function isTrashedProfile(
  profileKey: string,
  info?: JsonRecord | null,
): boolean {
  const norm = normalizeProfileKey(profileKey);
  if (KNOWN_TRASHED_PROFILE_KEYS.has(norm)) {
    return true;
  }
  if (!info) return false;
  if (info.trashed === true) return true;
  const pathVal = String(info.path || '');
  if (
    pathVal.includes(',-20,') ||
    pathVal.endsWith(',-20') ||
    pathVal.startsWith('-1,-20')
  ) {
    return true;
  }
  return false;
}

async function resolveDefaultPlanId(isDryRun: boolean): Promise<string> {
  try {
    const availablePlans = await db
      .select({ id: plans.id, name: plans.name })
      .from(plans)
      .where(eq(plans.isActive, true));

    const byName = new Map(
      availablePlans.map((p) => [p.name.toLowerCase(), p.id]),
    );
    const planId =
      byName.get(FALLBACK_PLAN_NAME.toLowerCase()) ?? availablePlans[0]?.id;

    if (!planId) {
      if (isDryRun) return 'dry-run-plan-id';
      throw new Error('No active subscription plans found in database.');
    }
    return planId;
  } catch (err: any) {
    if (isDryRun) {
      return 'dry-run-plan-id';
    }
    throw err;
  }
}

export async function syncNewUmbracoContent() {
  const isDryRun = process.argv.includes('--dry-run');
  const onlyNewFlag = process.argv.includes('--only-new');
  const creatorArg = process.argv
    .find((a) => a.startsWith('--creator='))
    ?.split('=')[1];

  console.log(`\n======================================================`);
  console.log(`  SAFE NON-DESTRUCTIVE UMBRACO CONTENT SYNC`);
  console.log(
    `  Mode: ${isDryRun ? 'DRY RUN (no database writes)' : 'LIVE INSERT/UPSERT'}`,
  );
  console.log(`======================================================\n`);

  const root = findUmbracoUsersRoot();
  if (!root) {
    console.error('umbraco-data/users root directory not found.');
    return;
  }

  const defaultPasswordHash = await hashPassword('123456');
  const defaultPlanId = await resolveDefaultPlanId(isDryRun);
  const cmsMemberEmails = loadCmsMemberEmailByProfileKey(root);

  const isDbConnectionError = (err: any) =>
    err?.code === 'ECONNREFUSED' ||
    err?.cause?.code === 'ECONNREFUSED' ||
    String(err?.message || '').includes('ECONNREFUSED') ||
    String(err?.cause?.message || '').includes('ECONNREFUSED');

  const findOne = async <T>(query: () => Promise<T[]>): Promise<T | null> => {
    try {
      const rows = await query();
      return rows[0] ?? null;
    } catch (err: any) {
      if (isDryRun && isDbConnectionError(err)) {
        return null;
      }
      throw err;
    }
  };

  const profileDirs = readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter(
      (name) => !creatorArg || name.toLowerCase() === creatorArg.toLowerCase(),
    );

  console.log(`Discovered ${profileDirs.length} creator directories on disk.`);

  let creatorsCreated = 0;
  let creatorsExisting = 0;
  let collectionsCreated = 0;
  let collectionsExisting = 0;
  let mediaFilesCreated = 0;
  let mediaFilesExisting = 0;
  let skippedItems = 0;

  for (const profileKey of profileDirs) {
    const profileInfoDir = join(root, profileKey, 'profile-info');
    const hasProfileInfo = existsSync(profileInfoDir);
    const info = hasProfileInfo
      ? readJsonFile<JsonRecord>(join(profileInfoDir, 'info.json'))
      : null;

    if (isTrashedProfile(profileKey, info)) {
      console.log(`[TRASHED PROFILE - SKIPPED] ${profileKey}`);
      continue;
    }

    if (isSkippedUmbracoProfile(profileKey)) {
      console.log(`[SKIP-LIST - SKIPPED] ${profileKey}`);
      continue;
    }

    const userId = seedUuid('user', profileKey);
    const existingUser = await findOne(() =>
      db
        .select({ id: users.id, role: users.role, email: users.email })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1),
    );

    const now = new Date();

    // 1. Ensure Creator exists if profile-info is present
    if (hasProfileInfo && !existingUser) {
      console.log(`\n[NEW CREATOR DETECTED] ${profileKey} (${userId})`);
      const general =
        readJsonFile<JsonRecord>(join(profileInfoDir, 'general.json')) ?? {};
      const layout =
        readJsonFile<JsonRecord>(join(profileInfoDir, 'layout.json')) ?? {};
      const seo =
        readJsonFile<JsonRecord>(join(profileInfoDir, 'seo.json')) ?? {};

      const name = truncate(
        textOrNull(layout.name) ??
          textOrNull(layout.logoText) ??
          profileKey.replace(/_/g, ' '),
        200,
      );
      const { firstName, lastName } = splitName(name);
      const supportEmailCandidate = textOrNull(general.supportEmail);
      const email =
        (supportEmailCandidate && supportEmailCandidate.includes('@')
          ? supportEmailCandidate
          : null) ??
        cmsMemberEmails.get(profileKey) ??
        `${slugify(profileKey)}@umbraco-profile.local`;

      const channelSlug = slugify(profileKey);
      const channelName = truncate(name, 255);
      const logoUrl = resolveMediaUrl(layout.logoImage);
      const coverImageUrl = resolveMediaUrl(layout.coverImage);
      const mobileCoverImageUrl = resolveMediaUrl(layout.coverImageMobile);
      const headline = textOrNull(layout.headline) ?? textOrNull(seo.metaTitle);
      const bio = stripHtml(
        textOrNull(layout.descriptionHtml) ?? textOrNull(layout.description),
      );
      const description =
        headline ?? textOrNull(seo.metaDescription) ?? truncate(bio ?? '', 500);

      const joinedAt =
        parseDate(info?.createDate) ?? parseDate(info?.publishDate) ?? now;

      if (!isDryRun) {
        await db.transaction(async (tx) => {
          await tx
            .insert(users)
            .values({
              id: userId,
              email,
              passwordHash: defaultPasswordHash,
              firstName,
              lastName,
              fullName: name,
              role: ROLE.CREATOR,
              status: 'active',
              avatarUrl: logoUrl,
              isEmailVerified: true,
              isActive: true,
              isDeleted: false,
              createdAt: joinedAt,
              updatedAt: now,
            })
            .onConflictDoNothing();

          await tx
            .insert(creatorInfo)
            .values({
              id: seedUuid('creator-info', profileKey),
              userId,
              companyName: name,
              phone: '',
              cvr: '',
              address: '',
              city: '',
              postalCode: '',
              exampleWorkLink: '',
              contentDescription: bio ?? headline ?? '',
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoNothing();

          await tx
            .insert(creatorChannels)
            .values({
              id: seedUuid('creator-channel', profileKey),
              creatorId: userId,
              name: channelName,
              slug: channelSlug,
              description: description || null,
              bio,
              coverImageUrl,
              logoUrl,
              themeColor: null,
              customDomain: null,
              isPublished: true,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoNothing();

          await tx
            .insert(creatorOwners)
            .values({
              id: seedUuid('creator-owner', profileKey),
              creatorId: userId,
              name,
              firstName,
              lastName,
              email,
              phone: null,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoNothing();

          await tx
            .insert(contentAppearance)
            .values({
              id: seedUuid('content-appearance', profileKey),
              userId,
              logoType: resolveLogoType(logoUrl),
              logoName: resolveLogoName(logoUrl, channelName),
              logoUrl,
              description: truncateContentAppearanceDescription(
                bio ?? description,
              ),
              layout: DEFAULT_CONTENT_APPEARANCE_LAYOUT,
              desktopCoverImageUrl: coverImageUrl,
              mobileCoverImageUrl,
              supportEmail: textOrNull(general.supportEmail) ?? '',
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoNothing();

          await tx
            .insert(creatorPlans)
            .values({
              id: seedUuid('creator-plan', profileKey),
              creatorId: userId,
              planId: defaultPlanId,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoNothing();
        });
      }
      creatorsCreated += 1;
      console.log(`  ✔ Creator created: ${name} (${email})`);
    } else if (existingUser) {
      creatorsExisting += 1;
    }

    // 2. Discover Collections & Content from content/ and shows/
    const channel = await findOne(() =>
      db
        .select({
          id: creatorChannels.id,
          slug: creatorChannels.slug,
          coverImageUrl: creatorChannels.coverImageUrl,
          logoUrl: creatorChannels.logoUrl,
        })
        .from(creatorChannels)
        .where(eq(creatorChannels.creatorId, userId))
        .limit(1),
    );

    const channelSlug = channel?.slug || slugify(profileKey);

    const collectionsToProcess: Array<{
      collectionKey: string;
      name: string;
      sortOrder: number;
      description: string | null;
      coverImageUrl: string | null;
      accessType: 'free' | 'paid' | 'password' | 'email_gated';
      buyPrice: string | null;
      rentPrice: string | null;
      visibility: 'public' | 'hidden' | 'draft' | 'private';
      isPublished: boolean;
      items: JsonRecord[];
    }> = [];

    // A. Read content/ folders
    const contentDir = join(root, profileKey, 'content');
    if (existsSync(contentDir)) {
      const folderEntries = readdirSync(contentDir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name));

      for (const [index, entry] of folderEntries.entries()) {
        const folderPath = join(contentDir, entry.name);
        const items =
          readJsonFile<JsonRecord[]>(join(folderPath, 'items.json')) || [];
        if (!items.length) continue;

        const indexJson = readJsonFile<JsonRecord>(
          join(folderPath, 'index.json'),
        );
        const parent = (indexJson?.parent as JsonRecord | undefined) ?? null;
        const parentFields = (parent?.fields as JsonRecord | undefined) ?? {};

        const collectionName =
          textOrNull(indexJson?.collectionName) ||
          textOrNull(parent?.name) ||
          entry.name.replace(/_/g, ' ');
        const parentKey = textOrNull(parent?.key)?.toLowerCase();
        const collectionKey = parentKey || slugify(entry.name) || entry.name;
        if (
          collectionsToProcess.some((c) => c.collectionKey === collectionKey)
        ) {
          continue;
        }

        const accessType = (function () {
          const ids = toArray(parentFields.access);
          const mapped = ids[0] ? LEGACY_ACCESS_IDS[ids[0]] : null;
          if (mapped) return mapped;
          if (
            hasPositivePrice(parentFields.purchasePrice) ||
            hasPositivePrice(parentFields.rentalPrice)
          ) {
            return 'paid';
          }
          if (textOrNull(parentFields.code)) return 'password';
          return 'free';
        })();

        const published =
          parent?.published === true && parent?.hasPublishedVersion !== false;
        const hidden = isEnabled(parentFields.hidden);

        collectionsToProcess.push({
          collectionKey,
          name: collectionName,
          sortOrder:
            parseInteger(parentFields.orderID) ??
            parseInteger(parent?.sortOrder) ??
            index,
          description: stripHtml(
            textOrNull(parentFields.description) ??
              textOrNull(parentFields.headline),
          ),
          coverImageUrl: resolveMediaUrl(parentFields.coverImage),
          accessType,
          buyPrice: parseDecimal(parentFields.purchasePrice),
          rentPrice: parseDecimal(parentFields.rentalPrice),
          visibility: hidden ? 'hidden' : published ? 'public' : 'draft',
          isPublished: !hidden && published,
          items,
        });
      }
    }

    // B. Read shows/ folder
    const showsDir = join(root, profileKey, 'shows');
    if (existsSync(showsDir)) {
      const showItems =
        readJsonFile<JsonRecord[]>(join(showsDir, 'items.json')) ||
        readJsonFile<JsonRecord[]>(join(showsDir, 'shows.json')) ||
        [];

      if (showItems.length) {
        collectionsToProcess.push({
          collectionKey: 'default-shows',
          name: 'Shows',
          sortOrder: 0,
          description: null,
          coverImageUrl: null,
          accessType: 'free',
          buyPrice: null,
          rentPrice: null,
          visibility: 'public',
          isPublished: true,
          items: showItems,
        });
      }
    }

    if (!collectionsToProcess.length) continue;

    // 3. Process Collections & Contents
    const profileContextText = loadProfileCategoryContext(profileKey, root);
    const allItems = collectionsToProcess.flatMap((c) => c.items);
    const profileDefaultCategoryId = resolveProfileDefaultCategoryId(
      profileKey,
      profileContextText,
      allItems.map((s) => ({
        tags: parseTags(showValue(s, 'tags')),
        title: textOrNull(showValue(s, 'title')) ?? textOrNull(s.name),
        description: stripHtml(
          textOrNull(showValue(s, 'expandedDescription')) ??
            textOrNull(showValue(s, 'description')),
        ),
        contentTypeId: inferContentTypeId(s),
      })),
    );

    for (const coll of collectionsToProcess) {
      const collectionId = showSeedUuid(
        'collection',
        profileKey,
        coll.collectionKey,
      );
      const existingCollection = await findOne(() =>
        db
          .select({ id: collections.id })
          .from(collections)
          .where(eq(collections.id, collectionId))
          .limit(1),
      );

      if (!existingCollection) {
        if (!isDryRun) {
          const collectionSlug = truncate(
            `${channelSlug}-${slugify(coll.name)}`,
            255,
          );
          await db
            .insert(collections)
            .values({
              id: collectionId,
              creatorId: userId,
              name: truncate(coll.name, 500),
              slug: collectionSlug,
              coverImageUrl: coll.coverImageUrl,
              description: coll.description,
              visibility: coll.visibility,
              accessType: coll.accessType,
              buyPrice: coll.buyPrice,
              rentPrice: coll.rentPrice,
              rentDuration:
                coll.accessType === 'paid' && hasPositivePrice(coll.rentPrice)
                  ? String(DEFAULT_RENT_DURATION_HOURS)
                  : null,
              sortOrder: coll.sortOrder,
              passwordHash: null,
              isPublished: coll.isPublished,
              publishedAt: coll.isPublished ? now : null,
              createdAt: now,
              updatedAt: now,
            })
            .onConflictDoNothing();
        }
        collectionsCreated += 1;
        console.log(
          `  + [NEW COLLECTION] "${coll.name}" (Creator: ${profileKey})`,
        );
      } else {
        collectionsExisting += 1;
      }

      // Process items inside collection
      const processedItemKeys = new Set<string>();
      for (const item of coll.items) {
        const itemKey = String(item.key || '').toLowerCase();
        if (!itemKey || processedItemKeys.has(itemKey)) {
          skippedItems += 1;
          continue;
        }
        processedItemKeys.add(itemKey);

        const mediaFileId = showSeedUuid('media', profileKey, itemKey);
        const existingMedia = await findOne(() =>
          db
            .select({ id: mediaFiles.id })
            .from(mediaFiles)
            .where(eq(mediaFiles.id, mediaFileId))
            .limit(1),
        );

        if (existingMedia) {
          mediaFilesExisting += 1;
          continue;
        }

        const title = truncate(
          textOrNull(showValue(item, 'title')) ??
            textOrNull(item.name) ??
            'Untitled',
          500,
        );
        if (!isHumanContentTitle(title)) {
          skippedItems += 1;
          continue;
        }

        const contentTypeId = inferContentTypeId(item);
        const accessType = resolveAccessType(item);
        const visibility = resolveVisibility(item);
        const contentFields = resolveContentFields(item, contentTypeId);
        const description =
          stripHtml(
            textOrNull(showValue(item, 'expandedDescription')) ??
              textOrNull(showValue(item, 'description')),
          ) ?? '';
        const slug = buildContentSlug(channelSlug, { ...item, key: itemKey });
        const sortOrder =
          parseInteger(showValue(item, 'orderID')) ??
          parseInteger(item.sortOrder) ??
          0;
        const publishedYear = parseInteger(showValue(item, 'year'));
        const duration = parseInteger(showValue(item, 'length'));
        const buyPrice = parseDecimal(showValue(item, 'purchasePrice'));
        const rentPrice = parseDecimal(showValue(item, 'rentalPrice'));
        const { thumbnailUrl, thumbnailLandscapeUrl } =
          resolveUmbracoShowThumbnails(item, title, {
            creatorCoverImageUrl: channel?.coverImageUrl || null,
            creatorLogoUrl: channel?.logoUrl || null,
          });
        const trailerRaw =
          textOrNull(showValue(item, 'trailer')) ?? textOrNull(item.trailer);
        const trailerUrl = trailerRaw
          ? /^https?:\/\//i.test(trailerRaw)
            ? trailerRaw.trim()
            : resolveMediaUrl(trailerRaw)
          : null;
        const accessCode = textOrNull(showValue(item, 'code'));
        const passwordHash = accessCode
          ? await hashPassword(accessCode)
          : accessType === 'password'
            ? defaultPasswordHash
            : null;
        const isPublished = visibility === 'public';
        const publishedAt = isPublished ? now : null;

        const categoryId = inferContentCategoryId({
          profileKey,
          profileContextText,
          profileDefaultCategoryId,
          tags: parseTags(showValue(item, 'tags')),
          title,
          description: description || null,
          contentTypeId,
        });

        if (!isDryRun) {
          await db.transaction(async (tx) => {
            await tx
              .insert(mediaFiles)
              .values({
                id: mediaFileId,
                creatorId: userId,
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
                production_company: textOrNull(showValue(item, 'production')),
                manufacturerLink:
                  resolveMediaUrl(showValue(item, 'productionLink')) ??
                  textOrNull(showValue(item, 'productionLink')),
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
                  resolveMediaUrl(showValue(item, 'productLink')) ??
                  textOrNull(showValue(item, 'productLink')),
                passwordHash,
                isDownloadable: !isEnabled(showValue(item, 'hideDownload')),
                maxDownloadCount: null,
                sortOrder,
                isPublished,
                publishedAt,
                createdAt: now,
                updatedAt: now,
              })
              .onConflictDoNothing();

            await tx
              .insert(collectionItems)
              .values({
                id: showSeedUuid('collection-item', profileKey, itemKey),
                collectionId,
                mediaFileId,
                sortOrder,
                createdAt: now,
                updatedAt: now,
              })
              .onConflictDoNothing();

            if (categoryId) {
              await tx
                .insert(mediaFileCategories)
                .values({
                  id: showSeedUuid('media-category', profileKey, itemKey),
                  mediaFileId,
                  categoryId,
                  createdAt: now,
                  updatedAt: now,
                })
                .onConflictDoNothing();
            }
          });
        }

        mediaFilesCreated += 1;
        console.log(
          `    ✔ [NEW CONTENT ADDED] "${title}" (${contentTypeId}, ${accessType}) -> Collection: "${coll.name}"`,
        );
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`  SYNC COMPLETED SUMMARY`);
  console.log(`======================================================`);
  console.log(
    `  Creators:    ${creatorsCreated} new added | ${creatorsExisting} existing preserved`,
  );
  console.log(
    `  Collections: ${collectionsCreated} new added | ${collectionsExisting} existing preserved`,
  );
  console.log(
    `  Contents:    ${mediaFilesCreated} new added | ${mediaFilesExisting} existing preserved`,
  );
  console.log(`  Deletions:   0 (Zero records deleted or modified)`);
  console.log(`======================================================\n`);
}

syncNewUmbracoContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal sync error:', err);
    process.exit(1);
  });
