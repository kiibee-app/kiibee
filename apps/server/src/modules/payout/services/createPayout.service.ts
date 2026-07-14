import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPlans,
  creatorWallets,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { PLATFORM_FEE_PERCENTAGES } from 'src/utils/fees';
import { fail, success } from 'src/utils/sendResponse';

export const createPayoutService = async (
  creatorId: string,
  amount: number,
  payoutId: string,
  paymentMethodId: string,
) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!paymentMethodId) {
      return fail('Payment method ID is required', HttpStatus.BAD_REQUEST);
    }

    if (amount <= 0) {
      return fail('Amount must be greater than 0', HttpStatus.BAD_REQUEST);
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

    if (walletBalance < amount) {
      return fail('Insufficient wallet balance', HttpStatus.BAD_REQUEST);
    }

    const processingFee = Number((amount * 0.05).toFixed(2));

    const platformFeePercentage =
      PLATFORM_FEE_PERCENTAGES[Number(plan.price)] ?? 0.02;

    const platformFee = Number((amount * platformFeePercentage).toFixed(2));

    const payoutAmount = Number(
      (amount - processingFee - platformFee).toFixed(2),
    );

    if (payoutAmount < 1) {
      return fail('Minimum payout amount is 1 DKK', HttpStatus.BAD_REQUEST);
    }

    const payload = {
      amount: Math.round(payoutAmount * 100),

      currency: wallet.currency,
      pointOfSaleId: process.env.EPAY_POINT_OF_SALE_ID!,
      paymentMethodId,
      reference: payoutId,
      notificationUrl: process.env.EPAY_PAYOUT_NOTIFICATION_URL!,

      attributes: {
        creatorId,
        payoutId,
      },

      customer: {
        firstName: creator.firstName,
        lastName: creator.lastName,
        ip: '127.0.0.1',
      },
    };

    logger.info('Creating payout', payload);

    const response = await fetch(
      `${process.env.EPAY_BASE_URL}/public/api/v1/payout`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    let data: any = {};

    try {
      data = await response.json();
    } catch (err) {
      logger.error('Unable to parse ePay response', err);
    }

    if (!response.ok) {
      logger.error('ePay payout failed', {
        status: response.status,
        data,
      });

      return fail(data?.message ?? 'Failed to create payout', response.status);
    }

    logger.info(`Payout created successfully: ${data.id}`);

    return success(
      {
        ...data,
        amount,
        payoutAmount,
        processingFee,
        platformFee,
      },
      'Payout created successfully',
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to create payout', error);

    throw new HttpException(
      'Failed to create payout',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
