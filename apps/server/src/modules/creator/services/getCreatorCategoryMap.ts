import { and, eq, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentCategories,
  mediaFileCategories,
  mediaFiles,
  userContentCategory,
} from 'src/database/schema';
import { CONTENT_VISIBILITY } from 'src/utils/constant';

export async function getCreatorCategoryMap(
  creatorIds: string[],
): Promise<Map<string, string>> {
  const categoryByCreatorId = new Map<string, string>();
  const uniqueCreatorIds = [...new Set(creatorIds.filter(Boolean))];

  if (uniqueCreatorIds.length === 0) {
    return categoryByCreatorId;
  }

  const userCategories = await db
    .select({
      userId: userContentCategory.userId,
      categoryIds: userContentCategory.categoryIds,
    })
    .from(userContentCategory)
    .where(inArray(userContentCategory.userId, uniqueCreatorIds));

  const selectedCategoryIds = [
    ...new Set(userCategories.flatMap((row) => row.categoryIds || [])),
  ];

  const categoryNameById = new Map<string, string>();

  if (selectedCategoryIds.length > 0) {
    const categories = await db
      .select({
        id: contentCategories.id,
        name: contentCategories.name,
      })
      .from(contentCategories)
      .where(inArray(contentCategories.id, selectedCategoryIds));

    for (const category of categories) {
      categoryNameById.set(category.id, category.name);
    }
  }

  for (const row of userCategories) {
    const categoryName = (row.categoryIds || [])
      .map((id) => categoryNameById.get(id))
      .find((name): name is string => Boolean(name));

    if (categoryName) {
      categoryByCreatorId.set(row.userId, categoryName);
    }
  }

  const missingCreatorIds = uniqueCreatorIds.filter(
    (id) => !categoryByCreatorId.has(id),
  );

  if (missingCreatorIds.length === 0) {
    return categoryByCreatorId;
  }

  const contentCategoriesForCreators = await db
    .select({
      creatorId: mediaFiles.creatorId,
      categoryName: contentCategories.name,
    })
    .from(mediaFiles)
    .innerJoin(
      mediaFileCategories,
      eq(mediaFileCategories.mediaFileId, mediaFiles.id),
    )
    .innerJoin(
      contentCategories,
      eq(contentCategories.id, mediaFileCategories.categoryId),
    )
    .where(
      and(
        inArray(mediaFiles.creatorId, missingCreatorIds),
        eq(mediaFiles.isDeleted, false),
        eq(mediaFiles.isPublished, true),
        eq(mediaFiles.visibility, CONTENT_VISIBILITY.PUBLIC),
      ),
    );

  for (const row of contentCategoriesForCreators) {
    if (
      row.creatorId &&
      row.categoryName &&
      !categoryByCreatorId.has(row.creatorId)
    ) {
      categoryByCreatorId.set(row.creatorId, row.categoryName);
    }
  }

  return categoryByCreatorId;
}
