import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPayoutRequests, creatorPayouts } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { STATUS } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const rejectPayoutRequestService = async (requestId: string) => {
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
          `Only pending payout requests can be rejected (current status: ${request.status})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const now = new Date();

      const [rejectedRequest] = await tx
        .update(creatorPayoutRequests)
        .set({
          status: STATUS.REJECTED,
          updatedAt: now,
        })
        .where(eq(creatorPayoutRequests.id, requestId))
        .returning();

      const [updatedPayout] = await tx
        .update(creatorPayouts)
        .set({
          status: STATUS.REJECTED,
          updatedAt: now,
        })
        .where(eq(creatorPayouts.id, request.payoutId))
        .returning();

      if (!updatedPayout) {
        throw new HttpException(
          'Failed to update payout status',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return rejectedRequest;
    });

    logger.info(`Payout request ${requestId} rejected`);

    return success(
      result,
      'Payout request rejected successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to reject payout request', error);

    throw new HttpException(
      'Failed to reject payout request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
