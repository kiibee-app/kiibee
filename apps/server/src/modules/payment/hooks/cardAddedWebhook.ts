import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { userCardInfo } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { PAYMENT_STATUS } from 'src/utils/constant';

export async function handleAddCardWebhook(body: any) {
  const transaction = body?.data?.transaction;

  if (!transaction) {
    logger.error('Missing transaction data');
    return;
  }

  const {
    state,
    customerId,
    paymentMethodId,
    paymentMethodDisplayText,
    paymentMethodExpiry,
    paymentMethodSubType,
    subscriptionId,
  } = transaction;

  logger.info(
    `Add card webhook received. State: ${state}, Customer: ${customerId}`,
  );

  if (state !== PAYMENT_STATUS.PAYMENT_SUCCESS) {
    logger.info(`Ignoring webhook. State: ${state}`);
    return;
  }

  const existingCard = await db.query.userCardInfo.findFirst({
    where: and(
      eq(userCardInfo.userId, customerId),
      eq(userCardInfo.paymentMethodId, paymentMethodId),
    ),
  });

  if (existingCard) {
    logger.info(
      `Card already exists for user ${customerId}. PaymentMethodId: ${paymentMethodId}`,
    );
    return;
  }

  const firstCard = await db.query.userCardInfo.findFirst({
    where: eq(userCardInfo.userId, customerId),
  });

  await db.insert(userCardInfo).values({
    id: randomUUID(),
    userId: customerId,
    paymentMethodId,
    cardNo: paymentMethodDisplayText,
    expireDate: paymentMethodExpiry,
    cardType: paymentMethodSubType,
    ePaySubscriptionId: subscriptionId ?? '',
    isDefault: !firstCard,
  });

  logger.info(
    `Card saved successfully for user ${customerId}. PaymentMethodId: ${paymentMethodId}`,
  );
}
