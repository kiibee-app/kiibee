import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { runInBackground } from 'src/utils/backgroundTask';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { escapeHtml } from 'src/utils/sanitize';
import { manualExpiryDate } from './manualExpiryDate';
import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  adminBillingRequests,
  creatorPlans,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { hasPaidSubscriptionPeriod } from './hasPaidSubscriptionPeriod';
import { recordAdminBillingEmail } from './adminBillingRequest.service';
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

    const notification = await db.transaction(async (tx) => {
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
          name: plans.name,
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

      const isPaidAssignment =
        plan.price > 0 && currentPlan?.planId !== plan.id;

      let upgradeRequired = creator.subscriptionUpgradeRequired;
      if (plan.price === 0) {
        upgradeRequired = false;
      } else if (
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
      }

      if (upgradeRequired !== creator.subscriptionUpgradeRequired) {
        await tx
          .update(users)
          .set({ subscriptionUpgradeRequired: upgradeRequired })
          .where(eq(users.id, creatorId));
      }
      const planChanged = currentPlan?.planId !== plan.id;
      if (planChanged || !upgradeRequired) {
        await tx
          .update(adminBillingRequests)
          .set({ status: 'cancelled', updatedAt: new Date() })
          .where(
            and(
              eq(adminBillingRequests.creatorId, creatorId),
              eq(adminBillingRequests.status, 'pending'),
            ),
          );
      }
      let billingRequestId: string | undefined;
      if (
        upgradeRequired &&
        (planChanged || !creator.subscriptionUpgradeRequired)
      ) {
        billingRequestId = randomUUID();
        await tx.insert(adminBillingRequests).values({
          id: billingRequestId,
          creatorId,
          planId: plan.id,
          planName: plan.name,
          amount: String(input.customPrice ?? plan.price),
          currency:
            plan.currency === 'KR' || plan.currency === 'DK'
              ? 'DKK'
              : plan.currency || 'DKK',
          emailStatus: creator.email ? 'pending' : 'unavailable',
        });
      }
      return {
        billingRequestId,
        email: creator.email,
        fullName: creator.fullName,
        previousPlanName: currentPlan?.name || 'Intet aktivt abonnement',
        planChanged: currentPlan?.planId !== plan.id,
        manualPaymentReceived: Boolean(
          input.manuallyPaid &&
          !upgradeRequired &&
          (!currentPlan?.manuallyPaid || currentPlan.planId !== plan.id),
        ),
      };
    });

    if (notification?.email) {
      const creator = { fullName: escapeHtml(notification.fullName || '') };
      const planName = escapeHtml(plan.name || 'Abonnement');
      if (notification.planChanged || notification.billingRequestId) {
        runInBackground(
          sendTemplateEmail({
            to: notification.email,
            cc: 'info@kiibee.com',
            subject: mailSubject.SUBSCRIPTION_PLAN_CHANGED,
            templateName: templateName.SUBSCRIPTION_PLAN_CHANGED,
            variables: {
              creator,
              previousPlanName: escapeHtml(notification.previousPlanName),
              planName,
            },
          }).then(async (sent) => {
            if (notification.billingRequestId)
              await recordAdminBillingEmail(
                notification.billingRequestId,
                sent,
              );
          }),
        );
      }
      if (notification.manualPaymentReceived) {
        runInBackground(
          sendTemplateEmail({
            to: notification.email,
            cc: 'info@kiibee.com',
            subject: mailSubject.SUBSCRIPTION_MANUAL_PAYMENT,
            templateName: templateName.SUBSCRIPTION_MANUAL_PAYMENT,
            variables: { creator, planName },
          }),
        );
      }
    }

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
