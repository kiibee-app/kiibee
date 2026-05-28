import { HttpException, HttpStatus } from '@nestjs/common';
import { desc, eq, sql, and } from 'drizzle-orm';
import { db } from 'src/database/db';
import { emailSubscribers, mediaFiles, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const topCreatorsService = async () => {
  try {
    const topCreators = await db
      .select({
        id: users.id,
        name: users.fullName,
        profileImageUrl: users.avatarUrl,
        createdAt: users.createdAt,
        uploadCount: sql<number>`COUNT(DISTINCT ${mediaFiles.id})`,
        subscriberCount: sql<number>`COUNT(DISTINCT ${emailSubscribers.id})`,
      })
      .from(users)
      .leftJoin(mediaFiles, eq(mediaFiles.creatorId, users.id))
      .leftJoin(emailSubscribers, eq(emailSubscribers.creatorId, users.id))
      .where(
        and(
          eq(users.isActive, true),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
      .groupBy(users.id, users.fullName, users.avatarUrl, users.createdAt)
      .orderBy(desc(sql`COUNT(DISTINCT ${mediaFiles.id})`))
      .limit(10);

    return success(
      topCreators,
      'Top creators fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch top creators:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch top creators',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
