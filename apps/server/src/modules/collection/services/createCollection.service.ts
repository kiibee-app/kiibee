import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

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
      return fail(
        'Collection with the same name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const slug = await slugGenerator(normalizedName);

    const collectionId = crypto.randomUUID();

    const [createdCollection] = await db
      .insert(collections)
      .values({
        id: collectionId,
        name: normalizedName,
        creatorId,
        slug,
        sortOrder: sql`(SELECT COALESCE(MAX(sort_order), 0) + 1 FROM ${collections} WHERE creator_id = ${creatorId})`,
      })
      .returning({
        id: collections.id,
        name: collections.name,
        slug: collections.slug,
        creatorId: collections.creatorId,
        sortOrder: collections.sortOrder,
      });

    return success(
      createdCollection,
      'Collection created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error('Failed to create collection', error);

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to create collection',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
