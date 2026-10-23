import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and, gt, ilike, isNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collectionItems,
  collections,
  mediaFiles,
  mediaFileCategories,
  contentCategories,
  mediaFileTags,
  tags,
  userContentAccess,
  contentAccessRequests,
  users,
  creatorChannels,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { insertPageVisitService } from 'src/modules/creator-overview/services/insertPageVisit.service';
import { ACCESS_TYPE, ACCRESS_TYPES, STATUS, Time } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { cleanCollectionSlug, contentTitleUrlSlug } from '../content.helper';

const normalizeAlpha = (val?: string | null): string => {
  if (!val) return '';
  return val.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

function findBestContentMatch<
  T extends {
    id: string;
    title: string;
    slug: string;
    creatorId?: string | null;
  },
>(items: T[], contentId: string, creatorSlug?: string | null): T | null {
  if (!items || items.length === 0) return null;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      contentId,
    );
  if (isUuid) {
    const exactId = items.find((i) => i.id === contentId);
    if (exactId) return exactId;
  }

  const reqSlug = contentTitleUrlSlug(contentId);
  const reqAlpha = normalizeAlpha(contentId);

  // 1. Exact raw or normalized slug
  const exactSlug = items.find((i) => {
    if (i.slug === contentId || i.slug === reqSlug) return true;
    const sNorm = contentTitleUrlSlug(i.slug);
    if (sNorm === contentId || sNorm === reqSlug) return true;
    if (reqAlpha && normalizeAlpha(i.slug) === reqAlpha) return true;
    if (creatorSlug && cleanCollectionSlug(i.slug, creatorSlug) === reqSlug) {
      return true;
    }
    return false;
  });
  if (exactSlug) return exactSlug;

  // 2. Exact raw or normalized title
  const exactTitle = items.find((i) => {
    if (i.title === contentId) return true;
    const tNorm = contentTitleUrlSlug(i.title);
    if (tNorm === contentId || tNorm === reqSlug) return true;
    if (reqAlpha && normalizeAlpha(i.title) === reqAlpha) return true;
    return false;
  });
  if (exactTitle) return exactTitle;

  // 3. Prefix match on normalized slug or title (e.g. contentId is "mens-room-3" and title is "Men's Room 3 - Voksenfaelden")
  const prefixMatch = items.find((i) => {
    const sNorm = contentTitleUrlSlug(i.slug);
    const tNorm = contentTitleUrlSlug(i.title);
    if (
      reqSlug &&
      (sNorm.startsWith(`${reqSlug}-`) || tNorm.startsWith(`${reqSlug}-`))
    ) {
      return true;
    }
    const sAlpha = normalizeAlpha(i.slug);
    const tAlpha = normalizeAlpha(i.title);
    if (
      reqAlpha &&
      (sAlpha.startsWith(reqAlpha) || tAlpha.startsWith(reqAlpha))
    ) {
      return true;
    }
    return false;
  });
  if (prefixMatch) return prefixMatch;

  // 4. Suffix match (e.g. "fbi-dk-mens-room-3" or "creator-mens-room-3")
  const suffixMatch = items.find((i) => {
    const sNorm = contentTitleUrlSlug(i.slug);
    if (reqSlug && (sNorm.endsWith(`-${reqSlug}`) || sNorm.endsWith(reqSlug))) {
      return true;
    }
    const sAlpha = normalizeAlpha(i.slug);
    if (reqAlpha && sAlpha.endsWith(reqAlpha)) {
      return true;
    }
    return false;
  });
  if (suffixMatch) return suffixMatch;

  // 5. Infix / contains match
  const containsMatch = items.find((i) => {
    const sNorm = contentTitleUrlSlug(i.slug);
    const tNorm = contentTitleUrlSlug(i.title);
    if (reqSlug && (sNorm.includes(reqSlug) || tNorm.includes(reqSlug))) {
      return true;
    }
    const sAlpha = normalizeAlpha(i.slug);
    const tAlpha = normalizeAlpha(i.title);
    if (reqAlpha && (sAlpha.includes(reqAlpha) || tAlpha.includes(reqAlpha))) {
      return true;
    }
    if (i.slug.includes(contentId) || contentId.includes(i.slug)) {
      return true;
    }
    return false;
  });
  if (containsMatch) return containsMatch;

  return null;
}

