import { HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorPayouts,
  creatorWallets,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, PAYMENT_STATUS, STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { payoutInfoService } from '../services/payoutInfo.service';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';

export const handlePayoutWebhookService = async (payload: any) => {
  try {
    const transaction = payload?.data?.transaction ?? payload ?? {};

    logger.info('ePay payout webhook received', {
      transactionId: transaction.id,
      reference: transaction.reference ?? transaction.attributes?.payoutId,
      state: transaction.state ?? payload?.status,
    });

    const payoutId =
      transaction.reference ??
      transaction.attributes?.payoutId ??
      payload?.attributes?.payoutId;

    if (!payoutId) {
      return fail(
        'Missing payoutId in webhook payload',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [payout] = await db
      .select()
      .from(creatorPayouts)
      .where(eq(creatorPayouts.id, payoutId))
      .limit(1);

    if (!payout) {
      return fail('Payout not found', HttpStatus.NOT_FOUND);
    }

    if (['completed', 'failed'].includes(String(payout.status))) {
      return success(payout, 'Payout already processed');
    }

    const status = String(transaction.state ?? payload?.status ?? '');

    if (
      status === ORDER_STATUS.COMPLETED ||
      status === PAYMENT_STATUS.PAYMENT_SUCCESS
    ) {
      const cardNo =
        transaction.paymentMethodDisplayText ??
        transaction.cardNo ??
        payout.cardNo;
      const payoutDate = transaction.createdAt
        ? new Date(transaction.createdAt)
        : payout.payoutDate;

      const processed = await db.transaction(async (tx) => {
        // Use the same request -> payout lock order as manual approval.
        await tx
          .select({ id: creatorPayoutRequests.id })
          .from(creatorPayoutRequests)
          .where(eq(creatorPayoutRequests.payoutId, payoutId))
          .for('update');
        const [current] = await tx
          .select()
          .from(creatorPayouts)
          .where(eq(creatorPayouts.id, payoutId))
          .limit(1)
          .for('update');
        if (!current || current.status !== STATUS.PENDING) return false;
        if (
          !Number.isFinite(Number(current.rawAmount)) ||
          Number(current.rawAmount) <= 0
        )
          throw new Error('Invalid payout amount');
        await tx
          .update(creatorPayouts)
          .set({
            status: ORDER_STATUS.COMPLETED,
            creditNo: transaction.creditNo ?? payout.creditNo,
            cardNo,
            bankAccountInfo:
              transaction.bankAccountInfo ?? payout.bankAccountInfo,
            payoutDate,
            updatedAt: new Date(),
          })
          .where(eq(creatorPayouts.id, payout.id));

        await tx
          .update(creatorPayoutRequests)
          .set({
            status: ORDER_STATUS.COMPLETED,
            updatedAt: new Date(),
          })
          .where(eq(creatorPayoutRequests.payoutId, payoutId));

        const [debitedWallet] = await tx
          .update(creatorWallets)
          .set({
            amount: sql`${creatorWallets.amount} - ${current.rawAmount}`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(creatorWallets.creatorId, current.creatorId),
              sql`${creatorWallets.amount} >= ${current.rawAmount}`,
            ),
          )
          .returning({ id: creatorWallets.id });
        if (!debitedWallet) throw new Error('Insufficient wallet balance');
        return true;
      });
      if (!processed) return success({}, 'Payout already processed');

      logger.info(`Payout ${payout.id} completed successfully`);
      const payoutInfo = await payoutInfoService(payoutId);

      runInBackground(
        sendTemplateEmail({
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
        }),
      );

      return success({}, 'Payout completed');
    }

    const failedStates = ['FAILED', 'REJECTED', 'ERROR', 'DECLINED'];

    if (failedStates.includes(status)) {
      await db
        .update(creatorPayouts)
        .set({
          status: STATUS.REJECTED,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(creatorPayouts.id, payout.id),
            eq(creatorPayouts.status, STATUS.PENDING),
          ),
        );

      logger.warn(`Payout ${payout.id} failed`);

      return success({}, 'Payout marked as failed');
    }

    logger.info(`Payout ${payout.id} received unhandled state: ${status}`);

    return success({}, 'Payout state ignored');
  } catch (error) {
    logger.error('Payout webhook processing failed', error);

    return fail('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
