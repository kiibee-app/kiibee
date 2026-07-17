import { HttpException, HttpStatus } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPayoutRequests, creatorPayouts } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { success } from 'src/utils/sendResponse';
import { SettlementHistoryQueryDto } from '../dto/payout.dto';

export const getPayoutHistoryByCreatorIdService = async (
  creatorId: string,
  query?: SettlementHistoryQueryDto,
) => {
  try {
    if (!creatorId) {
      throw new HttpException('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    const rows = await db
      .select({
        id: creatorPayouts.id,
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
      .leftJoin(
        creatorPayoutRequests,
        eq(creatorPayouts.id, creatorPayoutRequests.payoutId),
      )
      .where(eq(creatorPayouts.creatorId, creatorId))
      .orderBy(desc(creatorPayouts.createdAt));

    let history = rows.map((row) => ({
      id: row.id,
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

    if (query?.status) {
      const filterStatus =
        query.status.charAt(0).toUpperCase() + query.status.slice(1);
      history = history.filter((h) => h.status === filterStatus);
    }

    if (query?.search) {
      const search = query.search.toLowerCase();
      history = history.filter(
        (h) =>
          h.creditNo?.toLowerCase().includes(search) ||
          h.cardNo?.toLowerCase().includes(search) ||
          h.amount?.toString().toLowerCase().includes(search),
      );
    }

    return success(
      history,
      'Payout history retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to fetch payout history', error);

    throw new HttpException(
      'Failed to fetch payout history',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
