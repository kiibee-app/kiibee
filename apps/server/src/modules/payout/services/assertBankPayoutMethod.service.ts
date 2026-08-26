import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorBankAccounts, userCardInfo } from 'src/database/schema';
import { CARD_PAYOUTS_ENABLED } from 'src/utils/fees';

export const assertBankPayoutMethod = async (
  creatorId: string,
  paymentMethodId: string,
) => {
  const [bankAccount] = await db
    .select({
      id: creatorBankAccounts.id,
    })
    .from(creatorBankAccounts)
    .where(
      and(
        eq(creatorBankAccounts.id, paymentMethodId),
        eq(creatorBankAccounts.creatorId, creatorId),
      ),
    )
    .limit(1);

  if (bankAccount) {
    return bankAccount;
  }

  const [card] = await db
    .select({
      id: userCardInfo.id,
    })
    .from(userCardInfo)
    .where(
      and(
        eq(userCardInfo.userId, creatorId),
        eq(userCardInfo.paymentMethodId, paymentMethodId),
      ),
    )
    .limit(1);

  if (card && !CARD_PAYOUTS_ENABLED) {
    throw new HttpException(
      'Card payouts are temporarily disabled. Use a bank account.',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (card) {
    return card;
  }

  throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
};
