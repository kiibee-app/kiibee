import { HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { creatorPayoutRequests, users } from 'src/database/schema';
import { fail } from 'src/utils/sendResponse';

export const payoutInfoService = async (payoutId: string) => {
  const [result] = await db
    .select({
      id: creatorPayoutRequests.id,
      creatorId: creatorPayoutRequests.creatorId,
      payoutId: creatorPayoutRequests.payoutId,
      paymentMethodId: creatorPayoutRequests.paymentMethodId,
      rawAmount: creatorPayoutRequests.rawAmount,
      processingFee: creatorPayoutRequests.processingFee,
      platformFee: creatorPayoutRequests.platformFee,
      payableAmount: creatorPayoutRequests.payableAmount,
      currency: creatorPayoutRequests.currency,
      status: creatorPayoutRequests.status,
      createdAt: creatorPayoutRequests.createdAt,
      updatedAt: creatorPayoutRequests.updatedAt,

      creatorUserId: users.id,
      creatorFullName: users.fullName,
      creatorEmail: users.email,
    })
    .from(creatorPayoutRequests)
    .leftJoin(users, eq(creatorPayoutRequests.creatorId, users.id))
    .where(eq(creatorPayoutRequests.payoutId, payoutId))
    .limit(1);

  if (!result) {
    throw fail('Payout not found', HttpStatus.NOT_FOUND);
  }

  return {
    id: result.id,
    creatorId: result.creatorId,
    payoutId: result.payoutId,
    paymentMethodId: result.paymentMethodId,
    rawAmount: result.rawAmount,
    processingFee: result.processingFee,
    platformFee: result.platformFee,
    payableAmount: result.payableAmount,
    currency: result.currency,
    status: result.status,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    creator: {
      id: result.creatorUserId,
      fullName: result.creatorFullName,
      email: result.creatorEmail,
    },
  };
};
