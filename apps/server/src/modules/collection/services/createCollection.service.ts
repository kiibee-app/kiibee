import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections, contentSettings } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import {
  ACCESS_TYPE,
  CONTENT_SETTING_ACCESS_TYPE,
  COLLECTION_MESSAGES,
} from 'src/utils/constant';

import { CreateCollectionDto } from '../dto/createCollection.dto';
import { slugGenerator } from '../collection.helper';

export const createCollection = async (
  dto: CreateCollectionDto,
  creatorId: string,
) => {
  try {
    const normalizedName = dto.name.trim();

    const existingCollection = await db
      .select({ id: collections.id })
      .from(collections)
      .where(
        and(
          sql`LOWER(${collections.name}) = LOWER(${normalizedName})`,
          eq(collections.creatorId, creatorId),
          eq(collections.isDeleted, false),
        ),
      )
      .limit(1);

    if (existingCollection.length > 0) {
      return fail(COLLECTION_MESSAGES.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const [userSetting] = await db
      .select({ accessType: contentSettings.accessType })
      .from(contentSettings)
      .where(eq(contentSettings.userId, creatorId))
      .limit(1);

    const defaultAccessType =
      userSetting?.accessType === CONTENT_SETTING_ACCESS_TYPE.PAYMENT ||
      userSetting?.accessType === ACCESS_TYPE.PAID
        ? ACCESS_TYPE.PAID
        : userSetting?.accessType === CONTENT_SETTING_ACCESS_TYPE.SET_PASSWORD
          ? ACCESS_TYPE.PASSWORD
          : userSetting?.accessType ===
              CONTENT_SETTING_ACCESS_TYPE.REQUEST_EMAIL
            ? ACCESS_TYPE.EMAIL_GATED
            : ACCESS_TYPE.FREE;

    const slug = await slugGenerator(normalizedName);

    const collectionId = crypto.randomUUID();

    const [createdCollection] = await db
      .insert(collections)
      .values({
        id: collectionId,
        name: normalizedName,
        creatorId,
        slug,
        accessType: defaultAccessType,
        sortOrder: sql`(SELECT COALESCE(MAX(sort_order), 0) + 1 FROM ${collections} WHERE creator_id = ${creatorId})`,
      })
      .returning({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        creatorId: collections.creatorId,
        accessType: collections.accessType,
        sortOrder: collections.sortOrder,
      });

    return success(
      createdCollection,
      COLLECTION_MESSAGES.CREATE_SUCCESS,
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Failed to create collection', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      COLLECTION_MESSAGES.CREATE_FAILED,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
