import axios from 'axios';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans } from 'src/database/schema';
import {
  MAX_ATTEMPTS,
  NORMAL_TEXT,
  PAYMENT_TEXT,
  PAYMENT_TYPES,
  STATUS,
  TIMEOUT,
} from 'src/utils/constant';

const epay = axios.create({
  baseURL: process.env.EPAY_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const createSafeReference = (prefix: string, id: string) => {
  const cleanId = id.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 10);
  const base = `${prefix}-${cleanId}-${Date.now().toString(36)}`;
  return base.slice(0, 36);
};

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

    if (!plan) throw new Error('Plan not found');

    const user = await db.query.users.findFirst({
      where: (users) => eq(users.id, userId),
    });

    if (!user) throw new Error('User not found');

    if (plan.price === 0) {
      await db
        .update(creatorPlans)
        .set({ status: STATUS.INACTIVE })
        .where(
          and(
            eq(creatorPlans.creatorId, userId),
            eq(creatorPlans.status, STATUS.ACTIVE),
          ),
        );

      await db
        .insert(creatorPlans)
        .values({
          id: `cp_${planId}_${userId}`,
          creatorId: userId,
          planId,
        })
        .onConflictDoNothing();

      return {
        success: true,
        type: PAYMENT_TYPES.FREE,
        message: 'Free subscription created',
      };
    }

    const billingPlanId =
      plan.name === 'Pro'
        ? process.env.EPAY_PLAN_PRO
        : process.env.EPAY_PLAN_STARTUP;

    if (!billingPlanId) throw new Error('Billing plan not configured');

    const nextChargeAt = new Date();
    nextChargeAt.setMonth(nextChargeAt.getMonth() + 1);

    const reference = createSafeReference('ref', planId);
    const subscriptionReference = planId;

    const notificationUrl = process.env.EPAY_WEBHOOK_URL;

    if (!notificationUrl?.startsWith('https://')) {
      throw new Error('Invalid EPAY_WEBHOOK_URL');
    }

    const currencyMap: Record<string, string> = {
      KR: 'DKK',
      DK: 'DKK',
      USD: 'USD',
      EUR: 'EUR',
      GBP: 'GBP',
    };

    const currency = (plan.currency && currencyMap[plan.currency]) || 'DKK';

    const payload = {
      pointOfSaleId: process.env.EPAY_POINT_OF_SALE_ID,
      reference: planId,
      amount: plan.price * 100,
      currency,

      instantCapture: 'OFF',
      textOnStatement: `order-${reference}`,

      customerId: userId,
      customer: {
        firstName: user.fullName?.split(' ')?.[0] || 'User',
        lastName:
          user.fullName?.split(' ')?.slice(1)?.join(' ') ||
          user.fullName?.split(' ')?.[0] ||
          'User',
        email: user.email,
      },

      transactionType: PAYMENT_TEXT,
      scaMode: NORMAL_TEXT,
      timeout: TIMEOUT,
      maxAttempts: MAX_ATTEMPTS,
      dynamicAmount: false,
      reportFailure: false,
      reportExpired: false,
      generateQrCode: false,

      notificationUrl,
      successUrl: `${process.env.FRONTEND_URL}/subscription/success`,
      returnUrl: `${process.env.FRONTEND_URL}/subscription/success`,
      failureUrl: `${process.env.FRONTEND_URL}/subscription/failure`,
      retryUrl: `${process.env.FRONTEND_URL}/subscription/retry`,

      subscription: {
        amount: plan.price * 100,
        type: 'SCHEDULED',
        reference: subscriptionReference,

        billingAgreement: {
          billingPlanId,
          reference: planId,
          nextChargeAt: nextChargeAt.toISOString().split('T')[0],
        },
      },
    };
    const response = await epay.post('/public/api/v1/cit', payload);

    return {
      success: true,
      type: PAYMENT_TYPES.PAID,
      data: response.data,
    };
  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    throw new Error('Failed to create subscription');
  }
};
