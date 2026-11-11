import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { creatorApplicationRequests } from 'src/database/schema/users/creatorApplicationRequests.schema';
import { success } from 'src/utils/sendResponse';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { STATUS } from 'src/utils/constant';
import { logger } from 'src/logger/logger';

export const getCreatorRequestService = async (history = false) => {
  try {
    const creatorRequests = await db
      .select()
      .from(creatorApplicationRequests)
      .where(
        and(
          history ? undefined : eq(creatorApplicationRequests.isDeleted, false),
          history
            ? inArray(creatorApplicationRequests.status, [
                STATUS.APPROVED,
                STATUS.REJECTED,
              ])
            : eq(creatorApplicationRequests.status, STATUS.PENDING),
        ),
      )
      .orderBy(desc(creatorApplicationRequests.updatedAt));

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

    throw new HttpException(
      'Failed to fetch creator requests',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
