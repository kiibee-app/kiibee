import { db } from 'src/database/db';
import {
  plans,
  subscriptions,
  subscriptionPaymentsHistory,
  creatorPlans,
  userCardInfo,
  users,
} from 'src/database/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import {
  CURRENCY,
  MONTHLY,
  ORDER_STATUS,
  PAYMENT_STATUS,
  STATUS,
  UNKNOWN,
} from 'src/utils/constant';
import { logger } from 'src/logger/logger';
import { runInBackground } from 'src/utils/backgroundTask';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { deleteSubscriptionService } from '../services/deleteSubscription.service';

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

    if (state === PAYMENT_STATUS.PAYMENT_FAILED) {
      await handleFailedSubscriptionPayment(transaction);
      return;
    }

    if (state !== PAYMENT_STATUS.PAYMENT_SUCCESS) return;

    const existingPayment =
      await db.query.subscriptionPaymentsHistory.findFirst({
        where: (t) => eq(t.transactionId, transactionId),
      });

    if (existingPayment) {
      logger.info('⚠️ Duplicate webhook ignored');
      return;
    }

    let plan: any;

    try {
      const [foundPlan] = await db
        .select()
        .from(plans)
        .where(eq(plans.id, reference))
        .limit(1);

      if (foundPlan) {
        plan = foundPlan;
      }
    } catch {
      logger.error(
        'Error fetching plan for subscription payment:',
        reference,
        'or subscription:',
        subscriptionId,
      );
    }

    if (!plan) {
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

    await db
      .update(creatorPlans)
      .set({ status: STATUS.INACTIVE })
      .where(
        and(
          eq(creatorPlans.creatorId, customerId),
          eq(creatorPlans.status, STATUS.ACTIVE),
        ),
      );

    const existingActiveSubscription = await db.query.subscriptions.findFirst({
      where: (t) => and(eq(t.creatorId, customerId)),
    });

    if (
      existingActiveSubscription &&
      existingActiveSubscription.planId !== plan.id
    ) {
      await deleteSubscriptionService(customerId);
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
      await db
        .update(creatorPlans)
        .set({ status: STATUS.ACTIVE })
        .where(eq(creatorPlans.id, creatorPlanId));
    } else {
      creatorPlanId = randomUUID();
      await db.insert(creatorPlans).values({
        id: creatorPlanId,
        creatorId: customerId,
        planId: plan.id,
        status: STATUS.ACTIVE,
      });
    }

    const formattedAmount = (amount / 100).toString();

    const existingSubscription = await db.query.subscriptions.findFirst({
      where: (t) => eq(t.creatorId, customerId),
    });

    const baseData = {
      planId: plan.id,
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

async function handleFailedSubscriptionPayment(transaction: any) {
  try {
    const {
      id: transactionId,
      reference,
      amount,
      customerId,
      currency,
      subscriptionId,
      paymentMethodDisplayText,
      paymentMethodExpiry,
      paymentMethodSubType,
      paymentMethodType,
    } = transaction;

    logger.warn(
      `Subscription payment FAILED for customer ${customerId}, reference ${reference}`,
    );

    const existingPayment =
      await db.query.subscriptionPaymentsHistory.findFirst({
        where: (t) => eq(t.transactionId, transactionId),
      });

    if (existingPayment) {
      logger.info('⚠️ Duplicate failure webhook ignored');
      return;
    }

    const existingSub = await db.query.subscriptions.findFirst({
      where: (t) => eq(t.creatorId, customerId),
    });

    if (existingSub && existingSub.endAt && existingSub.endAt < new Date()) {
      await db
        .update(subscriptions)
        .set({
          status: PAYMENT_STATUS.OVERDUE,
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.creatorId, customerId));

      await db
        .update(creatorPlans)
        .set({ status: STATUS.INACTIVE })
        .where(
          and(
            eq(creatorPlans.creatorId, customerId),
            eq(creatorPlans.status, STATUS.ACTIVE),
          ),
        );
    }

    const formattedAmount = (amount / 100).toString();

    let subscriptionIdForHistory: string;

    if (existingSub && existingSub.endAt && existingSub.endAt < new Date()) {
      subscriptionIdForHistory = existingSub.id;
    } else {
      subscriptionIdForHistory =
        existingSub?.id ?? `sub_${subscriptionId ?? reference}`;

      if (!existingSub) {
        let planIdForNewSub: string | null = null;

        try {
          const [foundPlan] = await db
            .select()
            .from(plans)
            .where(eq(plans.id, reference))
            .limit(1);

          if (foundPlan) {
            planIdForNewSub = foundPlan.id;
          }
        } catch {
          logger.error(
            'Error fetching plan for failed subscription payment:',
            reference,
          );
        }

        if (!planIdForNewSub) {
          const existingSubByAgreement = await db.query.subscriptions.findFirst(
            {
              where: (t) => eq(t.agreementId, subscriptionId),
            },
          );

          if (existingSubByAgreement) {
            const [cp] = await db
              .select()
              .from(creatorPlans)
              .where(eq(creatorPlans.id, existingSubByAgreement.planId))
              .limit(1);

            if (cp?.planId) {
              planIdForNewSub = cp.planId;
            }
          }
        }

        if (!planIdForNewSub) {
          logger.warn(
            'Plan not found for failed subscription payment, skipping subscription record creation',
          );
        } else {
          await db.insert(subscriptions).values({
            id: subscriptionIdForHistory,
            planId: planIdForNewSub,
            creatorId: customerId,
            amount: (amount / 100).toString(),
            currency: currency ?? CURRENCY.DKK,
            status: PAYMENT_STATUS.OVERDUE,
            invoiceNumber: reference,
            billingPeriod: MONTHLY,
            startAt: new Date(),
            endAt: new Date(),
            isActive: false,
            paymentReference: transactionId,
            agreementId: subscriptionId ?? null,
            rawPayload: transaction,
            processedAt: new Date(),
          });
        }
      }
    }

    await db.insert(subscriptionPaymentsHistory).values({
      id: `pay_${transactionId}`,
      subscriptionId: subscriptionIdForHistory,
      creatorId: customerId,
      transactionId,
      amount: formattedAmount,
      currency,
      status: ORDER_STATUS.FAILED,
      paymentMethodType,
      cardNo: paymentMethodDisplayText,
      cardExpiry: paymentMethodExpiry,
      cardType: paymentMethodSubType,
      rawPayload: transaction,
      processedAt: new Date(),
    });

    const [creator] = await db
      .select({ email: users.email, fullName: users.fullName })
      .from(users)
      .where(eq(users.id, customerId))
      .limit(1);

    if (creator?.email) {
      runInBackground(
        sendTemplateEmail({
          to: creator.email,
          subject: mailSubject.SUBSCRIPTION_PAYMENT_FAILED,
          templateName: templateName.SUBSCRIPTION_PAYMENT_FAILED,
          variables: {
            creator: {
              fullName: creator.fullName ?? '',
            },
            amount: formattedAmount,
            currency: currency ?? CURRENCY.DKK,
            paymentMethod: paymentMethodDisplayText ?? 'N/A',
          },
        }),
      );
    }

    const adminEmail =
      process.env.ADMIN_EMAIL ?? process.env.SENDER_EMAIL ?? '';

    if (adminEmail) {
      runInBackground(
        sendTemplateEmail({
          to: adminEmail,
          subject: mailSubject.SUBSCRIPTION_PAYMENT_FAILED_ADMIN,
          templateName: templateName.SUBSCRIPTION_PAYMENT_FAILED_ADMIN,
          variables: {
            creator: {
              fullName: creator?.fullName ?? UNKNOWN,
              email: creator?.email ?? UNKNOWN,
            },
            amount: formattedAmount,
            currency: currency ?? CURRENCY.DKK,
            paymentMethod: paymentMethodDisplayText ?? 'N/A',
            customerId,
          },
        }),
      );
    }
  } catch (error: any) {
    logger.error('Failed subscription payment handler error:', error);

    if (error instanceof Error) {
      logger.error('Message:', error.message);
      logger.error('Stack:', error.stack);
    }
  }
}
