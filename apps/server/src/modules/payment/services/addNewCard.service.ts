import { randomUUID } from 'crypto';
import { logger } from 'src/logger/logger';
import { CURRENCY } from 'src/utils/constant';

interface AddNewCardResponse {
  paymentWindowUrl: string;
  session: {
    id: string;
    subscriptionId: string | null;
    [key: string]: any;
  };
}

export const addNewCardService = async (userId: string) => {
  try {
    const reference = randomUUID();
    const payload = {
      pointOfSaleId: process.env.EPAY_POINT_OF_SALE_ID,
      amount: 0,
      currency: CURRENCY.DKK,
      reference,
      customerId: userId,
      successUrl: `${process.env.FRONTEND_URL}/card/success`,
      failureUrl: `${process.env.FRONTEND_URL}/card/failure`,
      subscription: {
        type: 'UNSCHEDULED',
        reference,
      },
    };

    const response = await fetch(
      `${process.env.EPAY_BASE_URL}/public/api/v1/cit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
          'Idempotency-Key': randomUUID(),
        },
        body: JSON.stringify(payload),
      },
    );

    const responseText = await response.text();
    let data: any;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      logger.error(
        'ePay Error',
        JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          body: data,
        }),
      );

      throw new Error(
        `ePay request failed (${response.status}): ${JSON.stringify(data)}`,
      );
    }

    return data as AddNewCardResponse;
  } catch (error: any) {
    logger.error(
      'Error creating new card',
      error?.stack || error?.message || JSON.stringify(error),
    );

    throw error;
  }
};
