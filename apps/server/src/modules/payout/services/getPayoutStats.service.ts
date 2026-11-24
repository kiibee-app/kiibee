import { BadRequestException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorWallets } from 'src/database/schema';
import { fail, success } from 'src/utils/sendResponse';
import { logger } from 'src/logger/logger';
import { getCreatorPayoutSaleSummary } from './creatorPayoutFees';

export async function getPayoutStatsService(creatorId: string) {
  try {
    if (!creatorId)
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    const [wallet] = await db
      .select({
        amount: creatorWallets.amount,
        currency: creatorWallets.currency,
      })
      .from(creatorWallets)
      .where(eq(creatorWallets.creatorId, creatorId));
    const balance = Number(wallet?.amount ?? 0);
    if (!Number.isFinite(balance) || balance < 0)
      throw new Error('Invalid wallet balance');
    let counts: {
      saleCount: number | null;
      purchases: number | null;
      rentals: number | null;
      countError?: string;
    };
    try {
      counts = await getCreatorPayoutSaleSummary(creatorId, {
        currency: wallet?.currency ?? 'DKK',
        walletBalance: balance,
      });
    } catch (error) {
      if (!(error instanceof BadRequestException)) throw error;
      counts = {
        saleCount: null,
        purchases: null,
        rentals: null,
        countError: error.message,
      };
    }
    return success(
      { balance: `${balance.toFixed(2)} kr.`, ...counts },
      'Payout stats retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch payout stats:', error);
    return fail(
      'Failed to fetch payout stats',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
