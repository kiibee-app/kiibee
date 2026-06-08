import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { emailSubscribers } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const deleteRegistrationService = async (
  creatorId: string,
  id: string,
) => {
  try {
    const [deleted] = await db
      .delete(emailSubscribers)
      .where(
        and(
          eq(emailSubscribers.id, id),
          eq(emailSubscribers.creatorId, creatorId),
        ),
      )
      .returning({ id: emailSubscribers.id });

    if (!deleted) {
      fail('Registration not found', HttpStatus.NOT_FOUND);
    }

    return success(null, 'Registration deleted successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error deleting registration:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to delete registration',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
