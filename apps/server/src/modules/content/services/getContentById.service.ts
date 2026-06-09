import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  mediaFiles,
  mediaFileCategories,
  contentCategories,
  mediaFileTags,
  tags,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getContentByIdService = async (contentId: string) => {
  try {
    if (!contentId) {
      return fail('Content ID is required', HttpStatus.BAD_REQUEST);
    }

    const [content] = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, contentId))
      .limit(1);

    if (!content) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    const categories = await db
      .select({
        id: contentCategories.id,
        name: contentCategories.name,
      })
      .from(mediaFileCategories)
      .innerJoin(
        contentCategories,
        eq(contentCategories.id, mediaFileCategories.categoryId),
      )
      .where(eq(mediaFileCategories.mediaFileId, contentId));

    const contentTags = await db
      .select({
        name: tags.name,
      })
      .from(mediaFileTags)
      .innerJoin(tags, eq(tags.id, mediaFileTags.tagId))
      .where(eq(mediaFileTags.mediaFileId, contentId));

    const responseData = {
      ...content,
      categories,
      tags: contentTags.map((tag) => tag.name),
    };

    return success(responseData, 'Content fetched successfully');
  } catch (error) {
    logger.error('Failed to fetch content:', error);

    if (error instanceof HttpException) throw error;

    return fail('Failed to fetch content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
