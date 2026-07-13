import { HttpStatus } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPayouts, creatorWallets } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const handlePayoutWebhookService = async (payload: any) => {
  try {
    logger.info('ePay payout webhook received', payload);

    const payoutId = payload?.attributes?.payoutId;

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

    const status = String(payload?.status || '').toLowerCase();

    if (status === ORDER_STATUS.COMPLETED || status === 'success') {
      await db.transaction(async (tx) => {
        await tx
          .update(creatorPayouts)
          .set({
            status: 'completed',
            creditNo: payload?.creditNo ?? payout.creditNo,
            cardNo: payload?.cardNo ?? payout.cardNo,
            bankAccountInfo: payload?.bankAccountInfo ?? payout.bankAccountInfo,
            payoutDate: payload?.payoutDate
              ? new Date(payload.payoutDate)
              : payout.payoutDate,
            updatedAt: new Date(),
          })
          .where(eq(creatorPayouts.id, payout.id));

        await tx
          .update(creatorWallets)
          .set({
            amount: sql`${creatorWallets.amount} - ${creatorPayouts.rawAmount}`,
            updatedAt: new Date(),
          })
          .where(eq(creatorWallets.creatorId, payout.creatorId));
      });

      logger.info(`Payout ${payout.id} completed successfully`);

      return success({}, 'Payout completed');
    }

    await db
      .update(creatorPayouts)
      .set({
        status: STATUS.REJECTED,
        updatedAt: new Date(),
      })
      .where(eq(creatorPayouts.id, payout.id));

    logger.warn(`Payout ${payout.id} failed`);

    return success({}, 'Payout marked as failed');
  } catch (error) {
    logger.error('Payout webhook processing failed', error);

    return fail('Webhook processing failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
