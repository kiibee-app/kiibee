import { HttpException, HttpStatus } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorApplicationRequests,
  mediaFiles,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ACCESS_TYPE, ROLE, STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';

export const getAdminDashboardStatsService = async () => {
  try {
    const [
      totalUsersResult,
      creatorsResult,
      viewersResult,
      pendingRequestsResult,
      totalMediaResult,
      freeMediaResult,
      paidMediaResult,
      passwordMediaResult,
      emailGatedMediaResult,
    ] = await Promise.all([
      db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isDeleted, false)),
      db
        .select({ count: count() })
        .from(users)
        .where(and(eq(users.role, ROLE.CREATOR), eq(users.isDeleted, false))),
      db
        .select({ count: count() })
        .from(users)
        .where(and(eq(users.role, ROLE.VIEWER), eq(users.isDeleted, false))),
      db
        .select({ count: count() })
        .from(creatorApplicationRequests)
        .where(
          and(
            eq(creatorApplicationRequests.isDeleted, false),
            eq(creatorApplicationRequests.status, STATUS.PENDING),
          ),
        ),
      db
        .select({ count: count() })
        .from(mediaFiles)
        .where(eq(mediaFiles.isDeleted, false)),
      db
        .select({ count: count() })
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.isDeleted, false),
            eq(mediaFiles.accessType, ACCESS_TYPE.FREE),
          ),
        ),
      db
        .select({ count: count() })
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.isDeleted, false),
            eq(mediaFiles.accessType, ACCESS_TYPE.PAID),
          ),
        ),
      db
        .select({ count: count() })
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.isDeleted, false),
            eq(mediaFiles.accessType, ACCESS_TYPE.PASSWORD),
          ),
        ),
      db
        .select({ count: count() })
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.isDeleted, false),
            eq(mediaFiles.accessType, ACCESS_TYPE.EMAIL_GATED),
          ),
        ),
    ]);

    const totalMedia = Number(totalMediaResult[0]?.count ?? 0);
    const freeMedia = Number(freeMediaResult[0]?.count ?? 0);
    const paidMedia = Number(paidMediaResult[0]?.count ?? 0);
    const passwordMedia = Number(passwordMediaResult[0]?.count ?? 0);
    const emailGatedMedia = Number(emailGatedMediaResult[0]?.count ?? 0);

    return success(
      {
        totalUsers: Number(totalUsersResult[0]?.count ?? 0),
        creators: Number(creatorsResult[0]?.count ?? 0),
        viewers: Number(viewersResult[0]?.count ?? 0),
        pendingRequests: Number(pendingRequestsResult[0]?.count ?? 0),
        totalContent: totalMedia,
        freeContent: freeMedia,
        paidContent: paidMedia,
        passwordContent: passwordMedia,
        emailGatedContent: emailGatedMedia,
      },
      'Dashboard stats fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching admin dashboard stats:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch dashboard stats',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
