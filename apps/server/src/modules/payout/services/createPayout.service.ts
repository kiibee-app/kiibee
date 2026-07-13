import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayouts,
  creatorPlans,
  creatorWallets,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

const PLATFORM_FEE_PERCENTAGES: Record<number, number> = {
  0: 0.4,
  99: 0.25,
  299: 0.18,
};

export const createPayoutService = async (
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
      notificationUrl: process.env.EPAY_PAYOUT_NOTIFICATION_URL!,

      attributes: {
        creatorId,
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

    const [payoutRecord] = await db
      .insert(creatorPayouts)
      .values({
        id: randomUUID(),
        creatorId,
        rawAmount: amount.toString(),
        amount: payoutAmount.toString(),
        currency: wallet.currency,
        status: STATUS.PENDING,
        creditNo: data?.creditNo ?? null,
        bankAccountInfo: data?.bankAccountInfo ?? null,
        cardNo: data?.cardNo ?? null,
        payoutDate: data?.payoutDate ? new Date(data.payoutDate) : null,
      })
      .returning();

    logger.info(`Payout created successfully: ${payoutRecord.id}`);

    return success(
      {
        ...data,
        payoutRecord,
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
