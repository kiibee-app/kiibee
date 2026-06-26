import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { userCardInfo } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const setDefaultCard = async (userId: string, cardId: string) => {
  try {
    if (!userId || !cardId) {
      return fail('userId and cardId must be provided', HttpStatus.BAD_REQUEST);
    }

    const [card] = await db
      .select()
      .from(userCardInfo)
      .where(and(eq(userCardInfo.id, cardId), eq(userCardInfo.userId, userId)));

    if (!card) {
      return fail('Card not found', HttpStatus.NOT_FOUND);
    }

    await db.transaction(async (tx) => {
      await tx
        .update(userCardInfo)
        .set({ isDefault: false })
        .where(eq(userCardInfo.userId, userId));
      await tx
        .update(userCardInfo)
        .set({ isDefault: true })
        .where(eq(userCardInfo.id, cardId));
    });

    return success(null, 'Default card updated successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error setting default card:', error);
    return fail('Error setting default card', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