export const getSingleContentService = async (
  contentId: string,
  userId: string,
  creatorSlug?: string,
  collectionSlug?: string,
) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const now = new Date();

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        contentId,
      );

    const cleanCreatorSlug = creatorSlug
      ? creatorSlug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      : null;

    let creatorId: string | null = null;
    if (creatorSlug) {
      const [foundCreator] = await db
        .select({ id: users.id })
        .from(users)
        .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
        .where(
          or(
            eq(users.id, creatorSlug),
            eq(creatorChannels.slug, creatorSlug),
            sql`LOWER(REGEXP_REPLACE(coalesce(${creatorChannels.slug}, ''), '[^a-zA-Z0-9]', '', 'g')) = ${cleanCreatorSlug}`,
            sql`LOWER(REGEXP_REPLACE(coalesce(${users.fullName}, ''), '[^a-zA-Z0-9]', '', 'g')) = ${cleanCreatorSlug}`,
            sql`LOWER(REGEXP_REPLACE(coalesce(${users.firstName}, ''), '[^a-zA-Z0-9]', '', 'g')) = ${cleanCreatorSlug}`,
          ),
        )
        .limit(1);

      if (foundCreator) {
        creatorId = foundCreator.id;
      }
    }

    let targetCollection: {
      id: string;
      name: string;
      slug: string;
      creatorId?: string | null;
      accessType: string;
      buyPrice: string | null;
      rentPrice: string | null;
    } | null = null;

    if (collectionSlug && collectionSlug.toLowerCase() !== 'shows') {
      const cleanColReq = cleanCollectionSlug(collectionSlug, creatorSlug);
      const cleanColAlpha = normalizeAlpha(collectionSlug);

      const isColMatch = (c: { id: string; name: string; slug: string }) => {
        if (c.id === collectionSlug || c.slug === collectionSlug) return true;
        if (contentTitleUrlSlug(c.name) === collectionSlug) return true;
        if (contentTitleUrlSlug(c.slug) === collectionSlug) return true;
        if (cleanCollectionSlug(c.slug, creatorSlug) === collectionSlug)
          return true;
        if (cleanCollectionSlug(c.name, creatorSlug) === collectionSlug)
          return true;
        if (cleanCollectionSlug(c.slug, creatorSlug) === cleanColReq)
          return true;
        if (cleanCollectionSlug(c.name, creatorSlug) === cleanColReq)
          return true;
        if (
          cleanColAlpha &&
          (normalizeAlpha(c.slug) === cleanColAlpha ||
            normalizeAlpha(c.name) === cleanColAlpha)
        ) {
          return true;
        }
        return false;
      };

      const candidateCols = await db
        .select({
          id: collections.id,
          name: collections.name,
          slug: collections.slug,
          creatorId: collections.creatorId,
          accessType: collections.accessType,
          buyPrice: collections.buyPrice,
          rentPrice: collections.rentPrice,
        })
        .from(collections)
        .where(
          and(
            eq(collections.isDeleted, false),
            creatorId ? eq(collections.creatorId, creatorId) : sql`true`,
          ),
        );

      targetCollection = candidateCols.find(isColMatch) ?? null;

      if (!targetCollection) {
        const anyCols = await db
          .select({
            id: collections.id,
            name: collections.name,
            slug: collections.slug,
            creatorId: collections.creatorId,
            accessType: collections.accessType,
            buyPrice: collections.buyPrice,
            rentPrice: collections.rentPrice,
          })
          .from(collections)
          .where(eq(collections.isDeleted, false));

        targetCollection = anyCols.find(isColMatch) ?? null;
      }
    }

    let content: any = null;

    if (targetCollection) {
      const itemsInCollection = await db
        .select({
          mediaFile: mediaFiles,
        })
        .from(collectionItems)
        .innerJoin(mediaFiles, eq(mediaFiles.id, collectionItems.mediaFileId))
        .where(
          and(
            eq(collectionItems.collectionId, targetCollection.id),
            eq(mediaFiles.isDeleted, false),
          ),
        );

      content = findBestContentMatch(
        itemsInCollection.map((i) => i.mediaFile),
        contentId,
        creatorSlug,
      );
    }

    if (!content && creatorId) {
      const creatorFiles = await db
        .select()
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.creatorId, creatorId),
            eq(mediaFiles.isDeleted, false),
          ),
        );

      content = findBestContentMatch(creatorFiles, contentId, creatorSlug);
    }

    if (!content) {
      const cleanReqAlpha = normalizeAlpha(contentId);
      const cleanReqSlug = contentTitleUrlSlug(contentId);
      const titleWords = contentId
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const titleWordSearch =
        titleWords.length > 0 ? `%${titleWords.join('%')}%` : `%${contentId}%`;

      const candidateFiles = await db
        .select()
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.isDeleted, false),
            or(
              isUuid ? eq(mediaFiles.id, contentId) : sql`false`,
              eq(mediaFiles.slug, contentId),
              eq(mediaFiles.slug, cleanReqSlug),
              ilike(mediaFiles.slug, `%${contentId}%`),
              ilike(mediaFiles.slug, `%${cleanReqSlug}%`),
              ilike(mediaFiles.title, `%${contentId}%`),
              ilike(mediaFiles.title, titleWordSearch),
              cleanReqAlpha
                ? sql`LOWER(REGEXP_REPLACE(coalesce(${mediaFiles.slug}, ''), '[^a-zA-Z0-9]', '', 'g')) ILIKE '%' || ${cleanReqAlpha} || '%'`
                : sql`false`,
              cleanReqAlpha
                ? sql`LOWER(REGEXP_REPLACE(coalesce(${mediaFiles.title}, ''), '[^a-zA-Z0-9]', '', 'g')) ILIKE '%' || ${cleanReqAlpha} || '%'`
                : sql`false`,
            ),
          ),
        )
        .limit(50);

      const prioritizedCandidates = creatorId
        ? [
            ...candidateFiles.filter((c) => c.creatorId === creatorId),
            ...candidateFiles.filter((c) => c.creatorId !== creatorId),
          ]
        : candidateFiles;

      content = findBestContentMatch(
        prioritizedCandidates,
        contentId,
        creatorSlug,
      );
    }

    if (!content) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    const resolvedContentId = content.id;

    const [
      emailAccess,
      directAccess,
      collectionAccess,
      creator,
      collectionInfo,
    ] = await Promise.all([
      db
        .select({ grantedAt: contentAccessRequests.approvedAt })
        .from(contentAccessRequests)
        .innerJoin(
          users,
          sql`lower(${users.email}) = lower(${contentAccessRequests.viewerEmail})`,
        )
        .where(
          and(
            eq(users.id, userId),
            eq(contentAccessRequests.contentId, resolvedContentId),
            eq(contentAccessRequests.status, STATUS.APPROVED),
          ),
        )
        .limit(1)
        .then((r) => r[0]),

      db
        .select()
        .from(userContentAccess)
        .where(
          and(
            eq(userContentAccess.userId, userId),
            eq(userContentAccess.mediaFileId, resolvedContentId),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        )
        .limit(1)
        .then((r) => r[0]),

      db
        .select({
          accessType: userContentAccess.accessType,
          rentExpiresAt: userContentAccess.rentExpiresAt,
          grantedAt: userContentAccess.grantedAt,
        })
        .from(userContentAccess)
        .innerJoin(
          collectionItems,
          eq(collectionItems.collectionId, userContentAccess.collectionId),
        )
        .where(
          and(
            eq(userContentAccess.userId, userId),
            isNull(userContentAccess.mediaFileId),
            eq(collectionItems.mediaFileId, resolvedContentId),
            targetCollection
              ? eq(userContentAccess.collectionId, targetCollection.id)
              : sql`true`,
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        )
        .limit(1)
        .then((r) => r[0]),

      db
        .select({
          isHidden: users.isHidden,
          isDeleted: users.isDeleted,
          slug: creatorChannels.slug,
        })
        .from(users)
        .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
        .where(eq(users.id, content.creatorId))
        .limit(1)
        .then((r) => r[0]),

      db
        .select({
          collectionId: collections.id,
          collectionSlug: collections.slug,
          collectionName: collections.name,
          accessType: collections.accessType,
          buyPrice: collections.buyPrice,
          rentPrice: collections.rentPrice,
        })
        .from(collectionItems)
        .innerJoin(
          collections,
          and(
            eq(collections.id, collectionItems.collectionId),
            eq(collections.isDeleted, false),
          ),
        )
        .where(
          and(
            eq(collectionItems.mediaFileId, resolvedContentId),
            targetCollection
              ? eq(collectionItems.collectionId, targetCollection.id)
              : sql`true`,
          ),
        )
        .limit(1)
        .then(
          (r) =>
            r[0] ??
            (targetCollection
              ? {
                  collectionId: targetCollection.id,
                  collectionSlug: targetCollection.slug,
                  collectionName: targetCollection.name,
                  accessType: targetCollection.accessType,
                  buyPrice: targetCollection.buyPrice,
                  rentPrice: targetCollection.rentPrice,
                }
              : null),
        ),
    ]);

    const isCreatorPubliclyHidden = Boolean(
      creator
        ? creator.isDeleted ||
            (creator.isHidden && !targetCollection && !creatorSlug)
        : false,
    );

    const access = directAccess ?? collectionAccess;

    const hasActiveAccess = Boolean(
      emailAccess ||
      (access &&
        (!access.rentExpiresAt ||
          new Date(access.rentExpiresAt).getTime() > now.getTime())),
    );

    if (
      (content.isDeleted || isCreatorPubliclyHidden) &&
      content.creatorId !== userId &&
      !hasActiveAccess
    ) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    const categories = await db
      .select({
        id: contentCategories.id,
        name: contentCategories.name,
      })
      .from(mediaFileCategories)
      .innerJoin(
        contentCategories,
        eq(contentCategories.id, mediaFileCategories.categoryId),
      )
      .where(eq(mediaFileCategories.mediaFileId, resolvedContentId));

    const contentTags = await db
      .select({ name: tags.name })
      .from(mediaFileTags)
      .innerJoin(tags, eq(tags.id, mediaFileTags.tagId))
      .where(eq(mediaFileTags.mediaFileId, resolvedContentId));

    const isRented = access?.accessType === ACCRESS_TYPES.RENTED;
    const isExpired =
      isRented &&
      access?.rentExpiresAt &&
      new Date(access.rentExpiresAt).getTime() <= Date.now();

    const timeLeftText =
      isRented && access?.rentExpiresAt
        ? isExpired
          ? ACCRESS_TYPES.EXPIRED
          : `${Math.floor(
              (new Date(access.rentExpiresAt).getTime() - Date.now()) /
                Time.ONE_HOUR,
            )}h left`
        : undefined;

    const paidAccessInfo =
      access && !isExpired
        ? {
            accessType: access.accessType,
            rentExpiresAt: access.rentExpiresAt,
            grantedAt: access.grantedAt,
            ...(isRented && { timeLeftText }),
          }
        : null;
    const accessInfo =
      paidAccessInfo ??
      (emailAccess
        ? {
            accessType: ACCESS_TYPE.EMAIL_GATED,
            rentExpiresAt: null,
            grantedAt: emailAccess.grantedAt,
          }
        : null);

    await insertPageVisitService(content.creatorId, content.id, null);

    const isPaidCollection = Boolean(
      collectionInfo &&
      (collectionInfo.accessType === 'paid' ||
        collectionInfo.accessType === 'password' ||
        collectionInfo.accessType === 'email_gated' ||
        (collectionInfo.buyPrice && Number(collectionInfo.buyPrice) > 0) ||
        (collectionInfo.rentPrice && Number(collectionInfo.rentPrice) > 0)),
    );

    const resolvedCreatorSlug =
      creatorSlug ||
      (targetCollection?.creatorId
        ? await db
            .select({ slug: creatorChannels.slug })
            .from(creatorChannels)
            .where(eq(creatorChannels.creatorId, targetCollection.creatorId))
            .limit(1)
            .then((r) => r[0]?.slug)
        : null) ||
      creator?.slug;

    return success(
      {
        ...content,
        creatorSlug: resolvedCreatorSlug,
        categories,
        tags: contentTags.map((tag) => tag.name),
        collectionId:
          collectionInfo?.collectionId ?? targetCollection?.id ?? null,
        collectionSlug:
          collectionInfo?.collectionSlug ??
          targetCollection?.slug ??
          collectionSlug ??
          null,
        collectionName:
          collectionInfo?.collectionName ?? targetCollection?.name ?? null,
        isPaidCollection,
        ...(accessInfo && { accessInfo }),
      },
      'Content fetched successfully',
    );
  } catch (error) {
    logger.error('Failed to fetch content:', error);

    if (error instanceof HttpException) throw error;

    return fail('Failed to fetch content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
