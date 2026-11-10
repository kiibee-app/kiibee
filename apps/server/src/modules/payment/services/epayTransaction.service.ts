import axios from 'axios';
import https from 'https';
import dns from 'node:dns';
import { logger } from 'src/logger/logger';

dns.setDefaultResultOrder('ipv4first');

const httpsAgent = new https.Agent({
  family: 4,
  keepAlive: true,
});

export type EpayTransaction = {
  id?: string;
  state?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  instantCapture?: string;
  subscriptionId?: string;
  paymentMethodDisplayText?: string;
  paymentMethodExpiry?: string;
  paymentMethodSubType?: string;
  paymentMethodType?: string;
  paymentMethodId?: string;
};

export type EpayOperation = {
  id?: string;
  transactionId?: string;
  type?: string;
  state?: string;
  amount?: number;
  errorCode?: string | { code?: string; message?: string };
};

export type EpayTransactionResponse = {
  transaction?: EpayTransaction;
  aggregates?: {
    authorized?: number;
    captured?: number;
    refunded?: number;
    voided?: number;
    remaining?: number;
    paidOut?: number;
  };
  operations?: EpayOperation[];
};

export type EpayListTransactionsResponse = {
  items?: EpayTransactionResponse[];
  nextOffset?: string;
  hasMore?: boolean;
};

const epayHeaders = () => ({
  Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
  Accept: 'application/json',
});

export const getEpayTransaction = async (
  transactionId: string,
): Promise<EpayTransactionResponse | null> => {
  try {
    const { data } = await axios.get<EpayTransactionResponse>(
      `${process.env.EPAY_BASE_URL}/public/api/v1/transactions/${transactionId}`,
      {
        headers: epayHeaders(),
        timeout: 30000,
        httpsAgent,
      },
    );

    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }

    logger.error(
      `Error fetching ePay transaction ${transactionId}:`,
      JSON.stringify(error.response?.data || error.message),
    );

    throw error;
  }
};

export const listEpayTransactions = async (params: {
  reference?: string;
  perPage?: number;
  offset?: string;
  createdAfter?: string;
  createdBefore?: string;
}): Promise<EpayListTransactionsResponse> => {
  try {
    const { data } = await axios.get<EpayListTransactionsResponse>(
      `${process.env.EPAY_BASE_URL}/public/api/v1/transactions`,
      {
        headers: epayHeaders(),
        params: {
          reference: params.reference,
          referenceMode: params.reference ? 'EXACT' : undefined,
          perPage: params.perPage ?? 100,
          offset: params.offset,
          createdAfter: params.createdAfter,
          createdBefore: params.createdBefore,
        },
        timeout: 30000,
        httpsAgent,
      },
    );

    return data;
  } catch (error: any) {
    logger.error(
      'Error listing ePay transactions:',
      JSON.stringify(error.response?.data || error.message),
    );

    throw error;
  }
};

export const findEpayTransactionsByReference = async (
  reference: string,
): Promise<EpayTransactionResponse[]> => {
  const results: EpayTransactionResponse[] = [];
  let offset: string | undefined;

  for (let page = 0; page < 10; page += 1) {
    const response = await listEpayTransactions({ reference, offset });

    for (const item of response.items ?? []) {
      if (!item.transaction?.id) continue;

      const detail = await getEpayTransaction(item.transaction.id);
      if (detail) results.push(detail);
    }

    if (!response.hasMore || !response.nextOffset) break;
    offset = response.nextOffset;
  }

  return results;
};
