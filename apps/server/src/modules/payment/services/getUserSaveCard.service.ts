import { HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { userCardInfo } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { eq, desc } from 'drizzle-orm';
import { logger } from 'src/logger/logger';

export const getUserSavedCard = async (userId: string) => {
  try {
    if (!userId) {
      return fail('userId must be provided', HttpStatus.BAD_REQUEST);
    }
    const savedCards = await db
      .select()
      .from(userCardInfo)
      .where(eq(userCardInfo.userId, userId))
      .orderBy(desc(userCardInfo.createdAt));

    if (!savedCards || savedCards.length === 0) {
      return success(
        null,
        'No saved cards found for the user',
        HttpStatus.CREATED,
      );
    }
    return success(
      savedCards,
      'Saved cards retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching user saved cards:', error);
    return fail(
      'Error fetching user saved cards',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
