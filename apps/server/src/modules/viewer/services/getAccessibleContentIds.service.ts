import { HttpStatus } from '@nestjs/common';
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
      new Set([
        ...purchasedOrGranted.map(({ contentId }) => contentId as string),
        ...emailApproved.map(({ contentId }) => contentId),
      ]),
    );

    return success(
      { contentIds },
      'Accessible content ids retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error retrieving accessible content ids:', error);

    return fail(
      'Failed to retrieve accessible content ids',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
