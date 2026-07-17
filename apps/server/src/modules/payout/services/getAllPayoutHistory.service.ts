import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, or, sql, type SQL } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorPayouts,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import {
  DEFAULT_LIMIT,
  getSafePositiveInteger,
  MAX_LIMIT,
} from 'src/utils/pagination';
import { SettlementHistoryQueryDto } from '../dto/payout.dto';

export const getAllPayoutHistoryService = async (
  query?: SettlementHistoryQueryDto,
) => {
  try {
    const requestedPage = getSafePositiveInteger(Number(query?.page), 1);
    const pageSize = getSafePositiveInteger(
      Number(query?.limit),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const filters: SQL[] = [];

    if (query?.status) {
      const filterStatus = (query.status.charAt(0).toUpperCase() +
        query.status.slice(1)) as 'pending' | 'completed' | 'rejected';
      filters.push(eq(creatorPayouts.status, filterStatus));
    }

    if (query?.search) {
      const searchPattern = `%${query.search}%`;
      const searchFilter = or(
        ilike(creatorPayouts.creditNo, searchPattern),
        ilike(creatorPayouts.cardNo, searchPattern),
        ilike(users.email, searchPattern),
        sql`${creatorPayouts.amount}::text ILIKE ${searchPattern}`,
      );

      if (searchFilter) {
        filters.push(searchFilter);
      }
    }

    const where = filters.length ? and(...filters) : undefined;

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(creatorPayouts)
      .leftJoin(users, eq(creatorPayouts.creatorId, users.id))
      .leftJoin(
        creatorPayoutRequests,
        eq(creatorPayouts.id, creatorPayoutRequests.payoutId),
      )
      .where(where);

    const totalItems = Number(totalResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * pageSize;

    const rows = await db
      .select({
        id: creatorPayouts.id,
        creatorId: creatorPayouts.creatorId,
        creatorEmail: users.email,
        creatorFullName: users.fullName,
        payoutRequestId: creatorPayoutRequests.id,
        rawAmount: creatorPayouts.rawAmount,
        amount: creatorPayouts.amount,
        currency: creatorPayouts.currency,
        status: creatorPayouts.status,
        creditNo: creatorPayouts.creditNo,
        cardNo: creatorPayouts.cardNo,
        bankAccountInfo: creatorPayouts.bankAccountInfo,
        payoutDate: creatorPayouts.payoutDate,
        paymentMethodId: creatorPayoutRequests.paymentMethodId,
        processingFee: creatorPayoutRequests.processingFee,
        platformFee: creatorPayoutRequests.platformFee,
        payableAmount: creatorPayoutRequests.payableAmount,
        createdAt: creatorPayouts.createdAt,
      })
      .from(creatorPayouts)
      .leftJoin(users, eq(creatorPayouts.creatorId, users.id))
      .leftJoin(
        creatorPayoutRequests,
        eq(creatorPayouts.id, creatorPayoutRequests.payoutId),
      )
      .where(where)
      .orderBy(desc(creatorPayouts.createdAt))
      .limit(pageSize)
      .offset(offset);

    const items = rows.map((row) => ({
      id: row.id,
      creatorId: row.creatorId,
      creatorEmail: row.creatorEmail,
      creatorFullName: row.creatorFullName,
      payoutRequestId: row.payoutRequestId,
      rawAmount: row.rawAmount,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      creditNo: row.creditNo,
      cardNo: row.cardNo,
      bankAccountInfo: row.bankAccountInfo,
      payoutDate: row.payoutDate,
      paymentMethodId: row.paymentMethodId,
      processingFee: row.processingFee,
      platformFee: row.platformFee,
      payableAmount: row.payableAmount,
      createdAt: row.createdAt,
    }));

    return success(
      {
        items,
        pagination: {
          page: currentPage,
          limit: pageSize,
          totalItems,
          totalPages,
        },
      },
      'All payout history retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to fetch all payout history', error);

    throw new HttpException(
      'Failed to fetch all payout history',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
