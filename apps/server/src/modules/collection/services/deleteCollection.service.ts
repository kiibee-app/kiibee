import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const deleteCollection = async (id: string, creatorId: string) => {
  try {
    const [existing] = await db
      .select({ id: collections.id })
      .from(collections)
      .where(
        and(
          eq(collections.id, id),
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .limit(1);

    if (!existing) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    await db
      .update(collections)
      .set({ isDeleted: true })
      .where(eq(collections.id, id));

    return success(null, 'Collection deleted successfully');
  } catch (error) {
    logger.error('Failed to delete collection', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to delete collection',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
