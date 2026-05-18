import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCollectionById = async (id: string, creatorId: string) => {
  try {
    const [collection] = await db
      .select()
      .from(collections)
      .where(
        and(
          eq(collections.id, id),
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .limit(1);

    if (!collection) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    return success(collection, 'Collection retrieved successfully');
  } catch (error) {
    logger.error('Failed to get collection', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to retrieve collection',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
