import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, creatorWallets, plans } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { PLATFORM_FEE_PERCENTAGES, MIN_PAYOUT_AMOUNT } from 'src/utils/fees';
import { success } from 'src/utils/sendResponse';

export const payoutCalculationService = async (creatorId: string) => {
  try {
    if (!creatorId) {
      throw new HttpException('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    const [[creatorCurrentPlan], [wallet]] = await Promise.all([
      db
        .select()
        .from(creatorPlans)
        .where(eq(creatorPlans.creatorId, creatorId))
        .limit(1),

      db
        .select()
        .from(creatorWallets)
        .where(eq(creatorWallets.creatorId, creatorId))
        .limit(1),
    ]);

    if (!creatorCurrentPlan) {
      throw new HttpException('Creator plan not found', HttpStatus.NOT_FOUND);
    }

    if (!wallet) {
      throw new HttpException('Creator wallet not found', HttpStatus.NOT_FOUND);
    }

    const walletBalance = Number(wallet.amount);

    if (Number.isNaN(walletBalance)) {
      throw new HttpException(
        'Invalid wallet balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (walletBalance <= MIN_PAYOUT_AMOUNT) {
      throw new HttpException(
        `Insufficient wallet balance. Amount must be greater than ${MIN_PAYOUT_AMOUNT} DKK`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const amount = walletBalance;

    const [planInfo] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorCurrentPlan.planId))
      .limit(1);

    if (!planInfo) {
      throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    }

    const planPrice = Number(planInfo.price ?? 0);

    const platformFeePercentage =
      PLATFORM_FEE_PERCENTAGES[planPrice] ?? PLATFORM_FEE_PERCENTAGES[0];

    const processingFeePercentage = 0.05;

    const platformFee = Number((amount * platformFeePercentage).toFixed(2));

    const processingFee = Number((amount * processingFeePercentage).toFixed(2));

    const payableAmount = Number(
      (amount - platformFee - processingFee).toFixed(2),
    );

    const response = {
      amount,
      walletBalance,
      walletCurrency: wallet.currency,
      planPrice,
      platformFeePercentage,
      processingFeePercentage,
      platformFee,
      processingFee,
      payableAmount,
    };

    return success(response, 'Payout calculation successful', HttpStatus.OK);
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to calculate payout', error);

    throw new HttpException(
      'Failed to calculate payout',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
