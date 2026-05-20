import { eq } from 'drizzle-orm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { fail, success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { UpdateContentDto } from '../content.dto';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { mediaFileCategories } from 'src/database/schema';

const pickDefined = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null),
  );

export const updateContentService = async (
  contentId: string,
  dto: UpdateContentDto,
) => {
  try {
    await db.transaction(async (trx) => {
      const [existing] = await trx
        .select()
        .from(mediaFiles)
        .where(eq(mediaFiles.id, contentId))
        .limit(1);

      if (!existing) {
        throw new HttpException('Content not found', HttpStatus.NOT_FOUND);
      }

      const updatePayload = pickDefined({
        title: dto.title,
        description: dto.description,
        contentUrl: dto.contentUrl,
        trailerUrl: dto.trailerUrl,
        thumbnailUrl: dto.thumbnailUrl,
        thumbnailLandscapeUrl: dto.thumbnailLandscapeUrl,
        visibility: dto.visibility,
        accessType: dto.accessType,
        publishedYear: dto.publishedYear,
        duration: dto.duration,
        production_company: dto.productionCompany,
        manufacturerLink: dto.manufacturerLink,
        buyPrice: dto.buyPrice !== undefined ? String(dto.buyPrice) : undefined,
        rentPrice:
          dto.rentPrice !== undefined ? String(dto.rentPrice) : undefined,
        rentDurationHours: dto.rentDurationHours,
        maxDownloadCount: dto.maximumDownloadCount,
        physicalProductLink: dto.physicalProductLink,
        isDownloadable: dto.isDownloadable,
      });

      if (Object.keys(updatePayload).length) {
        await trx
          .update(mediaFiles)
          .set(updatePayload)
          .where(eq(mediaFiles.id, contentId));
      }

      if (dto.categoryId) {
        const [existingCategory] = await trx
          .select()
          .from(mediaFileCategories)
          .where(eq(mediaFileCategories.mediaFileId, contentId))
          .limit(1);

        if (existingCategory) {
          await trx
            .update(mediaFileCategories)
            .set({ categoryId: dto.categoryId })
            .where(eq(mediaFileCategories.mediaFileId, contentId));
        } else {
          await trx.insert(mediaFileCategories).values({
            id: crypto.randomUUID(),
            categoryId: dto.categoryId,
            mediaFileId: contentId,
          });
        }
      }

      return true;
    });

    const responseData = {
      id: contentId,
    };

    return success(responseData, 'Content updated successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Failed to update content:', error);

    if (error instanceof HttpException) throw error;

    return fail('Failed to update content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
