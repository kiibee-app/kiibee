import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { emailSubscribers } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { formatDisplayDate } from '../creator-users.helper';

export const getRegistrationsService = async (creatorId: string) => {
  try {
    const rows = await db
      .select({
        id: emailSubscribers.id,
        name: emailSubscribers.name,
        email: emailSubscribers.email,
        subscribedAt: emailSubscribers.subscribedAt,
      })
      .from(emailSubscribers)
      .where(
        and(
          eq(emailSubscribers.creatorId, creatorId),
          eq(emailSubscribers.isActive, true),
        ),
      )
      .orderBy(desc(emailSubscribers.subscribedAt));

    const registrations = rows.map((row) => ({
      id: row.id,
      name: row.name?.trim() || row.email,
      email: row.email,
      date: formatDisplayDate(row.subscribedAt),
    }));

    return success(
      registrations,
      'Registrations retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching registrations:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve registrations',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
