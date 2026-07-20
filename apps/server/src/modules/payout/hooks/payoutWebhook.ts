import { HttpStatus } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
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
    logger.info('ePay payout webhook received', payload);

    const transaction = payload?.data?.transaction ?? payload ?? {};

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

      await db.transaction(async (tx) => {
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

        await tx
          .update(creatorWallets)
          .set({
            amount: sql`${creatorWallets.amount} - ${payout.rawAmount}`,
            updatedAt: new Date(),
          })
          .where(eq(creatorWallets.creatorId, payout.creatorId));
      });

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
        .where(eq(creatorPayouts.id, payout.id));

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
