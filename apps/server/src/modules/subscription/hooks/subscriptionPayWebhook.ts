import { db } from 'src/database/db';
import {
  plans,
  subscriptions,
  subscriptionPaymentsHistory,
  creatorPlans,
  userCardInfo,
} from 'src/database/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { ORDER_STATUS, PAYMENT_STATUS } from 'src/utils/constant';
import { logger } from 'src/logger/logger';

export async function handleSubscriptionPayment(body: any) {
  try {
    const transaction = body?.data?.transaction;
    if (!transaction) return;

    const {
      id: transactionId,
      reference,
      amount,
      customerId,
      currency,
      state,
      paymentMethodDisplayText,
      paymentMethodExpiry,
      paymentMethodSubType,
      paymentMethodType,
      subscriptionId,
      textOnStatement,
      paymentMethodId,
    } = transaction;

    if (state !== PAYMENT_STATUS.PAYMENT_SUCCESS) return;

    let plan: any;
    const [foundPlan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, reference))
      .limit(1);

    if (foundPlan) {
      plan = foundPlan;
    } else {
      const existingSub = await db.query.subscriptions.findFirst({
        where: (t) => eq(t.agreementId, subscriptionId),
      });

      if (existingSub) {
        const [cp] = await db
          .select()
          .from(creatorPlans)
          .where(eq(creatorPlans.id, existingSub.planId))
          .limit(1);

        if (cp) {
          const [p] = await db
            .select()
            .from(plans)
            .where(eq(plans.id, cp.planId))
            .limit(1);
          plan = p;
        }
      }
    }

    if (!plan) {
      logger.error(
        'Plan not found for reference:',
        reference,
        'or subscription:',
        subscriptionId,
      );
      return;
    }

    let creatorPlanId: string;
    const [creatorPlan] = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, customerId),
          eq(creatorPlans.planId, plan.id),
        ),
      )
      .limit(1);

    if (creatorPlan) {
      creatorPlanId = creatorPlan.id;
    } else {
      creatorPlanId = randomUUID();
      await db.insert(creatorPlans).values({
        id: creatorPlanId,
        creatorId: customerId,
        planId: plan.id,
      });
    }

    const existingPayment =
      await db.query.subscriptionPaymentsHistory.findFirst({
        where: (t) => eq(t.transactionId, transactionId),
      });

    if (existingPayment) {
      logger.info('⚠️ Duplicate webhook ignored');
      return;
    }

    const formattedAmount = (amount / 100).toString();

    const existingSubscription = await db.query.subscriptions.findFirst({
      where: (t) => eq(t.creatorId, customerId),
    });

    const baseData = {
      planId: reference,
      creatorId: customerId,
      amount: formattedAmount,
      currency,
      status: 'paid' as const,
      billingPeriod: plan.billingCycle,
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 86400000),
      paymentReference: transactionId,
      agreementId: subscriptionId,
      rawPayload: body,
      processedAt: new Date(),
    };

    const targetSubscriptionId = `sub_${subscriptionId}`;

    if (existingSubscription) {
      await db
        .update(subscriptions)
        .set({
          nextPaymentAttemptAt: new Date(Date.now() + 30 * 86400000),
          ...baseData,
        })
        .where(eq(subscriptions.creatorId, customerId));
    } else {
      await db.insert(subscriptions).values({
        id: targetSubscriptionId,
        invoiceNumber: reference,
        ...baseData,
      });
    }

    await db.insert(subscriptionPaymentsHistory).values({
      id: `pay_${transactionId}`,
      subscriptionId: existingSubscription
        ? existingSubscription.id
        : targetSubscriptionId,
      creatorId: customerId,
      transactionId,
      amount: formattedAmount,
      currency,
      status: ORDER_STATUS.COMPLETED,
      paymentMethodType,
      cardNo: paymentMethodDisplayText,
      cardExpiry: paymentMethodExpiry,
      cardType: paymentMethodSubType,
      reference: textOnStatement,
      rawPayload: body,
      processedAt: new Date(),
    });

    const existingCard = await db.query.userCardInfo.findFirst({
      where: and(
        eq(userCardInfo.userId, customerId || ''),
        eq(userCardInfo.paymentMethodId, paymentMethodId),
      ),
    });

    if (!existingCard) {
      const firstCard = await db.query.userCardInfo.findFirst({
        where: eq(userCardInfo.userId, customerId),
      });

      await db.insert(userCardInfo).values({
        id: randomUUID(),
        userId: customerId,
        paymentMethodId,
        cardNo: paymentMethodDisplayText,
        expireDate: paymentMethodExpiry,
        cardType: paymentMethodSubType,
        ePaySubscriptionId: subscriptionId || '',
        isDefault: !firstCard,
      });
    }

    logger.info('✅ Subscription processed successfully');
  } catch (error: any) {
    logger.error('❌ webhook error:', error);

    if (error instanceof Error) {
      logger.error('Message:', error.message);
      logger.error('Stack:', error.stack);
    }

    throw error;
  }
}
