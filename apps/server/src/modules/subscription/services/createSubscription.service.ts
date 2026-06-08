import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { plans } from 'src/database/schema';

const epay = axios.create({
  baseURL: process.env.EPAY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
  },
});

export const createSubscriptionService = async ({
  userId,
  planId,
}: {
  userId: string;
  planId: string;
}) => {
  try {
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1);

    if (!plan) {
      throw new Error('Plan not found');
    }

    const billingPlanId =
      plan.name === 'Pro'
        ? process.env.EPAY_PLAN_PRO
        : process.env.EPAY_PLAN_STARTUP;

    if (!billingPlanId) {
      throw new Error(`No billing plan configured for plan "${plan.name}"`);
    }

    const nextChargeAt = new Date();
    nextChargeAt.setMonth(nextChargeAt.getMonth() + 1);

    const payload = {
      billingPlanId,
      subscriptionId: null,
      reference: `subscription-${userId}-${Date.now()}`,
      nextChargeAt: nextChargeAt.toISOString().split('T')[0],
    };

    const response = await epay.post(
      '/public/api/v1/subscriptions/billing/agreements',
      payload,
    );

    return response.data;
  } catch (error: any) {
    const epayError = error?.response?.data;

    throw new HttpException(
      {
        success: false,
        message: epayError?.message || error.message,
        errorCode: epayError?.errorCode,
        data: epayError,
      },
      error?.response?.status || 500,
    );
  }
};
