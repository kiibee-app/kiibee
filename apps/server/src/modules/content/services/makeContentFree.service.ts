import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const makeContentFreeService = async (contentId: string) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const [updated] = await db
      .update(mediaFiles)
      .set({
        accessType: 'free',
        buyPrice: null,
        rentPrice: null,
        rentDurationHours: null,
        passwordHash: null,
        updatedAt: new Date(),
      })
      .where(and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)))
      .returning();

    if (!updated) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    return success(updated, 'Content made free successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to make content free:', error);

    if (error instanceof HttpException) throw error;

    return fail(
      'Failed to make content free',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
