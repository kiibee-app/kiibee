import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, gt, isNotNull, isNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentAccessRequests,
  userContentAccess,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getAccessibleContentIds = async (userId: string) => {
  try {
    if (!userId) {
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const now = new Date();

    const [purchasedOrGranted, emailApproved] = await Promise.all([
      db
        .select({ contentId: userContentAccess.mediaFileId })
        .from(userContentAccess)
        .where(
          and(
            eq(userContentAccess.userId, userId),
            isNotNull(userContentAccess.mediaFileId),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, now),
            ),
          ),
        ),
      db
        .select({ contentId: contentAccessRequests.contentId })
        .from(contentAccessRequests)
        .innerJoin(
          users,
          sql`lower(${users.email}) = lower(${contentAccessRequests.viewerEmail})`,
        )
        .where(
          and(
            eq(users.id, userId),
            eq(contentAccessRequests.status, STATUS.APPROVED),
          ),
        ),
    ]);

    const contentIds = Array.from(
      new Set(
        [...purchasedOrGranted, ...emailApproved]
          .map((row) => row.contentId)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    return success(
      { contentIds },
      'Accessible content ids retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error retrieving accessible content ids:', error);

    if (error instanceof HttpException) throw error;

    return fail(
      'Failed to retrieve accessible content ids',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
