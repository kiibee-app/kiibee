import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, gte, lte, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  users,
  orders,
  mediaFiles,
  collections,
  payments,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import {
  formatDisplayDate,
  formatSalePrice,
  formatSaleType,
  formatUserDisplayName,
} from 'src/modules/creator-users/creator-users.helper';

export const exportRegistrationsService = async (
  creatorId: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    const conditions = [
      eq(orders.status, 'completed'),
      eq(payments.status, 'completed'),
      or(
        eq(mediaFiles.creatorId, creatorId),
        eq(collections.creatorId, creatorId),
      ),
    ];

    if (startDate) conditions.push(gte(orders.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(orders.createdAt, new Date(endDate)));

    const rows = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        itemType: orders.itemType,
        price: payments.amount,
        currency: orders.currency,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt));

    const data = rows.map((row) => ({
      Name: formatUserDisplayName({
        fullName: row.fullName,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
      }),
      Email: row.email,
      'Item Type': formatSaleType(row.itemType),
      Price: formatSalePrice(row.price, row.currency),
      Status: row.status,
      Date: formatDisplayDate(row.createdAt),
    }));

    return success(data, 'Export generated successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error generating registrations export:', error);

    if (error instanceof HttpException) throw error;

    throw new HttpException(
      'Failed to generate registrations export',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
