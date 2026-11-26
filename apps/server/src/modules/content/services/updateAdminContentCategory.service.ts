import { BadRequestException, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from 'src/database/db';
import {
  contentCategories,
  mediaFileCategories,
  mediaFiles,
} from 'src/database/schema';
import { success } from 'src/utils/sendResponse';

export async function updateAdminContentCategoryService(
  contentId: string,
  categoryId: string,
) {
  return db.transaction(async (tx) => {
    const [content] = await tx
      .select({ id: mediaFiles.id })
      .from(mediaFiles)
      .where(and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)))
      .limit(1)
      .for('update');
    if (!content) throw new NotFoundException('Content not found');
    const [category] = await tx
      .select({ id: contentCategories.id })
      .from(contentCategories)
      .where(
        and(
          eq(contentCategories.id, categoryId),
          eq(contentCategories.isActive, true),
        ),
      )
      .limit(1);
    if (!category) throw new BadRequestException('Invalid category selected');
    // Replace every old association so a content item belongs to exactly one category.
    await tx
      .delete(mediaFileCategories)
      .where(eq(mediaFileCategories.mediaFileId, contentId));
    await tx
      .insert(mediaFileCategories)
      .values({ id: randomUUID(), mediaFileId: contentId, categoryId });
    await tx
      .update(mediaFiles)
      .set({ updatedAt: new Date() })
      .where(eq(mediaFiles.id, contentId));
    return success(
      { contentId, categoryId },
      'Content category updated successfully',
    );
  });
}
