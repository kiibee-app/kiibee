import axios from 'axios';
import https from 'https';
import dns from 'node:dns';
import { randomUUID } from 'crypto';
import { logger } from 'src/logger/logger';
import { UNSCHEDULED_TYPE } from 'src/utils/constant';

dns.setDefaultResultOrder('ipv4first');

const httpsAgent = new https.Agent({
  family: 4,
  keepAlive: true,
});

export const createPayment = async ({
  orderId,
  amount,
  currency,
  customerId,
  subscriptionId,
}: {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
  subscriptionId?: string;
}) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Idempotency-Key': randomUUID(),
    };

    if (subscriptionId) {
      const payload = {
        subscriptionId,
        amount: Number(amount),
        currency,
        reference: orderId,
        notificationUrl: `${process.env.EPAY_WEBHOOK_URL}/api/v1/payment/webhook`,
      };

      const { data } = await axios.post(
        `${process.env.EPAY_BASE_URL}/public/api/v1/mit`,
        payload,
        {
          headers,
          timeout: 30000,
          httpsAgent,
        },
      );

      return data;
    }

    const payload = {
      pointOfSaleId: process.env.EPAY_POINT_OF_SALE_ID,
      reference: orderId,
      amount: Number(amount),
      currency,
      customerId,
      subscription: {
        type: UNSCHEDULED_TYPE,
      },
      successUrl: `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`,
      failureUrl: `${process.env.FRONTEND_URL}/payment/failure?orderId=${orderId}`,
      notificationUrl: `${process.env.EPAY_WEBHOOK_URL}/api/v1/payment/webhook`,
    };

    const { data } = await axios.post(
      `${process.env.EPAY_BASE_URL}/public/api/v1/cit`,
      payload,
      {
        headers,
        timeout: 30000,
        httpsAgent,
      },
    );

    return data;
  } catch (error: any) {
    logger.error(
      'Error creating payment:',
      JSON.stringify(error.response?.data || error.message),
    );

    throw error;
  }
};
