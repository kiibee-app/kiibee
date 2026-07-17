import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  mediaFiles,
  orders,
  payments,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import {
  DEFAULT_LIMIT,
  getSafePositiveInteger,
  MAX_LIMIT,
} from 'src/utils/pagination';
import {
  formatDisplayDate,
  formatSalePrice,
  formatSaleType,
  formatUserDisplayName,
} from '../creator-users.helper';

export const getSalesService = async (
  creatorId: string,
  {
    search,
    page,
    limit,
  }: { search?: string; page?: number; limit?: number } = {},
) => {
  try {
    const searchTerm = search?.trim();
    const searchPattern = searchTerm ? `%${searchTerm}%` : undefined;
    const requestedPage = getSafePositiveInteger(page, 1);
    const pageSize = getSafePositiveInteger(limit, DEFAULT_LIMIT, MAX_LIMIT);

    const baseConditions = [
      eq(orders.status, ORDER_STATUS.COMPLETED),
      eq(payments.status, ORDER_STATUS.COMPLETED),
      or(
        eq(mediaFiles.creatorId, creatorId),
        eq(collections.creatorId, creatorId),
      ),
    ];

    if (searchPattern) {
      baseConditions.push(
        or(
          ilike(users.firstName, searchPattern),
          ilike(users.lastName, searchPattern),
          ilike(users.fullName, searchPattern),
        ),
      );
    }

    const whereClause = and(...baseConditions);

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(whereClause);

    const totalItems = Number(totalResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * pageSize;

    const rows = await db
      .select({
        id: orders.id,
        price: payments.amount,
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
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(whereClause)
      .orderBy(desc(orders.createdAt))
      .limit(pageSize)
      .offset(offset);

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

    return success(
      {
        sales,
        pagination: {
          page: currentPage,
          limit: pageSize,
          totalItems,
          totalPages,
        },
      },
      'Sales retrieved successfully',
      HttpStatus.OK,
    );
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
