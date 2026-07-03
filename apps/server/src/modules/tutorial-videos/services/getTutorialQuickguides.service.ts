import { asc } from 'drizzle-orm';
import { db } from 'src/database/db';
import { tutorialQuickguides } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success, fail } from 'src/utils/sendResponse';
import { HttpStatus } from '@nestjs/common';

export const getTutorialQuickguidesService = async () => {
  try {
    const guides = await db
      .select()
      .from(tutorialQuickguides)
      .orderBy(asc(tutorialQuickguides.sortOrder));

    const data = guides.map((guide) => ({
      id: guide.id,
      title: guide.title,
      pdfUrl: guide.pdfUrl,
      thumbnailUrl: guide.thumbnailUrl,
      sortOrder: guide.sortOrder,
    }));

    return success(
      data,
      'Tutorial quickguides fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to get tutorial quickguides:', error);
    return fail(
      'Failed to retrieve tutorial quickguides',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
