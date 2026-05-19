import { eq } from 'drizzle-orm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { fail, success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { UpdateContentDto } from '../content.dto';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';

export const updateContentService = async (
  contentId: string,
  dto: UpdateContentDto,
) => {
  try {
    // 1. Check if content exists
    const existing = await db
      .select()
      .from(mediaFiles)
      .where(eq(mediaFiles.id, contentId))
      .limit(1);

    if (!existing.length) {
      throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
    }

    // 2. Update only provided fields
    const updated = await db
      .update(mediaFiles)
      .set({
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.contentUrl && { contentUrl: dto.contentUrl }),
        ...(dto.trailerUrl && { trailerUrl: dto.trailerUrl }),
        ...(dto.thumbnailUrl && { thumbnailUrl: dto.thumbnailUrl }),
        ...(dto.thumbnailLandscapeUrl && {
          thumbnailLandscapeUrl: dto.thumbnailLandscapeUrl,
        }),
        ...(dto.visibility && {
          visibility: dto.visibility as
            | 'public'
            | 'hidden'
            | 'draft'
            | 'private',
        }),
        ...(dto.accessType && {
          accessType: dto.accessType as
            | 'free'
            | 'paid'
            | 'password'
            | 'email_gated',
        }),
        ...(dto.publishedYear && { publishedYear: dto.publishedYear }),
        ...(dto.duration && { duration: dto.duration }),
        ...(dto.productionCompany && {
          production_company: dto.productionCompany,
        }),
        ...(dto.manufacturerLink && {
          manufacturerLink: dto.manufacturerLink,
        }),
        ...(dto.buyPrice !== undefined && { buyPrice: String(dto.buyPrice) }),
        ...(dto.rentPrice !== undefined && {
          rentPrice: String(dto.rentPrice),
        }),
        ...(dto.rentDurationHours && {
          rentDurationHours: dto.rentDurationHours,
        }),
        ...(dto.maximumDownloadCount && {
          maxDownloadCount: dto.maximumDownloadCount,
        }),
        ...(dto.physicalProductLink && {
          physicalProductLink: dto.physicalProductLink,
        }),
        ...(dto.isDownloadable !== undefined && {
          isDownloadable: dto.isDownloadable,
        }),
      })
      .where(eq(mediaFiles.id, contentId))
      .returning();

    return success('Content updated successfully');
  } catch (error) {
    logger.error('Failed to update content:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to update content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
