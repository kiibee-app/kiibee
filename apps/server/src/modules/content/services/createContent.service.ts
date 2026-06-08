import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

import { db } from 'src/database/db';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { collectionItems } from 'src/database/schema/content/collectionItems.schema';

import { CreateContentDto } from '../content.dto';
import { contentSlugGenerator } from '../content.helper';

export const createContent = async (
  dto: CreateContentDto,
  creatorId: string,
) => {
  try {
    const {
      collectionId,
      title,
      description,
      fileKey,
      contentUrl,
      contentTypeId,
      openInNewWindow,
      openDirectFromList,
    } = dto;

    const contentId = crypto.randomUUID();
    const slug = await contentSlugGenerator(title);

    const response = await db.transaction(async (tx) => {
      await tx.insert(mediaFiles).values({
        id: contentId,
        title,
        slug,
        description,
        fileKey,
        contentUrl,
        contentTypeId,
        creatorId,
        openInNewWindow: openInNewWindow ?? false,
        openDirectFromList: openDirectFromList ?? false,
      });

      await tx.insert(collectionItems).values({
        id: crypto.randomUUID(),
        collectionId,
        mediaFileId: contentId,
      });

      return {
        id: contentId,
        title,
        slug,
        description,
        fileKey,
        contentUrl,
        contentTypeId,
      };
    });

    return success(response, 'Content created successfully');
  } catch (error) {
    logger.error('Failed to create content:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail('Failed to create content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
