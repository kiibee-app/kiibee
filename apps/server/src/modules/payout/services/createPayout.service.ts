import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPayoutRequests } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail } from 'src/utils/sendResponse';
import { approvePayoutRequestService } from './approvePayoutRequest.service';

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

    if (!payoutId) {
      return fail('Payout ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!paymentMethodId) {
      return fail('Payment method ID is required', HttpStatus.BAD_REQUEST);
    }

    if (!amount) {
      return fail('Amount is required', HttpStatus.BAD_REQUEST);
    }

    const [request] = await db
      .select({
        id: creatorPayoutRequests.id,
        creatorId: creatorPayoutRequests.creatorId,
        paymentMethodId: creatorPayoutRequests.paymentMethodId,
      })
      .from(creatorPayoutRequests)
      .where(eq(creatorPayoutRequests.payoutId, payoutId))
      .limit(1);

    if (!request) {
      return fail('Payout request not found', HttpStatus.NOT_FOUND);
    }

    if (request.creatorId !== creatorId) {
      return fail('Creator does not match this payout', HttpStatus.BAD_REQUEST);
    }

    if (request.paymentMethodId !== paymentMethodId) {
      return fail(
        'Payment method does not match this payout',
        HttpStatus.BAD_REQUEST,
      );
    }

    return approvePayoutRequestService(request.id);
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
