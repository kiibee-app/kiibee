import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import { collections, mediaFiles, orders, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import {
  formatDisplayDate,
  formatSalePrice,
  formatSaleType,
  formatUserDisplayName,
} from '../creator-users.helper';

export const getSalesService = async (creatorId: string) => {
  try {
    const rows = await db
      .select({
        id: orders.id,
        price: orders.price,
        currency: orders.currency,
        itemType: orders.itemType,
        createdAt: orders.createdAt,
        buyerEmail: users.email,
        buyerFullName: users.fullName,
        buyerFirstName: users.firstName,
        buyerLastName: users.lastName,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(
        and(
          eq(orders.status, ORDER_STATUS.COMPLETED),
          or(
            eq(mediaFiles.creatorId, creatorId),
            eq(collections.creatorId, creatorId),
          ),
        ),
      )
      .orderBy(desc(orders.createdAt));

    const sales = rows.map((row) => ({
      id: row.id,
      name: formatUserDisplayName({
        fullName: row.buyerFullName,
        firstName: row.buyerFirstName,
        lastName: row.buyerLastName,
        email: row.buyerEmail,
      }),
      email: row.buyerEmail,
      price: formatSalePrice(row.price, row.currency),
      type: formatSaleType(row.itemType),
      date: formatDisplayDate(row.createdAt),
    }));

    return success(sales, 'Sales retrieved successfully', HttpStatus.OK);
  } catch (error) {
    logger.error('Error fetching sales:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to retrieve sales',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
