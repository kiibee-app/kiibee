import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { fail, success } from 'src/utils/sendResponse';
import { eq, and } from 'drizzle-orm';
import { STATUS } from 'src/utils/constant';
import { logger } from 'src/logger/logger';

export const getCreatorRequestService = async () => {
  try {
    const creatorRequests = await db
      .select()
      .from(creatorApplicationRequests)
      .where(
        and(
          eq(creatorApplicationRequests.isDeleted, false),
          eq(creatorApplicationRequests.status, STATUS.PENDING),
        ),
      );

    return success(
      creatorRequests,
      'Creator requests fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator requests:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch creator requests',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
