import axios from 'axios';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { plans } from 'src/database/schema';

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

    const billingPlanId =
      plan.name === 'Pro'
        ? process.env.EPAY_PLAN_PRO
        : process.env.EPAY_PLAN_STARTUP;

    if (!billingPlanId) throw new Error('Billing plan not configured');

    const nextChargeAt = new Date();
    nextChargeAt.setMonth(nextChargeAt.getMonth() + 1);

    const reference = createSafeReference('ref', userId);
    const subscriptionReference = createSafeReference('sub', userId);
    const agreementReference = createSafeReference('ag', userId);

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
      reference,
      amount: plan.price * 100,
      currency,

      instantCapture: 'OFF',
      textOnStatement: `order-${reference}`,

      customerId: userId,
      customer: {
        firstName: user.fullName?.split(' ')?.[0] || 'User',
        lastName: user.fullName?.split(' ')?.slice(1)?.join(' ') || '',
        email: user.email,
      },

      transactionType: 'PAYMENT',
      scaMode: 'NORMAL',
      timeout: 120,
      maxAttempts: 25,
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
        amount: 0,
        type: 'SCHEDULED',
        reference: subscriptionReference,

        billingAgreement: {
          billingPlanId,
          reference: agreementReference,
          nextChargeAt: nextChargeAt.toISOString().split('T')[0],
        },
      },
    };

    const response = await epay.post('/public/api/v1/cit', payload);

    return response;
  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    throw new Error('Failed to create subscription');
  }
};
