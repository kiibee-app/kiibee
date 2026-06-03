import axios from 'axios';
import { logger } from 'src/logger/logger';

export const createPayment = async (
  orderId: string,
  amount: number,
  currency: string,
) => {
  try {
    const response = await axios.post(
      `${process.env.EPAY_BASE_URL}/public/api/v1/cit`,
      {
        pointOfSaleId: process.env.EPAY_POINT_OF_SALE_ID,
        reference: orderId,
        amount: Number(amount),
        currency,
        successUrl: `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`,
        failureUrl: `${process.env.FRONTEND_URL}/payment/failure?orderId=${orderId}`,
        description: `Payment for order ${orderId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    logger.error(
      'Error creating payment:',
      error.response?.data || error.message,
    );

    throw error;
  }
};
