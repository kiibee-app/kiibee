import { HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { contentLimits } from 'src/database/schema/content/contentLimits.schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { and, eq } from 'drizzle-orm';
import { contentDownloadCount, mediaFiles } from 'src/database/schema';
import { randomUUID } from 'crypto';

export const getContentDownloadLimit = async () => {
  try {
    const limit = await db.select().from(contentLimits).limit(1);
    const response = {
      maxLimit: limit[0]?.maxLimit ?? 0,
    };
    return success(
      response,
      'Content download limit fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch content download limit:', error);
    return fail(
      'Failed to fetch content download limit',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const setContentDownloadLimit = async (maxLimit: number) => {
  try {
    await db.transaction(async (trx) => {
      const existingLimit = await trx.select().from(contentLimits).limit(1);

      if (existingLimit.length > 0) {
        await trx
          .update(contentLimits)
          .set({ maxLimit })
          .where(eq(contentLimits.id, existingLimit[0].id));
      } else {
        await trx.insert(contentLimits).values({
          id: randomUUID(),
          maxLimit,
        });
      }

      await trx.update(mediaFiles).set({
        maxDownloadCount: maxLimit,
      });
    });

    return success(
      { maxLimit },
      'Content download limit set successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to set content download limit:', error);

    return fail(
      'Failed to set content download limit',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getContentDownloadInfo = async (
  contentId: string,
  userId: string,
) => {
  try {
    if (!contentId || !userId) {
      return fail(
        'Content ID and User ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [content] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, contentId))
      .limit(1);

    const downloadCountResult = await db
      .select()
      .from(contentDownloadCount)
      .where(
        and(
          eq(contentDownloadCount.contentId, contentId),
          eq(contentDownloadCount.userId, userId),
        ),
      )
      .limit(1);
    const maxDownloadLimit = content?.maxDownloadCount ?? 0;
    const downloadCount = downloadCountResult[0]?.downloadCount ?? 0;
    const remainingDownloads = maxDownloadLimit - downloadCount;

    const response = {
      maxDownloadLimit,
      downloadCount,
      remainingDownloads,
    };
    return success(
      response,
      'Content download info fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch content download info:', error);
    return fail(
      'Failed to fetch content download info',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
