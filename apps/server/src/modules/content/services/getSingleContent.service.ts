import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and, gt, isNull, or, sql } from 'drizzle-orm';
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
        .select({ id: creatorChannels.creatorId })
        .from(creatorChannels)
        .where(
          or(
            eq(creatorChannels.slug, creatorSlug),
            sql`LOWER(REGEXP_REPLACE(coalesce(${creatorChannels.slug}, ''), '[^a-zA-Z0-9]', '', 'g')) = ${cleanCreatorSlug}`,
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
      accessType: string;
      buyPrice: string | null;
      rentPrice: string | null;
    } | null = null;

    if (collectionSlug && collectionSlug.toLowerCase() !== 'shows') {
      const candidateCols = await db
        .select({
          id: collections.id,
          name: collections.name,
          slug: collections.slug,
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

      targetCollection =
        candidateCols.find((c) => {
          if (c.id === collectionSlug) return true;
          if (c.slug === collectionSlug) return true;
          if (contentTitleUrlSlug(c.name) === collectionSlug) return true;
          if (cleanCollectionSlug(c.slug, creatorSlug) === collectionSlug)
            return true;
          if (cleanCollectionSlug(c.name, creatorSlug) === collectionSlug)
            return true;
          return false;
        }) ?? null;
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

      if (isUuid) {
        content = itemsInCollection.find(
          (item) => item.mediaFile.id === contentId,
        )?.mediaFile;
      }

      if (!content) {
        content = itemsInCollection.find(
          (item) =>
            item.mediaFile.slug === contentId ||
            contentTitleUrlSlug(item.mediaFile.title) === contentId,
        )?.mediaFile;
      }

      if (!content) {
        content = itemsInCollection.find(
          (item) =>
            item.mediaFile.slug.includes(contentId) ||
            contentId.includes(item.mediaFile.slug),
        )?.mediaFile;
      }
    }

    if (!content && isUuid) {
      content = await db
        .select()
        .from(mediaFiles)
        .where(
          and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)),
        )
        .limit(1)
        .then((r) => r[0]);
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

      content = creatorFiles.find(
        (candidate) =>
          candidate.slug === contentId ||
          contentTitleUrlSlug(candidate.title) === contentId,
      );

      if (!content) {
        content = creatorFiles.find(
          (candidate) =>
            candidate.slug.includes(contentId) ||
            contentId.includes(candidate.slug),
        );
      }
    }

    if (!content) {
      content = await db
        .select()
        .from(mediaFiles)
        .where(
          and(
            isUuid
              ? eq(mediaFiles.id, contentId)
              : eq(mediaFiles.slug, contentId),
            eq(mediaFiles.isDeleted, false),
          ),
        )
        .limit(1)
        .then((r) => r[0]);
    }

    if (!content) {
      const candidateFiles = await db
        .select({
          id: mediaFiles.id,
          title: mediaFiles.title,
          slug: mediaFiles.slug,
        })
        .from(mediaFiles)
        .where(
          and(
            or(
              eq(mediaFiles.slug, contentId),
              sql`LOWER(${mediaFiles.slug}) ILIKE '%' || ${contentId} || '%'`,
            ),
            eq(mediaFiles.isDeleted, false),
          ),
        )
        .limit(20);

      const titleMatch = candidateFiles.find(
        (candidate) =>
          candidate.slug === contentId ||
          candidate.slug.includes(contentId) ||
          contentTitleUrlSlug(candidate.title) === contentId,
      );

      if (titleMatch) {
        content = await db
          .select()
          .from(mediaFiles)
          .where(eq(mediaFiles.id, titleMatch.id))
          .limit(1)
          .then((r) => r[0]);
      }
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

    const isCreatorPubliclyHidden =
      !creator || creator.isDeleted || creator.isHidden;

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

    return success(
      {
        ...content,
        creatorSlug: creator?.slug,
        categories,
        tags: contentTags.map((tag) => tag.name),
        collectionId: collectionInfo?.collectionId ?? null,
        collectionSlug: collectionInfo?.collectionSlug ?? null,
        collectionName: collectionInfo?.collectionName ?? null,
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
