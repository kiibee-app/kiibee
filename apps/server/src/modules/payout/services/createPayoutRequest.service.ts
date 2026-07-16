import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorPayouts,
  creatorPlans,
  plans,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { STATUS } from 'src/utils/constant';
import { PLATFORM_FEE_PERCENTAGES } from 'src/utils/fees';
import { fail, success } from 'src/utils/sendResponse';

export const payoutRequestCalculationService = async (
  creatorId: string,
  amount: number,
  paymentMethodId: string,
) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!paymentMethodId) {
      return fail('Payment method ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!amount || amount <= 0) {
      return fail('Amount must be greater than 0', HttpStatus.BAD_REQUEST);
    }

    const [existingPendingRequest] = await db
      .select({
        id: creatorPayoutRequests.id,
      })
      .from(creatorPayoutRequests)
      .where(
        and(
          eq(creatorPayoutRequests.creatorId, creatorId),
          eq(creatorPayoutRequests.status, STATUS.PENDING),
        ),
      )
      .limit(1);

    if (existingPendingRequest) {
      return fail(
        'You already have a pending payout request',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [creatorPlan] = await db
      .select()
      .from(creatorPlans)
      .where(eq(creatorPlans.creatorId, creatorId))
      .limit(1);

    if (!creatorPlan) {
      return fail('Creator plan not found', HttpStatus.NOT_FOUND);
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorPlan.planId))
      .limit(1);

    if (!plan) {
      return fail('Plan not found', HttpStatus.NOT_FOUND);
    }

    const planPrice = Number(plan.price ?? 0);

    const platformFeePercentage =
      PLATFORM_FEE_PERCENTAGES[planPrice] ?? PLATFORM_FEE_PERCENTAGES[0];

    const processingFeePercentage = 0.05;

    const platformFee = Number((amount * platformFeePercentage).toFixed(2));

    const processingFee = Number((amount * processingFeePercentage).toFixed(2));

    const payableAmount = Number(
      (amount - platformFee - processingFee).toFixed(2),
    );

    const payoutId = randomUUID();
    const payoutRequestId = randomUUID();

    await db.transaction(async (trx) => {
      const [pendingRequest] = await trx
        .select({
          id: creatorPayoutRequests.id,
        })
        .from(creatorPayoutRequests)
        .where(
          and(
            eq(creatorPayoutRequests.creatorId, creatorId),
            eq(creatorPayoutRequests.status, STATUS.PENDING),
          ),
        )
        .limit(1);

      if (pendingRequest) {
        throw new HttpException(
          'You already have a pending payout request',
          HttpStatus.BAD_REQUEST,
        );
      }

      await trx.insert(creatorPayouts).values({
        id: payoutId,
        creatorId,
        rawAmount: amount.toString(),
        amount: payableAmount.toString(),
        currency: 'DKK',
        status: STATUS.PENDING,
      });

      await trx.insert(creatorPayoutRequests).values({
        id: payoutRequestId,
        creatorId,
        payoutId,
        paymentMethodId,
        rawAmount: amount.toString(),
        processingFee: processingFee.toString(),
        platformFee: platformFee.toString(),
        payableAmount: payableAmount.toString(),
        currency: 'DKK',
        status: STATUS.PENDING,
      });
    });

    return success(
      {
        payoutId,
        payoutRequestId,
        amount,
        planPrice,
        platformFeePercentage,
        processingFeePercentage,
        platformFee,
        processingFee,
        payableAmount,
      },
      'Payout request created successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to create payout request', error);

    throw new HttpException(
      'Failed to create payout request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
