import axios from 'axios';
import https from 'https';
import dns from 'node:dns';
import { logger } from 'src/logger/logger';

dns.setDefaultResultOrder('ipv4first');

const httpsAgent = new https.Agent({
  family: 4,
  keepAlive: true,
});

export const capturePayment = async ({
  transactionId,
  amount,
  idempotencyKey,
  voidRemaining = false,
}: {
  transactionId: string;
  amount: number;
  idempotencyKey?: string;
  voidRemaining?: boolean;
}) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Idempotency-Key': idempotencyKey ?? `capture-${transactionId}`,
    };

    const { data } = await axios.post(
      `${process.env.EPAY_BASE_URL}/public/api/v1/transactions/${transactionId}/capture`,
      {
        amount: Math.round(amount),
        voidRemaining,
      },
      {
        headers,
        timeout: 60000,
        httpsAgent,
      },
    );

    return data;
  } catch (error: any) {
    logger.error(
      `Error capturing payment for transaction ${transactionId}:`,
      JSON.stringify(error.response?.data || error.message),
    );

    throw error;
  }
};
