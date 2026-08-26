import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const updateCreatorVisibilityService = async (
  creatorId: string,
  isHidden: boolean,
) => {
  try {
    const [creator] = await db
      .select({
        id: users.id,
        isHidden: users.isHidden,
      })
      .from(users)
      .where(
        and(
          eq(users.id, creatorId),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
      .limit(1);

    if (!creator) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    if (creator.isHidden === isHidden) {
      return success(
        { id: creator.id, isHidden: creator.isHidden },
        isHidden ? 'Creator is already hidden' : 'Creator is already visible',
      );
    }

    const [updated] = await db
      .update(users)
      .set({ isHidden, updatedAt: new Date() })
      .where(eq(users.id, creatorId))
      .returning({
        id: users.id,
        isHidden: users.isHidden,
      });

    return success(
      updated,
      isHidden
        ? 'Creator hidden successfully'
        : 'Creator unhidden successfully',
    );
  } catch (error) {
    logger.error('Error updating creator visibility:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to update creator visibility',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
