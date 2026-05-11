import { HttpException, HttpStatus } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { contentCategories } from 'src/database/schema/content/contentCategories.schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';

export const getContentCategoriesService = async () => {
  try {
    const categories = await db
      .select()
      .from(contentCategories)
      .where(eq(contentCategories.isActive, true))
      .orderBy(asc(contentCategories.createdAt));

    if (!categories || categories.length === 0) {
      return success(null, 'No content categories found', HttpStatus.OK);
    }
    return success(
      categories,
      'Content categories fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching content categories:', error);
    throw new HttpException(
      'Failed to fetch content categories',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
