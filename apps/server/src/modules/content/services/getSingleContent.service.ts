import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  mediaFiles,
  mediaFileCategories,
  contentCategories,
  userContentAccess,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ACCRESS_TYPES, Time } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getSingleContentService = async (
  contentId: string,
  userId: string,
) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const [access, content] = await Promise.all([
      db
        .select()
        .from(userContentAccess)
        .where(
          and(
            eq(userContentAccess.userId, userId),
            eq(userContentAccess.mediaFileId, contentId),
          ),
        )
        .limit(1)
        .then((r) => r[0]),

      db
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.id, contentId))
        .limit(1)
        .then((r) => r[0]),
    ]);

    if (!content) {
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
      .where(eq(mediaFileCategories.mediaFileId, contentId));

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

    const accessInfo =
      access && !isExpired
        ? {
            accessType: access.accessType,
            rentExpiresAt: access.rentExpiresAt,
            grantedAt: access.grantedAt,
            ...(isRented && { timeLeftText }),
          }
        : null;

    return success(
      {
        ...content,
        categories,
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
