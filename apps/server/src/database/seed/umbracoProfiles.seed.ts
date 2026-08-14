import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { eq, sql } from 'drizzle-orm';

import {
  DEFAULT_CONTENT_APPEARANCE_LAYOUT,
  resolveLogoName,
  resolveLogoType,
  truncateContentAppearanceDescription,
} from 'src/utils/contentAppearance';
import { ROLE, SUBSCRIPTION_PLAN } from 'src/utils/constant';
import { hashPassword } from 'src/utils/passwordHash';

import { db } from '../db';
import {
  auditLogs,
  contentAppearance,
  creatorChannels,
  creatorInfo,
  creatorPlans,
  plans,
  users,
} from '../schema';
import {
  loadCmsMemberEmailByProfileKey,
  loadUmbracoProfileKeys,
  profileSeedKey,
  resolveCreatorEmailFromUmbraco,
  resolveUmbracoMediaUrl,
} from './umbracoSeed.helpers';

const PROFILE_FILES = [
  'access-and-price.json',
  'general.json',
  'info.json',
  'layout.json',
  'notifications.json',
  'seo.json',
  'sitemap.json',
  'subscription.json',
] as const;

const FALLBACK_PLAN_NAME = SUBSCRIPTION_PLAN.PRO;

const LEGACY_PLAN_DOCUMENT_NAMES: Record<string, string> = {
  'umb://document/5ba7f17c7cf64beea5db1176fd45d365':
    SUBSCRIPTION_PLAN.TRY_KIIBEE,
  'umb://document/6ae38a0b56144a55ac017545e006b9a4': SUBSCRIPTION_PLAN.PRO,
  'umb://document/e46ced3f3b544a3ead6838c69a79ac8f': SUBSCRIPTION_PLAN.PRO,
};

type JsonRecord = Record<string, any>;
type ProfileFileName = (typeof PROFILE_FILES)[number];
type ProfileFiles = Partial<Record<ProfileFileName, JsonRecord>>;

type LoadedProfile = {
  profileKey: string;
  files: ProfileFiles;
  preferredChannelSlug?: string;
  source?: 'profile-info';
};

