import { HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { userContentCategory } from 'src/database/schema/users/userContentCategories.shema';
import { userContentTypes } from 'src/database/schema/users/userContentTypes.shema';
import { success, fail } from 'src/utils/sendResponse';
import { randomUUID } from 'crypto';
import { users } from 'src/database/schema/users/users.schema';

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
      return fail('User ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!Array.isArray(categoryIds)) {
      return fail('categoryIds must be an array', HttpStatus.BAD_REQUEST);
    }

    if (!Array.isArray(typeIds)) {
      return fail('typeIds must be an array', HttpStatus.BAD_REQUEST);
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
      HttpStatus.OK,
    );
  } catch (error) {
    console.error('Error assigning user content preferences:', error);
    return fail(
      'Failed to assign user content preferences',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
