import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorBankAccounts,
  creatorPayoutRequests,
  creatorPayouts,
  creatorWallets,
  userCardInfo,
} from 'src/database/schema';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { logger } from 'src/logger/logger';
import { runInBackground } from 'src/utils/backgroundTask';
import { ORDER_STATUS } from 'src/utils/constant';
import { MIN_PAYOUT_AMOUNT } from 'src/utils/fees';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { fail, success } from 'src/utils/sendResponse';
import { createPayoutService } from './createPayout.service';
import { payoutRequestCalculationService } from './createPayoutRequest.service';
import { payoutInfoService } from './payoutInfo.service';

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

function getProcessErrorMessage(processError: unknown) {
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

  return processMessage;
}

async function rollbackAdminPayout(payoutId: string, payoutRequestId: string) {
  await db.transaction(async (tx) => {
    await tx
      .delete(creatorPayoutRequests)
      .where(eq(creatorPayoutRequests.id, payoutRequestId));
    await tx.delete(creatorPayouts).where(eq(creatorPayouts.id, payoutId));
  });
}

/** Completes payout + debits wallet. Returns false if webhook already completed it. */
async function completeDirectAdminPayout(
  creatorId: string,
  payoutId: string,
  payoutRequestId: string,
  rawAmount: number,
): Promise<boolean> {
  const now = new Date();

  return db.transaction(async (tx) => {
    const [updatedPayout] = await tx
      .update(creatorPayouts)
      .set({
        status: ORDER_STATUS.COMPLETED,
        payoutDate: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(creatorPayouts.id, payoutId),
          eq(creatorPayouts.status, ORDER_STATUS.PENDING),
        ),
      )
      .returning({ id: creatorPayouts.id });

    if (!updatedPayout) {
      // Webhook already finalized this payout — ensure request is not left pending.
      await tx
        .update(creatorPayoutRequests)
        .set({
          status: ORDER_STATUS.COMPLETED,
          updatedAt: now,
        })
        .where(
          and(
            eq(creatorPayoutRequests.id, payoutRequestId),
            eq(creatorPayoutRequests.status, ORDER_STATUS.PENDING),
          ),
        );

      return false;
    }

    await tx
      .update(creatorPayoutRequests)
      .set({
        status: ORDER_STATUS.COMPLETED,
        updatedAt: now,
      })
      .where(eq(creatorPayoutRequests.id, payoutRequestId));

    await tx
      .update(creatorWallets)
      .set({
        amount: sql`${creatorWallets.amount} - ${rawAmount}`,
        updatedAt: now,
      })
      .where(eq(creatorWallets.creatorId, creatorId));

    return true;
  });
}

function sendApprovedPayoutEmail(payoutId: string) {
  runInBackground(
    (async () => {
      const payoutInfo = await payoutInfoService(payoutId);

      await sendTemplateEmail({
        to: payoutInfo.creator.email ?? '',
        subject: mailSubject.APPROVED_PAYOUT,
        templateName: templateName.APPROVED_PAYOUT,
        variables: {
          creator: {
            fullName: payoutInfo.creator.fullName,
          },
          payoutId: payoutInfo.payoutId,
          rawAmount: payoutInfo.rawAmount,
          processingFee: payoutInfo.processingFee,
          platformFee: payoutInfo.platformFee,
          payableAmount: payoutInfo.payableAmount,
          currency: payoutInfo.currency,
        },
      });
    })(),
  );
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

      const completedHere = await completeDirectAdminPayout(
        creatorId,
        payoutId,
        payoutRequestId,
        payoutAmount,
      );

      // Webhook may have already emailed if it won the race.
      if (completedHere) {
        sendApprovedPayoutEmail(payoutId);
      }

      return success(
        {
          ...feeBreakdown,
          ...processResult.data,
          payoutId,
          payoutRequestId,
          requestCreated: false,
          processed: true,
        },
        'Payout processed successfully',
        HttpStatus.CREATED,
      );
    } catch (processError) {
      const processMessage = getProcessErrorMessage(processError);

      try {
        await rollbackAdminPayout(payoutId, payoutRequestId);
      } catch (rollbackError) {
        logger.error(
          'Admin payout processing failed and rollback also failed',
          {
            creatorId,
            payoutId,
            payoutRequestId,
            processError,
            rollbackError,
          },
        );

        return fail(
          `Payout processing failed: ${processMessage}. Cleanup also failed — check for a stuck pending request.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      logger.error(
        'Admin direct payout processing failed; request rolled back',
        {
          creatorId,
          payoutId,
          payoutRequestId,
          processError,
        },
      );

      return fail(
        `Payout processing failed: ${processMessage}`,
        HttpStatus.BAD_REQUEST,
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
