import { HttpException, HttpStatus } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorPayouts,
  creatorWallets,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ORDER_STATUS, STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { payoutInfoService } from './payoutInfo.service';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';

export const approvePayoutRequestService = async (requestId: string) => {
  try {
    if (!requestId) {
      return fail('Request ID is required', HttpStatus.BAD_REQUEST);
    }

    const result = await db.transaction(async (tx) => {
      const [request] = await tx
        .select()
        .from(creatorPayoutRequests)
        .where(eq(creatorPayoutRequests.id, requestId))
        .limit(1);

      if (!request) {
        throw new HttpException(
          'Payout request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (request.status !== STATUS.PENDING) {
        throw new HttpException(
          `Only pending payout requests can be approved (current status: ${request.status})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const [payout] = await tx
        .select()
        .from(creatorPayouts)
        .where(eq(creatorPayouts.id, request.payoutId))
        .limit(1);

      if (!payout) {
        throw new HttpException('Payout not found', HttpStatus.NOT_FOUND);
      }

      if (payout.status !== STATUS.PENDING) {
        throw new HttpException(
          `Only pending payouts can be approved (current status: ${payout.status})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const [wallet] = await tx
        .select()
        .from(creatorWallets)
        .where(eq(creatorWallets.creatorId, request.creatorId))
        .limit(1);

      if (!wallet) {
        throw new HttpException(
          'Creator wallet not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const walletBalance = Number(wallet.amount);
      const rawAmount = Number(payout.rawAmount);

      if (Number.isNaN(walletBalance) || Number.isNaN(rawAmount)) {
        throw new HttpException(
          'Invalid wallet or payout amount',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (walletBalance < rawAmount) {
        throw new HttpException(
          'Insufficient wallet balance',
          HttpStatus.BAD_REQUEST,
        );
      }

      const now = new Date();

      const [updatedRequest] = await tx
        .update(creatorPayoutRequests)
        .set({
          status: ORDER_STATUS.COMPLETED,
          updatedAt: now,
        })
        .where(eq(creatorPayoutRequests.id, requestId))
        .returning();

      const [updatedPayout] = await tx
        .update(creatorPayouts)
        .set({
          status: ORDER_STATUS.COMPLETED,
          payoutDate: now,
          updatedAt: now,
        })
        .where(eq(creatorPayouts.id, request.payoutId))
        .returning();

      if (!updatedRequest || !updatedPayout) {
        throw new HttpException(
          'Failed to update payout status',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await tx
        .update(creatorWallets)
        .set({
          amount: sql`${creatorWallets.amount} - ${payout.rawAmount}`,
          updatedAt: now,
        })
        .where(eq(creatorWallets.creatorId, payout.creatorId));

      return updatedRequest;
    });

    logger.info(`Payout request ${requestId} approved manually`);

    const payoutInfo = await payoutInfoService(result.payoutId);
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

    return success(
      result,
      'Payout request approved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to approve payout request', error);

    throw new HttpException(
      'Failed to approve payout request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
