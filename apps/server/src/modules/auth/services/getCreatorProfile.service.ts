import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { users, creatorInfo, creatorBankAccounts } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCreatorProfileService = async (userId: string) => {
  try {
    const [user, creator, bankAccount] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).limit(1),

      db
        .select()
        .from(creatorInfo)
        .where(eq(creatorInfo.userId, userId))
        .limit(1),

      db
        .select()
        .from(creatorBankAccounts)
        .where(eq(creatorBankAccounts.creatorId, userId))
        .limit(1),
    ]);

    if (!user.length) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const responseData = {
      user: user[0] || null,
      creatorInfo: creator[0] || null,
      bankAccount: bankAccount[0] || null,
    };

    return success(
      responseData,
      'Creator profile fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator profile', {
      error,
      userId,
    });

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      'Failed to fetch creator profile',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