type MappedProfile = {
  profileKey: string;
  userId: string;
  creatorInfoId: string;
  creatorChannelId: string;
  contentAppearanceId: string;
  creatorPlanId: string;
  auditLogId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  channelName: string;
  channelSlug: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  mobileCoverImageUrl: string | null;
  headline: string | null;
  description: string | null;
  bio: string | null;
  supportEmail: string | null;
  notificationEmails: string[];
  legacyOwner: string | null;
  legacySubscription: string | null;
  desiredPlanName: string;
  rawFiles: ProfileFiles;
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

function seedUuid(scope: string, profileKey: string): string {
  return deterministicUuid(
    `umbraco-profile:${scope}:${profileSeedKey(profileKey)}`,
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

function slugify(value: string): string {
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

function splitName(fullName: string): {
  firstName: string | null;
  lastName: string | null;
} {
  const parts = fullName.split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return { firstName: null, lastName: null };
  }

  return {
    firstName: truncate(parts[0], 100),
    lastName: parts.length > 1 ? truncate(parts.slice(1).join(' '), 100) : null,
  };
}

function imageUrl(value: unknown): string | null {
  // Umbraco may return a plain "/media/..." string or a crop object with src.
  if (typeof value === 'string') {
    return resolveUmbracoMediaUrl(value);
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  return resolveUmbracoMediaUrl((value as JsonRecord).src);
}

function ownerName(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return textOrNull(value);
  }

  return textOrNull((value as JsonRecord).name);
}

function emailsFrom(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(textOrNull)
    .filter((email): email is string => Boolean(email))
    .map((email) => email.toLowerCase());
}

function subscriptionKey(subscription: unknown): string | null {
  if (!subscription || typeof subscription !== 'object') {
    return textOrNull(subscription);
  }

  const record = subscription as JsonRecord;
  return (
    textOrNull(record.path) ?? textOrNull(record.udi) ?? textOrNull(record.name)
  );
}

function resolveDesiredPlanName(subscription: unknown): string {
  const key = subscriptionKey(subscription);

  if (!key) {
    return FALLBACK_PLAN_NAME;
  }

  const mappedDocumentName = LEGACY_PLAN_DOCUMENT_NAMES[key];
  if (mappedDocumentName) {
    return mappedDocumentName;
  }

  const normalized = slugify(key);
  if (
    normalized.includes('try-kiibee') ||
    normalized.includes('proev-kiibee') ||
    normalized.includes('prov-kiibee') ||
    normalized.includes('prv-kiibee') ||
    normalized === 'proev-kiibee' ||
    normalized.endsWith('/proev-kiibee')
  ) {
    return SUBSCRIPTION_PLAN.TRY_KIIBEE;
  }

  if (normalized.includes('start')) {
    return SUBSCRIPTION_PLAN.START_UP;
  }

  if (normalized.includes('pro')) {
    return SUBSCRIPTION_PLAN.PRO;
  }

  return FALLBACK_PLAN_NAME;
}

function deriveNameFromProfileKey(profileKey: string): string {
  return profileKey.replace(/_/g, ' ').trim();
}

function profileName(profile: LoadedProfile): string {
  return (
    textOrNull(profile.files['general.json']?.name) ??
    textOrNull(profile.files['layout.json']?.name) ??
    textOrNull(profile.files['info.json']?.name) ??
    deriveNameFromProfileKey(profile.profileKey)
  );
}

function readJsonFile(filePath: string): JsonRecord {
  return JSON.parse(readFileSync(filePath, 'utf8')) as JsonRecord;
}

function findUmbracoProfileRoot(): string | null {
  const envRoot = process.env.UMBRACO_DATA_USERS_PATH?.trim();
  const candidates = [
    ...(envRoot ? [resolve(envRoot)] : []),
    resolve(process.cwd(), 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', 'umbraco-data', 'users'),
    resolve(process.cwd(), '..', '..', 'umbraco-data', 'users'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function resolveCreatorEmail(
  profile: LoadedProfile,
  usedEmails: Set<string>,
  cmsMemberEmailByProfileKey: Map<string, string>,
): string | null {
  const general = profile.files['general.json'] ?? {};
  const notifications = profile.files['notifications.json'] ?? {};

  return resolveCreatorEmailFromUmbraco(
    profile.profileKey,
    general.supportEmail,
    notifications.emails,
    usedEmails,
    cmsMemberEmailByProfileKey,
  );
}

function loadProfiles(root: string): LoadedProfile[] {
  return loadUmbracoProfileKeys(root).map((profileKey) => {
    const profileInfoRoot = join(root, profileKey, 'profile-info');
    const files: ProfileFiles = {};

    for (const fileName of PROFILE_FILES) {
      const filePath = join(profileInfoRoot, fileName);
      if (existsSync(filePath)) {
        files[fileName] = readJsonFile(filePath);
      }
    }

    return {
      profileKey,
      files,
      source: 'profile-info' as const,
    };
  });
}

function buildUniqueChannelSlugs(
  profiles: LoadedProfile[],
): Map<string, string> {
  const baseSlugCounts = new Map<string, number>();
  const baseSlugs = new Map<string, string>();

  for (const profile of profiles) {
    const baseSlug = truncate(
      profile.preferredChannelSlug ?? slugify(profileName(profile)),
      220,
    );
    baseSlugs.set(profile.profileKey, baseSlug);
    baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) ?? 0) + 1);
  }

  const used = new Set<string>();
  const slugs = new Map<string, string>();

  for (const profile of profiles) {
    const baseSlug = baseSlugs.get(profile.profileKey) ?? 'umbraco-profile';
    const needsSuffix = (baseSlugCounts.get(baseSlug) ?? 0) > 1;
    const suffix = createHash('sha256')
      .update(profile.profileKey)
      .digest('hex')
      .slice(0, 8);
    let slug = needsSuffix
      ? truncate(`${baseSlug}-${suffix}`, 255)
      : truncate(baseSlug, 255);

    while (used.has(slug)) {
      slug = truncate(`${baseSlug}-${suffix}-${used.size}`, 255);
    }

    used.add(slug);
    slugs.set(profile.profileKey, slug);
  }

  return slugs;
}

function mapProfile(
  profile: LoadedProfile,
  channelSlug: string,
  email: string,
): MappedProfile {
  const general = profile.files['general.json'] ?? {};
  const layout = profile.files['layout.json'] ?? {};
  const notifications = profile.files['notifications.json'] ?? {};
  const seo = profile.files['seo.json'] ?? {};
  const subscription = profile.files['subscription.json'] ?? {};
  const name = truncate(profileName(profile), 200);
  const { firstName, lastName } = splitName(name);
  // Prefer real media src when present — Umbraco often keeps the file even
  // when useCoverImage / useLogoImage is "0". Channel cover and mobile cover
  // are separate assets (wide banner vs square card image).
  const logoUrl = imageUrl(layout.logoImage);
  const coverImageUrl = imageUrl(layout.coverImage);
  const mobileCoverImageUrl = imageUrl(layout.coverImageMobile);
  const descriptionHtml =
    textOrNull(layout.descriptionHtml) ?? textOrNull(layout.description);
  const bio = stripHtml(descriptionHtml);
  const headline = textOrNull(layout.headline) ?? textOrNull(seo.metaTitle);
  const description =
    headline ?? textOrNull(seo.metaDescription) ?? truncate(bio ?? '', 500);
  const channelName = truncate(name, 255);
  const desiredPlanName = resolveDesiredPlanName(subscription.subscription);

  return {
    profileKey: profile.profileKey,
    userId: seedUuid('user', profile.profileKey),
    creatorInfoId: seedUuid('creator-info', profile.profileKey),
    creatorChannelId: seedUuid('creator-channel', profile.profileKey),
    contentAppearanceId: seedUuid('content-appearance', profile.profileKey),
    creatorPlanId: seedUuid('creator-plan', profile.profileKey),
    auditLogId: seedUuid('audit-log', profile.profileKey),
    email,
    firstName,
    lastName,
    fullName: name,
    channelName,
    channelSlug,
    logoUrl,
    coverImageUrl,
    mobileCoverImageUrl,
    headline,
    description: description || null,
    bio,
    supportEmail: textOrNull(general.supportEmail),
    notificationEmails: emailsFrom(notifications.emails),
    legacyOwner: ownerName(general.owner),
    legacySubscription: subscriptionKey(subscription.subscription),
    desiredPlanName,
    rawFiles: profile.files,
  };
}

async function resolvePlanId(desiredPlanName: string): Promise<string> {
  const availablePlans = await db
    .select({ id: plans.id, name: plans.name })
    .from(plans)
    .where(eq(plans.isActive, true));

  const byName = new Map(
    availablePlans.map((plan) => [plan.name.toLowerCase(), plan.id]),
  );

  const planId =
    byName.get(desiredPlanName.toLowerCase()) ??
    byName.get(FALLBACK_PLAN_NAME.toLowerCase()) ??
    availablePlans[0]?.id;

  if (!planId) {
    throw new Error(
      'No active subscription plans found. Run seedPlans before seedUmbracoProfiles.',
    );
  }

  return planId;
}

export const seedUmbracoProfiles = async () => {
  const root = findUmbracoProfileRoot();
  if (!root) {
    console.log(
      'Umbraco profile seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const profiles = loadProfiles(root);
  if (!profiles.length) {
    console.log(`Umbraco profile seed skipped (no profiles found in ${root})`);
    return;
  }
  const channelSlugs = buildUniqueChannelSlugs(profiles);
  const creatorPasswordHash =
    process.env.CREATOR_SEED_PASSWORD_HASH?.trim() ||
    (await hashPassword('123456'));
  const usedEmails = new Set<string>(['admin@gmail.com']);
  const cmsMemberEmailByProfileKey = loadCmsMemberEmailByProfileKey(root);

  let processed = 0;
  let skippedNoEmail = 0;

  for (const profile of profiles) {
    const email = resolveCreatorEmail(
      profile,
      usedEmails,
      cmsMemberEmailByProfileKey,
    );
    if (!email) {
      skippedNoEmail += 1;
      console.warn(
        `Umbraco profile seed skipped (${profile.profileKey}): no Umbraco creator email found`,
      );
      continue;
    }

    const mapped = mapProfile(
      profile,
      channelSlugs.get(profile.profileKey) ?? slugify(profile.profileKey),
      email,
    );
    const planId = await resolvePlanId(mapped.desiredPlanName);
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .insert(users)
        .values({
          id: mapped.userId,
          email: mapped.email,
          passwordHash: creatorPasswordHash,
          firstName: mapped.firstName,
          lastName: mapped.lastName,
          fullName: mapped.fullName,
          role: ROLE.CREATOR,
          status: 'active',
          avatarUrl: mapped.logoUrl,
          isEmailVerified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: mapped.email,
            firstName: mapped.firstName,
            lastName: mapped.lastName,
            fullName: mapped.fullName,
            role: ROLE.CREATOR,
            status: 'active',
            avatarUrl: mapped.logoUrl,
            isEmailVerified: true,
            isActive: true,
            passwordHash: sql`COALESCE(${users.passwordHash}, ${creatorPasswordHash})`,
            updatedAt: now,
          },
        });

      await tx
        .insert(creatorInfo)
        .values({
          id: mapped.creatorInfoId,
          userId: mapped.userId,
          companyName: mapped.fullName,
          phone: '',
          cvr: '',
          address: '',
          city: '',
          postalCode: '',
          exampleWorkLink: mapped.supportEmail
            ? `mailto:${mapped.supportEmail}`
            : '',
          contentDescription: mapped.bio ?? mapped.headline ?? '',
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorInfo.userId,
          set: {
            companyName: mapped.fullName,
            exampleWorkLink: mapped.supportEmail
              ? `mailto:${mapped.supportEmail}`
              : '',
            contentDescription: mapped.bio ?? mapped.headline ?? '',
            updatedAt: now,
          },
        });

      await tx
        .insert(creatorChannels)
        .values({
          id: mapped.creatorChannelId,
          creatorId: mapped.userId,
          name: mapped.channelName,
          slug: mapped.channelSlug,
          description: mapped.description,
          bio: mapped.bio,
          coverImageUrl: mapped.coverImageUrl,
          logoUrl: mapped.logoUrl,
          themeColor: null,
          customDomain: null,
          isPublished: true,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorChannels.creatorId,
          set: {
            name: mapped.channelName,
            slug: mapped.channelSlug,
            description: mapped.description,
            bio: mapped.bio,
            coverImageUrl: mapped.coverImageUrl,
            logoUrl: mapped.logoUrl,
            isPublished: true,
            updatedAt: now,
          },
        });

      await tx
        .insert(contentAppearance)
        .values({
          id: mapped.contentAppearanceId,
          userId: mapped.userId,
          logoType: resolveLogoType(mapped.logoUrl),
          logoName: resolveLogoName(mapped.logoUrl, mapped.channelName),
          logoUrl: mapped.logoUrl,
          description: truncateContentAppearanceDescription(
            mapped.bio ?? mapped.description ?? mapped.headline ?? '',
          ),
          layout: DEFAULT_CONTENT_APPEARANCE_LAYOUT,
          desktopCoverImageUrl: mapped.coverImageUrl,
          mobileCoverImageUrl: mapped.mobileCoverImageUrl,
          supportEmail: mapped.supportEmail ?? '',
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: contentAppearance.userId,
          set: {
            mobileCoverImageUrl:
              mapped.mobileCoverImageUrl ??
              sql`${contentAppearance.mobileCoverImageUrl}`,
            updatedAt: now,
          },
        });

      await tx
        .insert(creatorPlans)
        .values({
          id: mapped.creatorPlanId,
          creatorId: mapped.userId,
          planId,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorPlans.id,
          set: {
            planId,
            updatedAt: now,
          },
        });

      await tx
        .insert(auditLogs)
        .values({
          id: mapped.auditLogId,
          userId: mapped.userId,
          action: 'umbraco_profile_seed',
          entityType: 'creator_profile',
          entityId: mapped.creatorChannelId,
          details: {
            source: 'umbraco-data/profile-info',
            profileKey: mapped.profileKey,
            mapped: {
              email: mapped.email,
              channelSlug: mapped.channelSlug,
              supportEmail: mapped.supportEmail,
              notificationEmails: mapped.notificationEmails,
              legacyOwner: mapped.legacyOwner,
              legacySubscription: mapped.legacySubscription,
              desiredPlanName: mapped.desiredPlanName,
            },
            rawFiles: mapped.rawFiles,
          },
          createdAt: now,
        })
        .onConflictDoNothing({ target: auditLogs.id });
    });

    processed += 1;
  }

  console.log(
    `Umbraco profile seed completed (${processed} profiles processed, ${skippedNoEmail} skipped without real email, from ${root})`,
  );
};
