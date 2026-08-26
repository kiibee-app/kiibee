import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { accountDetails, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';
import { UpsertAdminAccountDetailsDto } from '../dto/payout.dto';

function trimOrNull(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const upsertAdminAccountDetailsService = async (
  creatorId: string,
  dto: UpsertAdminAccountDetailsDto,
) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    const methodType = dto.methodType;
    const accountHolderName = dto.accountHolderName.trim();

    if (!accountHolderName) {
      return fail('Account holder name is required', HttpStatus.BAD_REQUEST);
    }

    let accountNumber: string | null = null;
    let bankName: string | null = null;
    let cardNumber: string | null = null;
    let cardExpiry: string | null = null;

    if (methodType === 'bank') {
      accountNumber = trimOrNull(dto.accountNumber);
      bankName = trimOrNull(dto.bankName);

      if (!accountNumber || !bankName) {
        return fail(
          'Account number and bank name are required',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      cardNumber = trimOrNull(dto.cardNumber);
      cardExpiry = trimOrNull(dto.cardExpiry);

      if (!cardNumber || !cardExpiry) {
        return fail(
          'Card number and validity are required',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const [creator] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, creatorId))
      .limit(1);

    if (!creator || creator.role !== ROLE.CREATOR) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    const now = new Date();
    const values = {
      methodType,
      accountNumber,
      accountHolderName,
      bankName,
      cardNumber,
      cardExpiry,
      updatedAt: now,
    };

    const [saved] = await db
      .insert(accountDetails)
      .values({
        id: randomUUID(),
        creatorId,
        ...values,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: accountDetails.creatorId,
        set: values,
      })
      .returning({
        id: accountDetails.id,
        creatorId: accountDetails.creatorId,
        methodType: accountDetails.methodType,
        accountNumber: accountDetails.accountNumber,
        accountHolderName: accountDetails.accountHolderName,
        bankName: accountDetails.bankName,
        cardNumber: accountDetails.cardNumber,
        cardExpiry: accountDetails.cardExpiry,
      });

    return success(saved, 'Account details saved successfully', HttpStatus.OK);
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to save admin account details', error);

    throw new HttpException(
      'Failed to save account details',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
