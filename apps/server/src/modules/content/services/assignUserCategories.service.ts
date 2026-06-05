import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import { userContentCategory } from 'src/database/schema/users/userContentCategories.shema';
import { userContentTypes } from 'src/database/schema/users/userContentTypes.shema';
import { contentCategories } from 'src/database/schema/content/contentCategories.schema';
import { contentTypes } from 'src/database/schema/content/contentTypes.schema';
import { success } from 'src/utils/sendResponse';
import { randomUUID } from 'crypto';
import { users } from 'src/database/schema/users/users.schema';
import { logger } from 'src/logger/logger';

type AssignUserCategoriesPayload = {
  userId: string;
  categoryIds: string[];
  typeIds: string[];
};

export const assignUserCategoriesService = async (
  payload: AssignUserCategoriesPayload,
) => {
  try {
    const { userId, categoryIds, typeIds } = payload;

    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!Array.isArray(categoryIds)) {
      throw new HttpException(
        'categoryIds must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!Array.isArray(typeIds)) {
      throw new HttpException(
        'typeIds must be an array',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [existingCategories, existingTypes] = await Promise.all([
      categoryIds.length > 0
        ? db
            .select({ id: contentCategories.id })
            .from(contentCategories)
            .where(inArray(contentCategories.id, categoryIds))
        : Promise.resolve([]),
      typeIds.length > 0
        ? db
            .select({ id: contentTypes.id })
            .from(contentTypes)
            .where(inArray(contentTypes.id, typeIds))
        : Promise.resolve([]),
    ]);

    const foundCategoryIds = new Set(existingCategories.map((c) => c.id));
    const missingCategories = categoryIds.filter(
      (id) => !foundCategoryIds.has(id),
    );

    const foundTypeIds = new Set(existingTypes.map((t) => t.id));
    const missingTypes = typeIds.filter((id) => !foundTypeIds.has(id));

    if (missingCategories.length > 0 || missingTypes.length > 0) {
      const messages: string[] = [];
      if (missingCategories.length > 0) {
        messages.push(`Invalid category IDs: ${missingCategories.join(', ')}`);
      }
      if (missingTypes.length > 0) {
        messages.push(`Invalid type IDs: ${missingTypes.join(', ')}`);
      }
      throw new BadRequestException(messages.join(' | '));
    }

    const result = await db.transaction(async (tx) => {
      const [existingUserCategories, existingUserTypes] = await Promise.all([
        tx.query.userContentCategory.findFirst({
          where: eq(userContentCategory.userId, userId),
        }),
        tx.query.userContentTypes.findFirst({
          where: eq(userContentTypes.userId, userId),
        }),
      ]);

      const categoryResult = existingUserCategories
        ? await tx
            .update(userContentCategory)
            .set({
              categoryIds,
              updatedAt: new Date(),
            })
            .where(eq(userContentCategory.userId, userId))
            .returning()
        : await tx
            .insert(userContentCategory)
            .values({
              id: randomUUID(),
              userId,
              categoryIds,
            })
            .returning();

      const typeResult = existingUserTypes
        ? await tx
            .update(userContentTypes)
            .set({
              typesIds: typeIds,
              updatedAt: new Date(),
            })
            .where(eq(userContentTypes.userId, userId))
            .returning()
        : await tx
            .insert(userContentTypes)
            .values({
              id: randomUUID(),
              userId,
              typesIds: typeIds,
            })
            .returning();

      await tx
        .update(users)
        .set({
          status: 'active',
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return {
        categoryData: categoryResult[0],
        typeData: typeResult[0],
      };
    });

    return success(
      result,
      'User content preferences saved successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error;
    }
    logger.error('Error assigning user content preferences:', error);
    throw new HttpException(
      'Failed to assign user content preferences',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
