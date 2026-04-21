import { HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { asc } from 'drizzle-orm/sql/expressions/select';
import { db } from 'src/database/db';
import { contentTypes } from 'src/database/schema/content/contentTypes.schema';
import { fail, success } from 'src/utils/sendResponse';

export const getContentTypesService = async () => {
  try {
    const contentAllTypes = await db
      .select()
      .from(contentTypes)
      .where(eq(contentTypes.isActive, true))
      .orderBy(asc(contentTypes.createdAt));

    if (!contentAllTypes || contentAllTypes.length === 0) {
      return success(null, 'No content types found', HttpStatus.OK);
    }
    return success(
      contentAllTypes,
      'Content types fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    console.error('Error fetching content types:', error);
    return fail(
      'Failed to fetch content types',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
