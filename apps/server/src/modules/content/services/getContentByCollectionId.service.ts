import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { collectionItems, contentTypes, mediaFiles } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { eq } from 'drizzle-orm';

export const getContentByCollectionIdService = async (collectionId: string) => {
  try {
    if (!collectionId) {
      return fail('Collection ID is required', HttpStatus.BAD_REQUEST);
    }

    const contentItems = await db
      .select({
        id: mediaFiles.id,
        title: mediaFiles.title,
        slug: mediaFiles.slug,
        description: mediaFiles.description,
        visibility: mediaFiles.visibility,
        createdAt: mediaFiles.createdAt,

        contentTypeName: contentTypes.name,
      })
      .from(mediaFiles)
      .innerJoin(
        collectionItems,
        eq(collectionItems.mediaFileId, mediaFiles.id),
      )
      .leftJoin(contentTypes, eq(contentTypes.id, mediaFiles.contentTypeId))
      .where(eq(collectionItems.collectionId, collectionId));

    const responseData = contentItems.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      contentType: item.contentTypeName || 'Unknown',
      visibility:
        item.visibility.charAt(0).toUpperCase() + item.visibility.slice(1),
      createdAt: item.createdAt,
    }));

    return success(responseData, 'Content items retrieved successfully');
  } catch (error) {
    logger.error('Failed to fetch content:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to fetch content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
