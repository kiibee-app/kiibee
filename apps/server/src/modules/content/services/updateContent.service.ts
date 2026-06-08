import { and, eq } from 'drizzle-orm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { fail, success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { UpdateContentDto } from '../content.dto';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import {
  collectionItems,
  collections,
  mediaFileCategories,
} from 'src/database/schema';
import { CONTENT_VISIBILITY } from 'src/utils/constant';

const pickDefined = (obj: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null),
  );

export const updateContentService = async (
  contentId: string,
  dto: UpdateContentDto,
  creatorId: string,
) => {
  try {
    await db.transaction(async (trx) => {
      const [existing] = await trx
        .select()
        .from(mediaFiles)
        .where(
          and(
            eq(mediaFiles.id, contentId),
            eq(mediaFiles.creatorId, creatorId),
            eq(mediaFiles.isDeleted, false),
          ),
        )
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
        openInNewWindow: dto.openInNewWindow,
        openDirectFromList: dto.openDirectFromList,
        isPublished:
          dto.visibility === CONTENT_VISIBILITY.PUBLIC
            ? true
            : existing.isPublished,
        publishedAt:
          dto.visibility === CONTENT_VISIBILITY.PUBLIC && !existing.isPublished
            ? new Date()
            : existing.publishedAt,
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

      if (dto.collectionId) {
        const [targetCollection] = await trx
          .select({ id: collections.id })
          .from(collections)
          .where(
            and(
              eq(collections.id, dto.collectionId),
              eq(collections.creatorId, creatorId),
              eq(collections.isDeleted, false),
            ),
          )
          .limit(1);

        if (!targetCollection) {
          return fail('Target collection not found', HttpStatus.NOT_FOUND);
        }

        const [targetMapping] = await trx
          .select({ id: collectionItems.id })
          .from(collectionItems)
          .where(
            and(
              eq(collectionItems.mediaFileId, contentId),
              eq(collectionItems.collectionId, dto.collectionId),
            ),
          )
          .limit(1);

        const [sourceMapping] = dto.sourceCollectionId
          ? await trx
              .select({ id: collectionItems.id })
              .from(collectionItems)
              .where(
                and(
                  eq(collectionItems.mediaFileId, contentId),
                  eq(collectionItems.collectionId, dto.sourceCollectionId),
                ),
              )
              .limit(1)
          : await trx
              .select({ id: collectionItems.id })
              .from(collectionItems)
              .where(eq(collectionItems.mediaFileId, contentId))
              .limit(1);

        if (dto.sourceCollectionId && !sourceMapping) {
          return fail(
            'Source collection mapping not found',
            HttpStatus.NOT_FOUND,
          );
        }

        const hasSource = Boolean(sourceMapping);
        const hasTarget = Boolean(targetMapping);

        if (hasSource) {
          const moveQuery = hasTarget
            ? trx
                .delete(collectionItems)
                .where(eq(collectionItems.id, sourceMapping.id))
            : trx
                .update(collectionItems)
                .set({ collectionId: dto.collectionId })
                .where(eq(collectionItems.id, sourceMapping.id));

          await moveQuery;
          return;
        }

        await (hasTarget
          ? Promise.resolve()
          : trx.insert(collectionItems).values({
              id: crypto.randomUUID(),
              collectionId: dto.collectionId,
              mediaFileId: contentId,
            }));
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
