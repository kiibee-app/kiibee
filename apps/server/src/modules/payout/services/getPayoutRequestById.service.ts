import { resolvePayoutBankDetails } from 'src/utils/payoutBankDetails';
import { creatorBankAccounts, creatorPayouts } from 'src/database/schema';
import { refreshPendingPayoutFees } from './refreshPendingPayoutFees.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPayoutRequests,
  creatorWallets,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getPayoutRequestByIdService = async (requestId: string) => {
  try {
    if (!requestId) {
      return fail('Request ID is required', HttpStatus.BAD_REQUEST);
    }

    const feeErrors = await refreshPendingPayoutFees(
      undefined,
      requestId,
      false,
    );

    const [request] = await db
      .select({
        id: creatorPayoutRequests.id,
        payoutId: creatorPayoutRequests.payoutId,
        creatorId: creatorPayoutRequests.creatorId,
        paymentMethodId: creatorPayoutRequests.paymentMethodId,
        rawAmount: creatorPayoutRequests.rawAmount,
        processingFee: creatorPayoutRequests.processingFee,
        platformFee: creatorPayoutRequests.platformFee,
        feeBreakdown: creatorPayoutRequests.feeBreakdown,
        payableAmount: creatorPayoutRequests.payableAmount,
        currency: creatorPayoutRequests.currency,
        status: creatorPayoutRequests.status,
        createdAt: creatorPayoutRequests.createdAt,
        email: users.email,
        fullName: users.fullName,
        walletBalance: creatorWallets.amount,
        walletCurrency: creatorWallets.currency,
        bankAccountInfo: creatorPayouts.bankAccountInfo,
        bankName: creatorBankAccounts.bankName,
        accountHolderName: creatorBankAccounts.accountHolderName,
        registrationNumber: creatorBankAccounts.registrationNumber,
        accountNumber: creatorBankAccounts.accountNumber,
      })
      .from(creatorPayoutRequests)
      .leftJoin(users, eq(creatorPayoutRequests.creatorId, users.id))
      .leftJoin(
        creatorPayouts,
        eq(creatorPayoutRequests.payoutId, creatorPayouts.id),
      )
      .leftJoin(
        creatorBankAccounts,
        and(
          eq(creatorBankAccounts.creatorId, creatorPayoutRequests.creatorId),
          eq(creatorBankAccounts.id, creatorPayoutRequests.paymentMethodId),
        ),
      )
      .leftJoin(
        creatorWallets,
        eq(creatorPayoutRequests.creatorId, creatorWallets.creatorId),
      )
      .where(eq(creatorPayoutRequests.id, requestId))
      .limit(1);

    if (!request) {
      return fail('Payout request not found', HttpStatus.NOT_FOUND);
    }

    const {
      bankName,
      accountHolderName,
      registrationNumber,
      accountNumber,
      bankAccountInfo,
      ...details
    } = request;
    const response = {
      ...details,
      bankDetails: resolvePayoutBankDetails(bankAccountInfo, {
        bankName,
        accountHolderName,
        registrationNumber,
        accountNumber,
      }),
    };

    return success(
      feeErrors[request.id]
        ? {
            ...response,
            platformFee: 'N/A',
            processingFee: 'N/A',
            payableAmount: 'N/A',
            feeCalculationError: feeErrors[request.id],
          }
        : response,
      'Payout request fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to fetch payout request', error);

    throw new HttpException(
      'Failed to fetch payout request',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
