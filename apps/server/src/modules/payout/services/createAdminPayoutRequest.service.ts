import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorBankAccounts,
  creatorWallets,
  userCardInfo,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { MIN_PAYOUT_AMOUNT } from 'src/utils/fees';
import { createPayoutService } from './createPayout.service';
import { payoutRequestCalculationService } from './createPayoutRequest.service';

async function paymentMethodBelongsToCreator(
  creatorId: string,
  paymentMethodId: string,
) {
  const [[bankAccount], [card]] = await Promise.all([
    db
      .select({ id: creatorBankAccounts.id })
      .from(creatorBankAccounts)
      .where(
        and(
          eq(creatorBankAccounts.creatorId, creatorId),
          eq(creatorBankAccounts.id, paymentMethodId),
        ),
      )
      .limit(1),
    db
      .select({ id: userCardInfo.id })
      .from(userCardInfo)
      .where(
        and(
          eq(userCardInfo.userId, creatorId),
          eq(userCardInfo.paymentMethodId, paymentMethodId),
        ),
      )
      .limit(1),
  ]);

  return Boolean(bankAccount || card);
}

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

    const belongsToCreator = await paymentMethodBelongsToCreator(
      creatorId,
      paymentMethodId,
    );

    if (!belongsToCreator) {
      return fail(
        'Payment method does not belong to this creator',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [wallet] = await db
      .select()
      .from(creatorWallets)
      .where(eq(creatorWallets.creatorId, creatorId))
      .limit(1);

    if (!wallet) {
      return fail('Creator wallet not found', HttpStatus.NOT_FOUND);
    }

    const walletBalance = Number(wallet.amount);

    if (!Number.isFinite(walletBalance) || walletBalance <= MIN_PAYOUT_AMOUNT) {
      return fail(
        `Insufficient wallet balance. Amount must be greater than ${MIN_PAYOUT_AMOUNT} DKK`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payoutAmount =
      amount !== undefined && amount !== null ? Number(amount) : walletBalance;

    if (!Number.isFinite(payoutAmount) || payoutAmount <= MIN_PAYOUT_AMOUNT) {
      return fail(
        `Amount must be greater than ${MIN_PAYOUT_AMOUNT} DKK`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (payoutAmount > walletBalance) {
      return fail(
        'Amount exceeds available wallet balance',
        HttpStatus.BAD_REQUEST,
      );
    }

    const requestResult = await payoutRequestCalculationService(
      creatorId,
      payoutAmount,
      paymentMethodId,
    );

    const { payoutId, payoutRequestId, ...feeBreakdown } = requestResult.data;

    if (!processImmediately) {
      return success(
        {
          ...feeBreakdown,
          payoutId,
          payoutRequestId,
          requestCreated: true,
          processed: false,
        },
        'Payout request created successfully',
        HttpStatus.CREATED,
      );
    }

    try {
      const processResult = await createPayoutService(
        creatorId,
        payoutAmount,
        payoutId,
        paymentMethodId,
      );

      return success(
        {
          ...feeBreakdown,
          ...processResult.data,
          payoutId,
          payoutRequestId,
          requestCreated: true,
          processed: true,
        },
        'Payout request created and submitted successfully',
        HttpStatus.CREATED,
      );
    } catch (processError) {
      let processMessage = 'Failed to submit payout to payment provider';

      if (processError instanceof HttpException) {
        const response = processError.getResponse();
        if (typeof response === 'string') {
          processMessage = response;
        } else if (
          response &&
          typeof response === 'object' &&
          'message' in response
        ) {
          const message = (response as { message?: string | string[] }).message;
          processMessage = Array.isArray(message)
            ? message.join(', ')
            : (message ?? processError.message);
        } else {
          processMessage = processError.message;
        }
      }

      logger.error('Admin payout request created but processing failed', {
        creatorId,
        payoutRequestId,
        processError,
      });

      return success(
        {
          ...feeBreakdown,
          payoutId,
          payoutRequestId,
          requestCreated: true,
          processed: false,
          processError: processMessage,
        },
        `Payout request created, but processing failed: ${processMessage}`,
        HttpStatus.CREATED,
      );
    }
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to create admin payout request', error);

    throw new HttpException(
      'Failed to create admin payout request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
