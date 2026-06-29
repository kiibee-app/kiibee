import axios from 'axios';
import { randomUUID } from 'crypto';
import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import https from 'https';

import { db } from 'src/database/db';
import { userCardInfo } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { STATUS } from 'src/utils/constant';

export const deleteSubscriptionService = async (
  userId: string,
  subscriptionId: string,
) => {
  try {
    if (!userId || !subscriptionId) {
      return fail(
        'userId and subscriptionId must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [card] = await db
      .select()
      .from(userCardInfo)
      .where(
        and(
          eq(userCardInfo.userId, userId),
          eq(userCardInfo.ePaySubscriptionId, subscriptionId),
        ),
      );

    if (!card) {
      return fail(
        'No card found for the given userId and subscriptionId',
        HttpStatus.NOT_FOUND,
      );
    }

    if (card.isDefault) {
      return fail(
        'Cannot delete the default card. Please set another card as default before deleting this one.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const httpsAgent = new https.Agent({ family: 4 });

    const headers = {
      Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
      Accept: 'application/json',
      'Idempotency-Key': randomUUID(),
    };

    const { data: subscription } = await axios.get(
      `${process.env.EPAY_BASE_URL}/public/api/v1/subscriptions/${subscriptionId}`,
      {
        headers,
        httpsAgent,
      },
    );

    if (subscription.state === STATUS.ACTIVE) {
      await axios.delete(
        `${process.env.EPAY_BASE_URL}/public/api/v1/subscriptions/${subscriptionId}`,
        {
          headers,
          httpsAgent,
        },
      );

      logger.info(`Subscription ${subscriptionId} disabled successfully.`);
    } else {
      logger.info(
        `Skipping subscription disable. Current state: ${subscription.state}`,
      );
    }

    await db.delete(userCardInfo).where(eq(userCardInfo.id, card.id));

    return success(null, 'Card removed successfully', HttpStatus.OK);
  } catch (error: any) {
    logger.error(error);

    throw error;
  }
};
