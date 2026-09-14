import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorPayouts,
  creatorPlans,
  creatorWallets,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, STATUS } from 'src/utils/constant';
import { PLATFORM_FEE_PERCENTAGES, MIN_PAYOUT_AMOUNT } from 'src/utils/fees';
import { fail, success } from 'src/utils/sendResponse';
import { approvePayoutRequestService } from './approvePayoutRequest.service';

export const createAdminPayoutRequestService = async (
  creatorId: string,
  paymentMethodId: string,
  amount?: number,
  processImmediately = true,
) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!paymentMethodId) {
      return fail('Payment method ID is required', HttpStatus.BAD_REQUEST);
    }

    const [[creator], [creatorPlan], [wallet]] = await Promise.all([
      db.select().from(users).where(eq(users.id, creatorId)).limit(1),
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

    if (!creator) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    if (!creatorPlan) {
      return fail('Creator plan not found', HttpStatus.NOT_FOUND);
    }

    if (!wallet) {
      return fail('Creator wallet not found', HttpStatus.NOT_FOUND);
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorPlan.planId))
      .limit(1);

    if (!plan) {
      return fail('Plan not found', HttpStatus.NOT_FOUND);
    }

    const walletBalance = Number(wallet.amount);

    if (Number.isNaN(walletBalance)) {
      logger.error(
        `Invalid wallet balance for creator ${creatorId}: ${wallet.amount}`,
      );

      return fail('Invalid wallet balance', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const requestedAmount = amount ?? walletBalance;

    if (!requestedAmount || requestedAmount <= MIN_PAYOUT_AMOUNT) {
      return fail(
        `Amount must be greater than ${MIN_PAYOUT_AMOUNT} DKK`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (walletBalance < requestedAmount) {
      return fail('Insufficient wallet balance', HttpStatus.BAD_REQUEST);
    }

    const planPrice = Number(plan.price ?? 0);

    const platformFeePercentage =
      PLATFORM_FEE_PERCENTAGES[planPrice] ?? PLATFORM_FEE_PERCENTAGES[0];

    const processingFeePercentage = 0.05;

    const platformFee = Number(
      (requestedAmount * platformFeePercentage).toFixed(2),
    );

    const processingFee = Number(
      (requestedAmount * processingFeePercentage).toFixed(2),
    );

    const payableAmount = Number(
      (requestedAmount - platformFee - processingFee).toFixed(2),
    );

    if (payableAmount < 1) {
      return fail('Minimum net payout amount is 1 DKK', HttpStatus.BAD_REQUEST);
    }

    const payoutId = randomUUID();
    const payoutRequestId = randomUUID();

    const baseResponseData = {
      payoutId,
      payoutRequestId,
      amount: requestedAmount,
      planPrice,
      platformFeePercentage,
      processingFeePercentage,
      platformFee,
      processingFee,
      payableAmount,
    };

    await db.transaction(async (trx) => {
      await trx.insert(creatorPayouts).values({
        id: payoutId,
        creatorId,
        rawAmount: requestedAmount.toString(),
        amount: payableAmount.toString(),
        currency: wallet.currency ?? 'DKK',
        status: STATUS.PENDING,
      });

      await trx.insert(creatorPayoutRequests).values({
        id: payoutRequestId,
        creatorId,
        payoutId,
        paymentMethodId,
        rawAmount: requestedAmount.toString(),
        processingFee: processingFee.toString(),
        platformFee: platformFee.toString(),
        payableAmount: payableAmount.toString(),
        currency: wallet.currency ?? 'DKK',
        status: STATUS.PENDING,
      });
    });

    if (!processImmediately) {
      logger.info(`Admin payout request created: ${payoutRequestId}`);
      return success(
        {
          ...baseResponseData,
          requestCreated: true,
          processed: false,
          status: STATUS.PENDING,
        },
        'Payout request created successfully',
        HttpStatus.CREATED,
      );
    }

    const approval = await approvePayoutRequestService(payoutRequestId);

    if (!approval.success) {
      return approval;
    }

    logger.info(`Admin payout completed: ${payoutRequestId}`);
    return success(
      {
        ...baseResponseData,
        requestCreated: true,
        processed: true,
        status: ORDER_STATUS.COMPLETED,
      },
      'Payout created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to create admin payout', error);

    throw new HttpException(
      'Failed to create admin payout',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
