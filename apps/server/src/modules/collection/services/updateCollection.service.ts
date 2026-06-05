import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { collections } from 'src/database/schema';

import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

import { UpdateCollectionDto } from '../dto/createCollection.dto';
import { slugGenerator } from '../collection.helper';

export const updateCollection = async (
  id: string,
  dto: Partial<UpdateCollectionDto>,
  creatorId: string,
) => {
  try {
    const where = and(
      eq(collections.id, id),
      eq(collections.creatorId, creatorId),
      eq(collections.isDeleted, false),
    );

    const [existing] = await db
      .select()
      .from(collections)
      .where(where)
      .limit(1);

    if (!existing) {
      return fail('Collection not found', HttpStatus.NOT_FOUND);
    }

    const updateData: any = {};

    // 🔥 name + slug handled separately (only special case)
    if (dto.name?.trim()) {
      const name = dto.name.trim();
      updateData.name = name;
      updateData.slug = await slugGenerator(name);
    }

    // 🔥 everything else in a map (NO multiple if blocks)
    const fieldMap: Record<string, any> = {
      coverImageUrl: dto.coverImageUrl,
      visibility: dto.visibility,
      accessType: dto.accessType,
      buyPrice: dto.buyPrice !== undefined ? String(dto.buyPrice) : undefined,
      rentPrice:
        dto.rentPrice !== undefined ? String(dto.rentPrice) : undefined,
      rentDuration: dto.rentDuration,
      description: dto.description,
      sortOrder: dto.sortOrder,
      isPublished: dto.isPublished,
    };

    for (const [key, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    // publishedAt side-effect (single condition only)
    if (dto.isPublished) {
      updateData.publishedAt = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return success(existing, 'No changes to update');
    }

    const [updated] = await db
      .update(collections)
      .set(updateData)
      .where(where)
      .returning();

    return success(updated, 'Collection updated successfully');
  } catch (error) {
    logger.error('Failed to update collection', error);

    if (error instanceof HttpException) throw error;

    return fail(
      'Failed to update collection',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
