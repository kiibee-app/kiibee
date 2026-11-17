import { PLATFORM_FEE_PERCENTAGES } from 'src/utils/fees';
import {
  validateSubscriptionOverrides,
  subscriptionTerms,
  hasCustomSubscriptionValues,
} from './subscriptionTerms';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { runInBackground } from 'src/utils/backgroundTask';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { escapeHtml } from 'src/utils/sanitize';
import { manualExpiryDate } from './manualExpiryDate';
import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc, gt, lte } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  subscriptions,
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
  customSubscriptionAction?: 'activate' | 'cancel' | 'save';
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
    validateSubscriptionOverrides(input);
    if (
      input.customSubscriptionAction &&
      !['activate', 'cancel', 'save'].includes(input.customSubscriptionAction)
    )
      return fail('Invalid custom subscription action', HttpStatus.BAD_REQUEST);
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

    if (
      input.customSubscriptionAction === 'activate' &&
      hasCustomSubscriptionValues(input) &&
      plan.price <= 0
    )
      return fail(
        'Select a paid base plan to activate a custom subscription',
        HttpStatus.BAD_REQUEST,
      );
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
          customPrice: creatorPlans.customPrice,
          customPrice3: creatorPlans.customPrice3,
          customPrice6: creatorPlans.customPrice6,
          customPrice12: creatorPlans.customPrice12,
          customMaxFiles: creatorPlans.customMaxFiles,
          customKiibeeCutDkk: creatorPlans.customKiibeeCutDkk,
          customTransactionFeePct: creatorPlans.customTransactionFeePct,
          paymentPeriod: creatorPlans.paymentPeriod,
          customSubscriptionStatus: creatorPlans.customSubscriptionStatus,
          customSubscriptionRevision: creatorPlans.customSubscriptionRevision,
          customPreviousSettings: creatorPlans.customPreviousSettings,
          manualPaidExpiresAt: creatorPlans.manualPaidExpiresAt,
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

      const billingChanged =
        currentPlan?.planId !== input.planId ||
        [
          'customPrice',
          'customPrice3',
          'customPrice6',
          'customPrice12',
          'paymentPeriod',
        ].some(
          (key) =>
            (currentPlan?.[key as keyof typeof currentPlan] ??
              (key === 'paymentPeriod' ? '1' : null)) !==
            (input[key as keyof typeof input] ??
              (key === 'paymentPeriod' ? '1' : null)),
        );
      const hasPrice = hasCustomSubscriptionValues(input);
      const activating =
        input.customSubscriptionAction === 'activate' && hasPrice;
      const savingOffer =
        (input.customSubscriptionAction === 'save' ||
          (!input.customSubscriptionAction && billingChanged)) &&
        hasPrice &&
        (billingChanged || currentPlan?.customSubscriptionStatus !== 'paid');
      const cancelling = input.customSubscriptionAction === 'cancel';
      if (cancelling && currentPlan?.customSubscriptionStatus === 'paid')
        return fail(
          'There is no pending custom offer to cancel. The paid ePay subscription is unchanged.',
          HttpStatus.BAD_REQUEST,
        );
      // A pending checkout is immutable; changing its terms requires a new revision.
      if (
        !activating &&
        !savingOffer &&
        !cancelling &&
        hasPrice &&
        currentPlan?.planId === input.planId &&
        ['pending', 'paid'].includes(
          currentPlan.customSubscriptionStatus ?? '',
        ) &&
        [
          'customPrice',
          'customPrice3',
          'customPrice6',
          'customPrice12',
          'paymentPeriod',
        ].some(
          (key) =>
            (currentPlan[key as keyof typeof currentPlan] ??
              (key === 'paymentPeriod' ? '1' : null)) !==
            (input[key as keyof typeof input] ??
              (key === 'paymentPeriod' ? '1' : null)),
        )
      ) {
        return fail(
          'Use Activate custom subscription to request payment for changed custom terms.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const previous = currentPlan
        ? Object.fromEntries(
            [
              'planId',
              'manuallyPaid',
              'manualPaidExpiresAt',
              'customPrice',
              'customPrice3',
              'customPrice6',
              'customPrice12',
              'customMaxFiles',
              'customKiibeeCutDkk',
              'customTransactionFeePct',
              'paymentPeriod',
              'customSubscriptionStatus',
            ].map((key) => [key, currentPlan[key as keyof typeof currentPlan]]),
          )
        : null;
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
        paymentPeriod: hasPrice ? input.paymentPeriod : null,
        ...(!hasPrice &&
        (input.customSubscriptionAction === 'save' ||
          input.customSubscriptionAction === 'activate')
          ? {
              customSubscriptionStatus: 'draft',
              customSubscriptionRevision: 0,
              customPreviousSettings: null,
            }
          : {}),
        ...(activating || savingOffer
          ? {
              customSubscriptionStatus: activating ? 'pending' : 'draft',
              customSubscriptionRevision:
                (currentPlan?.customSubscriptionRevision ?? 0) + 1,
              customPreviousSettings:
                currentPlan?.customPreviousSettings ?? previous,
            }
          : {}),
        updatedAt: new Date(),
      };
      if (cancelling) {
        const saved = currentPlan?.customPreviousSettings as Record<
          string,
          unknown
        > | null;
        if (saved) {
          const restored = { ...saved };
          delete restored.customMaxFiles;
          delete restored.customKiibeeCutDkk;
          delete restored.customTransactionFeePct;
          if (typeof restored.manualPaidExpiresAt === 'string')
            restored.manualPaidExpiresAt = new Date(
              restored.manualPaidExpiresAt,
            );
          Object.assign(overrides, restored, {
            customSubscriptionStatus:
              saved.customSubscriptionStatus === 'paid' ? 'paid' : 'cancelled',
            customPreviousSettings: null,
          });
        } else {
          Object.assign(overrides, {
            customSubscriptionStatus: 'cancelled',
            customPreviousSettings: null,
          });
        }
        if (!saved || saved.customSubscriptionStatus !== 'paid') {
          const [paid] = await tx
            .select({ planId: subscriptions.planId })
            .from(subscriptions)
            .where(
              and(
                eq(subscriptions.creatorId, creatorId),
                eq(subscriptions.status, 'paid'),
                gt(subscriptions.amount, '0'),
                lte(subscriptions.startAt, new Date()),
                gt(subscriptions.endAt, new Date()),
              ),
            )
            .orderBy(desc(subscriptions.createdAt))
            .limit(1);
          if (paid) overrides.planId = paid.planId;
          else if (
            !(
              currentPlan?.manuallyPaid &&
              (!currentPlan.manualPaidExpiresAt ||
                currentPlan.manualPaidExpiresAt > new Date())
            )
          ) {
            const [free] = await tx
              .select({ id: plans.id })
              .from(plans)
              .where(eq(plans.price, 0))
              .limit(1);
            if (!free)
              return fail(
                'No free fallback plan found',
                HttpStatus.BAD_REQUEST,
              );
            overrides.planId = free.id;
            overrides.manuallyPaid = false;
            overrides.manualPaidExpiresAt = null;
          }
        }
      }
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

      if (activating) upgradeRequired = true;
      if (cancelling || savingOffer) upgradeRequired = false;
      if (upgradeRequired !== creator.subscriptionUpgradeRequired) {
        await tx
          .update(users)
          .set({ subscriptionUpgradeRequired: upgradeRequired })
          .where(eq(users.id, creatorId));
      }
      const planChanged = currentPlan?.planId !== plan.id;
      if (planChanged || !upgradeRequired || activating) {
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
        (activating || planChanged || !creator.subscriptionUpgradeRequired)
      ) {
        billingRequestId = randomUUID();
        await tx.insert(adminBillingRequests).values({
          id: billingRequestId,
          creatorId,
          planId: plan.id,
          planName: plan.name,
          customRevision: activating
            ? (currentPlan?.customSubscriptionRevision ?? 0) + 1
            : null,
          amount: String(subscriptionTerms(plan.price, input).amount),
          currency:
            plan.currency === 'KR' || plan.currency === 'DK'
              ? 'DKK'
              : plan.currency || 'DKK',
          emailStatus: creator.email ? 'pending' : 'unavailable',
        });
      }
      return {
        billingRequestId,
        customOfferSaved: savingOffer,
        customOfferActivated: activating,
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
      const terms = subscriptionTerms(plan.price, input);
      const currency = ['KR', 'DK'].includes(plan.currency ?? '')
        ? 'DKK'
        : plan.currency || 'DKK';
      const feePct =
        (PLATFORM_FEE_PERCENTAGES[plan.price] ?? PLATFORM_FEE_PERCENTAGES[0]) *
        100;
      const customPlanDetails =
        notification.customOfferSaved || notification.customOfferActivated
          ? [
              { label: 'Pris', value: `${terms.amount} ${currency}` },
              {
                label: 'Betalingsperiode',
                value: `${terms.months} ${terms.months === 1 ? 'måned' : 'måneder'}`,
              },
              {
                label: 'Maks. antal filer',
                value: String(
                  input.customMaxFiles ??
                    plan.maxFiles ??
                    'Abonnementets standardgrænse',
                ),
              },
              {
                label: 'Kiibees andel',
                value:
                  input.customKiibeeCutDkk != null
                    ? `${input.customKiibeeCutDkk} DKK pr. udbetaling`
                    : `${Number(feePct.toFixed(2))}% pr. udbetaling (standard)`,
              },
              {
                label: 'Transaktionsgebyr',
                value: `${input.customTransactionFeePct ?? 5}% pr. udbetaling`,
              },
            ].map((detail) => ({
              label: escapeHtml(detail.label),
              value: escapeHtml(detail.value),
            }))
          : [];

      if (notification.customOfferSaved) {
        runInBackground(
          sendTemplateEmail({
            to: notification.email,
            cc: 'info@kiibee.com',
            subject: mailSubject.CUSTOM_SUBSCRIPTION_OFFER,
            templateName: templateName.CUSTOM_SUBSCRIPTION_OFFER,
            variables: {
              creator,
              planName,
              customPlanDetails,
              profileUrl: escapeHtml(
                `${(process.env.FRONTEND_URL || '').replace(/\/$/, '')}/dashboard/creators?view=profile`,
              ),
            },
          }),
        );
      }
      if (
        !notification.customOfferSaved &&
        (notification.planChanged || notification.billingRequestId)
      ) {
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
              customPlanDetails,
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
