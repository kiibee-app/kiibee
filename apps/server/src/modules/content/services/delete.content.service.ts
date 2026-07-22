import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const deleteContentService = async (contentId: string) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const result = await db.transaction(async (trx) => {
      const [existing] = await trx
        .select()
        .from(mediaFiles)
        .where(
          and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)),
        )
        .limit(1);

      if (!existing) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      await trx
        .update(mediaFiles)
        .set({ isDeleted: true, deletedAt: new Date() })
        .where(eq(mediaFiles.id, contentId));

      return existing;
    });

    return success(
      { id: result.id },
      'Content deleted successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to delete content:', error);

    if (error instanceof HttpException) throw error;

    return fail('Failed to delete content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
