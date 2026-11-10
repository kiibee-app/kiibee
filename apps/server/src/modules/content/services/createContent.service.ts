import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

import { eq } from 'drizzle-orm';
import { hasPaidSubscriptionPeriod } from 'src/modules/subscription/services/hasPaidSubscriptionPeriod';
import { db } from 'src/database/db';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { collectionItems } from 'src/database/schema/content/collectionItems.schema';

import { CreateContentDto } from '../content.dto';
import {
  checkDuplicateContentTitle,
  contentSlugGenerator,
} from '../content.helper';
import { contentLimits, users } from 'src/database/schema';
import { resolveDownloadLimit } from 'src/utils/downloadLimit';

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
      fileSize,
    } = dto;

    const isDuplicate = await checkDuplicateContentTitle(
      creatorId,
      title,
      contentTypeId,
    );

    if (isDuplicate) {
      return fail('Content title is already in use', HttpStatus.CONFLICT);
    }

    const contentId = crypto.randomUUID();
    const slug = await contentSlugGenerator(title);
    const downloadLimit = await db.select().from(contentLimits).limit(1);

    const response = await db.transaction(async (tx) => {
      const [creator] = await tx
        .select({
          subscriptionUpgradeRequired: users.subscriptionUpgradeRequired,
        })
        .from(users)
        .where(eq(users.id, creatorId))
        .for('share');

      if (
        creator?.subscriptionUpgradeRequired &&
        !(await hasPaidSubscriptionPeriod(tx, creatorId))
      ) {
        return fail(
          'Upgrade your subscription before adding new content',
          HttpStatus.FORBIDDEN,
        );
      }

      await tx.insert(mediaFiles).values({
        id: contentId,
        title,
        slug,
        description,
        fileKey,
        contentUrl,
        contentTypeId,
        creatorId,
        fileSize,
        maxDownloadCount: resolveDownloadLimit(downloadLimit[0]?.maxLimit),
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
        fileSize,
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
