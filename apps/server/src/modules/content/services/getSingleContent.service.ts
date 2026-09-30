import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and, gt, isNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collectionItems,
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
import { contentTitleUrlSlug } from '../content.helper';

export const getSingleContentService = async (
  contentId: string,
  userId: string,
  creatorSlug?: string,
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

    let content = await db
      .select()
      .from(mediaFiles)
      .where(
        isUuid ? eq(mediaFiles.id, contentId) : eq(mediaFiles.slug, contentId),
      )
      .limit(1)
      .then((r) => r[0]);

    if (!content && creatorSlug) {
      const [creator] = await db
        .select({ id: creatorChannels.creatorId })
        .from(creatorChannels)
        .where(eq(creatorChannels.slug, creatorSlug))
        .limit(1);

      const creatorContent = creator
        ? await db
            .select({ id: mediaFiles.id, title: mediaFiles.title })
            .from(mediaFiles)
            .where(eq(mediaFiles.creatorId, creator.id))
        : [];
      const titleMatch = creatorContent.find(
        (candidate) => contentTitleUrlSlug(candidate.title) === contentId,
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

    const [emailAccess, directAccess, collectionAccess, creator] =
      await Promise.all([
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

    return success(
      {
        ...content,
        creatorSlug: creator?.slug,
        categories,
        tags: contentTags.map((tag) => tag.name),
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
