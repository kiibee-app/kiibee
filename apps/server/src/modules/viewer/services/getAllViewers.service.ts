import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders, userProfiles, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, ORDER_TYPES, ROLE } from 'src/utils/constant';
import {
  DEFAULT_LIMIT,
  getSafePositiveInteger,
  MAX_LIMIT,
} from 'src/utils/pagination';
import { success } from 'src/utils/sendResponse';

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

export const getAllViewersService = async ({
  search,
  page,
  limit,
}: {
  search?: string;
  page?: number;
  limit?: number;
} = {}) => {
  try {
    const purchaseCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${orders.itemType} = ${ORDER_TYPES.PURCHASE}
          AND ${orders.status} = ${ORDER_STATUS.COMPLETED}
        THEN ${orders.id}
      END)::int
    `;
    const rentalCountSql = sql<number>`
      COUNT(DISTINCT CASE
        WHEN ${orders.itemType} = ${ORDER_TYPES.RENTAL}
          AND ${orders.status} = ${ORDER_STATUS.COMPLETED}
        THEN ${orders.id}
      END)::int
    `;

    const searchTerm = search?.trim();
    const searchPattern = searchTerm
      ? `%${escapeLikePattern(searchTerm)}%`
      : undefined;
    const requestedPage = getSafePositiveInteger(page, 1);
    const pageSize = getSafePositiveInteger(limit, DEFAULT_LIMIT, MAX_LIMIT);
    const filters = [
      eq(users.role, ROLE.VIEWER),
      eq(users.isDeleted, false),
    ];

    if (searchPattern) {
      const searchFilter = or(
        ilike(users.firstName, searchPattern),
        ilike(users.lastName, searchPattern),
        ilike(users.fullName, searchPattern),
        ilike(users.email, searchPattern),
      );

      if (searchFilter) {
        filters.push(searchFilter);
      }
    }

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${users.id})::int` })
      .from(users)
      .where(and(...filters));

    const totalItems = Number(totalResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * pageSize;

    const viewers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
        isEmailVerified: users.isEmailVerified,
        isActive: users.isActive,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        phone: userProfiles.phone,
        cvr: userProfiles.cvr,
        address: userProfiles.address,
        city: userProfiles.city,
        postalCode: userProfiles.postalCode,
        purchaseCount: purchaseCountSql,
        rentalCount: rentalCountSql,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .leftJoin(orders, eq(orders.userId, users.id))
      .where(and(...filters))
      .groupBy(
        users.id,
        userProfiles.phone,
        userProfiles.cvr,
        userProfiles.address,
        userProfiles.city,
        userProfiles.postalCode,
      )
      .orderBy(desc(users.createdAt))
      .limit(pageSize)
      .offset(offset);

    return success(
      {
        items: viewers.map((viewer) => ({
          ...viewer,
          purchaseCount: Number(viewer.purchaseCount ?? 0),
          rentalCount: Number(viewer.rentalCount ?? 0),
        })),
        pagination: {
          page: currentPage,
          limit: pageSize,
          totalItems,
          totalPages,
        },
      },
      'Viewers fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching viewers:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch viewers',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
