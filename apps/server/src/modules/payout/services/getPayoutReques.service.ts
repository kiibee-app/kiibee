import { HttpException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorWallets,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';

export const getPayoutRequestService = async () => {
  try {
    const allRequests = await db
      .select({
        id: creatorPayoutRequests.id,
        payoutId: creatorPayoutRequests.payoutId,
        creatorId: creatorPayoutRequests.creatorId,
        paymentMethodId: creatorPayoutRequests.paymentMethodId,
        rawAmount: creatorPayoutRequests.rawAmount,
        processingFee: creatorPayoutRequests.processingFee,
        platformFee: creatorPayoutRequests.platformFee,
        payableAmount: creatorPayoutRequests.payableAmount,
        currency: creatorPayoutRequests.currency,
        status: creatorPayoutRequests.status,
        createdAt: creatorPayoutRequests.createdAt,
        email: users.email,
        fullName: users.fullName,
        walletBalance: creatorWallets.amount,
        walletCurrency: creatorWallets.currency,
      })
      .from(creatorPayoutRequests)
      .leftJoin(users, eq(creatorPayoutRequests.creatorId, users.id))
      .leftJoin(
        creatorWallets,
        eq(creatorPayoutRequests.creatorId, creatorWallets.creatorId),
      )
      .where(eq(creatorPayoutRequests.status, STATUS.PENDING));

    return success(
      allRequests,
      'Payout requests fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to fetch payout requests', error);

    throw new HttpException(
      'Failed to fetch payout requests',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
