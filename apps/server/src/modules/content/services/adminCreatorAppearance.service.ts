import { BadRequestException, NotFoundException } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from 'src/database/db';
import {
  contentCategories,
  userContentCategory,
  users,
} from 'src/database/schema';
import { success } from 'src/utils/sendResponse';
import { ROLE } from 'src/utils/constant';
import { AdminContentAppearanceDto } from '../dto/adminContentAppearance.dto';
import {
  getContentAppearanceService,
  writeContentAppearance,
} from './contentAppearance.service';

export async function getAdminCreatorAppearanceService(creatorId: string) {
  const result = await getContentAppearanceService(creatorId);
  if (!result.success) return result;
  const [selection] = await db
    .select({ categoryIds: userContentCategory.categoryIds })
    .from(userContentCategory)
    .where(eq(userContentCategory.userId, creatorId))
    .limit(1);
  return success(
    { ...result.data, categoryIds: selection?.categoryIds ?? [] },
    'Creator settings fetched successfully',
  );
}

export async function updateAdminCreatorAppearanceService(
  creatorId: string,
  dto: AdminContentAppearanceDto,
) {
  const appearance = await db.transaction(async (tx) => {
    // Serialize category edits, including the first assignment where no category row exists yet.
    const [creator] = await tx
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.id, creatorId),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
      .limit(1)
      .for('update');
    if (!creator) throw new NotFoundException('Creator not found');
    if (dto.categoryIds !== undefined) {
      if (
        !Array.isArray(dto.categoryIds) ||
        dto.categoryIds.some((id) => typeof id !== 'string')
      )
        throw new BadRequestException(
          'categoryIds must be an array of strings',
        );
      if (dto.categoryIds.length > 1)
        throw new BadRequestException('Choose one creator category');
      const ids = [...new Set(dto.categoryIds)];
      const categories = ids.length
        ? await tx
            .select({ id: contentCategories.id })
            .from(contentCategories)
            .where(inArray(contentCategories.id, ids))
        : [];
      if (categories.length !== ids.length)
        throw new BadRequestException('Invalid category selected');
      const [existing] = await tx
        .select({ id: userContentCategory.id })
        .from(userContentCategory)
        .where(eq(userContentCategory.userId, creatorId))
        .limit(1);
      if (existing) {
        await tx
          .update(userContentCategory)
          .set({ categoryIds: ids, updatedAt: new Date() })
          .where(eq(userContentCategory.userId, creatorId));
      } else {
        await tx
          .insert(userContentCategory)
          .values({ id: randomUUID(), userId: creatorId, categoryIds: ids });
      }
    }
    return writeContentAppearance(tx, creatorId, dto);
  });
  return success(appearance, 'Creator settings updated successfully');
}
