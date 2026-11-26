import { updatePendingCheckoutAmount } from './adminBillingRequest.service';
import { HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  subscriptionTerms,
  hasCustomSubscriptionValues,
  addBillingMonths,
  customOverridesEnabled,
} from './subscriptionTerms';
import axios from 'axios';
import { and, desc, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorPlans,
  plans,
  subscriptionCheckouts,
} from 'src/database/schema';
import {
  MAX_ATTEMPTS,
  NORMAL_TEXT,
  PAYMENT_TEXT,
  PAYMENT_TYPES,
  STATUS,
  TIMEOUT,
} from 'src/utils/constant';
import { deleteSubscriptionService } from './deleteSubscription.service';
import { stripUrlPort } from 'src/utils/extranalApi';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { runInBackground } from 'src/utils/backgroundTask';
import { getSubscriptionWebhookUrl } from 'src/utils/webhookUrl';

const epay = axios.create({
  baseURL: process.env.EPAY_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const createSubscriptionService = async ({
  userId,
  planId,
  billingMonths,
}: {
  userId: string;
  planId: string;
  billingMonths?: number;
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

    const [currentAssignment] = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, userId),
          eq(creatorPlans.status, STATUS.ACTIVE),
        ),
      )
      .orderBy(desc(creatorPlans.createdAt))
      .limit(1);
    // A custom offer is owned by the assignment, not by the requested public plan.
    // Check it before any free activation, cancellation, or provider request.
    const hasCustomOffer =
      currentAssignment &&
      hasCustomSubscriptionValues(currentAssignment) &&
      currentAssignment.customSubscriptionStatus !== 'cancelled';
    if (hasCustomOffer && currentAssignment.planId !== plan.id) {
      throw new HttpException(
        'A custom subscription is assigned. Please use your custom plan in My account or contact the administrator.',
        409,
      );
    }
    const assigned =
      currentAssignment?.planId === plan.id ? currentAssignment : undefined;
    if (
      assigned &&
      assigned.customSubscriptionRevision > 0 &&
      ['draft', 'pending'].includes(assigned.customSubscriptionStatus) &&
      !hasCustomSubscriptionValues(assigned)
    )
      throw new HttpException(
        'No custom subscription offer is configured',
        400,
      );
    const enabled =
      customOverridesEnabled(assigned?.customSubscriptionStatus) ||
      (assigned?.customSubscriptionStatus === 'draft' &&
        assigned.customSubscriptionRevision > 0);
    const terms = subscriptionTerms(
      plan.price,
      enabled ? (assigned ?? {}) : {},
    );
    if (billingMonths !== undefined && billingMonths !== terms.months)
      throw new HttpException(
        'The billing period is set by the administrator',
        400,
      );
    if (terms.amount === 0) {
      const existingActiveSubscription = await db.query.subscriptions.findFirst(
        {
          where: (t) => and(eq(t.creatorId, userId)),
        },
      );

      if (
        existingActiveSubscription &&
        existingActiveSubscription.planId !== plan.id
      ) {
        await deleteSubscriptionService(userId);
      }
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

      if (user.email) {
        runInBackground(
          sendTemplateEmail({
            to: user.email,
            subject: mailSubject.SUBSCRIPTION_ACTIVATED,
            templateName: templateName.SUBSCRIPTION_ACTIVATED,
            variables: {
              creator: {
                fullName: user.fullName || '',
              },
              planName: plan.name || 'Abonnement',
              amount: '0',
              currency: plan.currency || 'DKK',
            },
          }),
        );
      }

      return {
        success: true,
        type: PAYMENT_TYPES.FREE,
        message: 'Free subscription created',
      };
    }

    const nextChargeAt = addBillingMonths(new Date(), terms.months);
    const reference = randomUUID();
    const subscriptionReference = reference;

    const notificationUrl = getSubscriptionWebhookUrl();

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

    let billingPlanId =
      plan.name.trim().toLowerCase() === 'pro'
        ? process.env.EPAY_PLAN_PRO
        : process.env.EPAY_PLAN_STARTUP;
    if (terms.amount !== plan.price || terms.months !== 1) {
      const { data } = await epay.post(
        '/public/api/v1/subscriptions/billing/plans',
        {
          name: `${plan.name} - ${terms.months} months - ${reference}`,
          amount: terms.minorAmount,
          currency,
          maxAttempts: MAX_ATTEMPTS,
          instantCapture: 'OFF',
          interval: { period: 'MONTH', frequency: terms.months },
        },
        { headers: { 'Idempotency-Key': `billing-plan-${reference}` } },
      );
      billingPlanId = data?.billingPlan?.id;
    }
    if (!billingPlanId) throw new Error('Billing plan not configured');
    await db.insert(subscriptionCheckouts).values({
      id: reference,
      creatorId: userId,
      planId: plan.id,
      billingMonths: terms.months,
      customRevision:
        assigned &&
        ['draft', 'pending'].includes(assigned.customSubscriptionStatus) &&
        assigned.customSubscriptionRevision > 0
          ? assigned.customSubscriptionRevision
          : null,
      amountMinor: terms.minorAmount,
      subtotalMinor: terms.subtotalMinor,
      vatMinor: terms.vatMinor,
      vatRate: terms.vatRate,
      currency,
    });

    const payload = {
      pointOfSaleId: process.env.EPAY_POINT_OF_SALE_ID,
      reference,
      amount: terms.minorAmount,
      currency,

      instantCapture: 'OFF',
      textOnStatement: `Kiibee-${reference.replace(/-/g, '').slice(0, 24)}`,

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
      successUrl: stripUrlPort(
        `${process.env.FRONTEND_URL}/subscription/success`,
      ),
      returnUrl: stripUrlPort(
        `${process.env.FRONTEND_URL}/subscription/success`,
      ),
      failureUrl: stripUrlPort(
        `${process.env.FRONTEND_URL}/subscription/failure`,
      ),
      retryUrl: stripUrlPort(`${process.env.FRONTEND_URL}/subscription/retry`),

      subscription: {
        amount: terms.minorAmount,
        type: 'SCHEDULED',
        reference: subscriptionReference,

        billingAgreement: {
          billingPlanId,
          reference,
          nextChargeAt: nextChargeAt.toISOString().split('T')[0],
        },
      },
    };
    const response = await epay.post('/public/api/v1/cit', payload, {
      headers: { 'Idempotency-Key': reference },
    });

    await updatePendingCheckoutAmount(
      userId,
      plan.id,
      terms.amount,
      currency,
      assigned &&
        ['draft', 'pending'].includes(assigned.customSubscriptionStatus) &&
        assigned.customSubscriptionRevision > 0
        ? assigned.customSubscriptionRevision
        : null,
    );
    return {
      success: true,
      type: PAYMENT_TYPES.PAID,
      data: response.data,
    };
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    console.error(error?.response?.data || error.message);
    throw new Error('Failed to create subscription');
  }
};
