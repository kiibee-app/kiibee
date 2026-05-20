import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { mediaFileCategories } from 'src/database/schema/content/mediaFileCategories.schema';
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
        .where(eq(mediaFiles.id, contentId))
        .limit(1);

      if (!existing) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      await trx
        .delete(mediaFileCategories)
        .where(eq(mediaFileCategories.mediaFileId, contentId));

      await trx.delete(mediaFiles).where(eq(mediaFiles.id, contentId));

      return existing;
    });

    return success(
      { id: result.id },
      'Content permanently deleted',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to delete content:', error);

    if (error instanceof HttpException) throw error;

    return fail('Failed to delete content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
