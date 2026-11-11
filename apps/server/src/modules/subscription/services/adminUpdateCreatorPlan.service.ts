import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { runInBackground } from 'src/utils/backgroundTask';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { escapeHtml } from 'src/utils/sanitize';
import { manualExpiryDate } from './manualExpiryDate';
import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans, subscriptions, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { hasPaidSubscriptionPeriod } from './hasPaidSubscriptionPeriod';
import { randomUUID } from 'crypto';

interface AdminUpdateCreatorPlanInput {
  planId: string;
  manuallyPaid?: boolean;
  manualPaidExpiresAt?: string | null;
  customPrice: number | null;
  customPrice3: number | null;
  customPrice6: number | null;
  customPrice12: number | null;
  customMaxFiles: number | null;
  customKiibeeCutDkk: number | null;
  customTransactionFeePct: number | null;
  paymentPeriod: string | null;
}

export const adminUpdateCreatorPlan = async (
  creatorId: string,
  input: AdminUpdateCreatorPlanInput,
) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }
    if (!input.planId) {
      return fail('Plan ID is required', HttpStatus.BAD_REQUEST);
    }

    if (
      input.manuallyPaid !== undefined &&
      typeof input.manuallyPaid !== 'boolean'
    ) {
      return fail('Invalid manual payment status', HttpStatus.BAD_REQUEST);
    }
    let manualExpiry: Date | null = null;
    if (input.manualPaidExpiresAt) {
      try {
        manualExpiry = manualExpiryDate(input.manualPaidExpiresAt);
      } catch (error) {
        return fail(
          error instanceof Error ? error.message : 'Invalid expiry date',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (
      manualExpiry &&
      (!Number.isFinite(manualExpiry.getTime()) || manualExpiry <= new Date())
    ) {
      return fail(
        'Manual payment expiry must be a future date',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, input.planId))
      .limit(1);

    if (!plan) {
      return fail('Invalid plan ID', HttpStatus.BAD_REQUEST);
    }

    if (input.manuallyPaid && plan.price <= 0) {
      return fail(
        'Select a paid plan for manual payment',
        HttpStatus.BAD_REQUEST,
      );
    }

    const manualPaymentRecipient = await db.transaction(async (tx) => {
      const [creator] = await tx
        .select({
          email: users.email,
          fullName: users.fullName,
          subscriptionUpgradeRequired: users.subscriptionUpgradeRequired,
        })
        .from(users)
        .where(eq(users.id, creatorId))
        .for('update');

      if (!creator) {
        return fail('Creator not found', HttpStatus.NOT_FOUND);
      }

      const [currentPlan] = await tx
        .select({
          id: creatorPlans.id,
          planId: creatorPlans.planId,
          price: plans.price,
          manuallyPaid: creatorPlans.manuallyPaid,
        })
        .from(creatorPlans)
        .innerJoin(plans, eq(creatorPlans.planId, plans.id))
        .where(
          and(
            eq(creatorPlans.creatorId, creatorId),
            eq(creatorPlans.status, 'active'),
          ),
        )
        .orderBy(desc(creatorPlans.createdAt))
        .limit(1);

      let previousPrice = currentPlan?.price;
      if (plan.price === 0 && !currentPlan) {
        // An overdue subscription may already have had its plan deactivated.
        const [previousSubscription] = await tx
          .select({ price: plans.price })
          .from(subscriptions)
          .innerJoin(plans, eq(subscriptions.planId, plans.id))
          .where(eq(subscriptions.creatorId, creatorId))
          .orderBy(desc(subscriptions.createdAt))
          .limit(1);
        previousPrice = previousSubscription?.price;
      }

      const overrides = {
        ...(input.manuallyPaid !== undefined
          ? {
              manuallyPaid: input.manuallyPaid,
              manualPaidExpiresAt: input.manuallyPaid ? manualExpiry : null,
            }
          : currentPlan?.planId !== input.planId
            ? { manuallyPaid: false, manualPaidExpiresAt: null }
            : {}),
        planId: input.planId,
        customPrice: input.customPrice,
        customPrice3: input.customPrice3,
        customPrice6: input.customPrice6,
        customPrice12: input.customPrice12,
        customMaxFiles: input.customMaxFiles,
        customKiibeeCutDkk: input.customKiibeeCutDkk,
        customTransactionFeePct: input.customTransactionFeePct,
        paymentPeriod: input.paymentPeriod,
        updatedAt: new Date(),
      };
      if (currentPlan) {
        await tx
          .update(creatorPlans)
          .set(overrides)
          .where(eq(creatorPlans.id, currentPlan.id));
      } else {
        await tx.insert(creatorPlans).values({
          ...overrides,
          id: randomUUID(),
          creatorId,
          status: 'active',
        });
      }

      const wasPaidPlan = (previousPrice ?? 0) > 0;
      const isDowngrade = wasPaidPlan && plan.price === 0;
      const isPaidAssignment =
        plan.price > 0 && currentPlan?.planId !== plan.id;

      let upgradeRequired = creator.subscriptionUpgradeRequired;
      if (
        plan.price > 0 &&
        (isPaidAssignment ||
          upgradeRequired ||
          input.manuallyPaid !== undefined ||
          currentPlan?.manuallyPaid)
      ) {
        upgradeRequired = !(await hasPaidSubscriptionPeriod(
          tx,
          creatorId,
          plan.id,
        ));
      } else if (isDowngrade) {
        upgradeRequired = true;
      }

      if (upgradeRequired !== creator.subscriptionUpgradeRequired) {
        await tx
          .update(users)
          .set({ subscriptionUpgradeRequired: upgradeRequired })
          .where(eq(users.id, creatorId));
      }
      // Notify only when manual payment is enabled or assigned to a different plan.
      return input.manuallyPaid &&
        !upgradeRequired &&
        (!currentPlan?.manuallyPaid || currentPlan.planId !== plan.id)
        ? { email: creator.email, fullName: creator.fullName }
        : null;
    });

    if (manualPaymentRecipient?.email) {
      runInBackground(
        sendTemplateEmail({
          to: manualPaymentRecipient.email,
          subject: mailSubject.SUBSCRIPTION_MANUAL_PAYMENT,
          templateName: templateName.SUBSCRIPTION_MANUAL_PAYMENT,
          variables: {
            creator: {
              fullName: escapeHtml(manualPaymentRecipient.fullName || ''),
            },
            planName: escapeHtml(plan.name || 'Abonnement'),
          },
        }),
      );
    }

    // Admin downgrade expiry emails are temporarily disabled.

    return success(
      null,
      'Creator plan and overrides updated successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error updating admin creator plan:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to update creator plan',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
