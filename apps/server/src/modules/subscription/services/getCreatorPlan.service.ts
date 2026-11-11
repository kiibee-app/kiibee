import { expireManualPlans } from './expireManualPlans.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc } from 'drizzle-orm';
import { hasPaidSubscriptionPeriod } from './hasPaidSubscriptionPeriod';
import { db } from 'src/database/db';
import { creatorPlans, plans, users } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCreatorPlan = async (creatorId: string) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }
    await expireManualPlans(creatorId);
    const [creator] = await db
      .select({
        subscriptionUpgradeRequired: users.subscriptionUpgradeRequired,
      })
      .from(users)
      .where(eq(users.id, creatorId));
    let subscriptionUpgradeRequired =
      creator?.subscriptionUpgradeRequired ?? false;

    const creatorCurrentPlan = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, creatorId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .orderBy(desc(creatorPlans.createdAt))
      .limit(1);

    if (!creatorCurrentPlan || creatorCurrentPlan.length === 0) {
      const [freePlan] = await db
        .select()
        .from(plans)
        .where(eq(plans.price, 0))
        .limit(1);
      return success(
        freePlan
          ? [{ ...freePlan, isPaidPlan: false, subscriptionUpgradeRequired }]
          : [],
        'Creator plan retrieved successfully',
        HttpStatus.OK,
      );
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorCurrentPlan[0].planId));

    if (!plan) {
      return fail('Plan details not found', HttpStatus.NOT_FOUND);
    }

    if (
      (subscriptionUpgradeRequired || creatorCurrentPlan[0].manuallyPaid) &&
      plan.price > 0
    ) {
      subscriptionUpgradeRequired = !(await hasPaidSubscriptionPeriod(
        db,
        creatorId,
        plan.id,
      ));
    }

    const overriddenPlan = {
      ...plan,
      isPaidPlan: plan.price > 0,
      manuallyPaid: Boolean(
        plan.price > 0 &&
        creatorCurrentPlan[0].manuallyPaid &&
        (!creatorCurrentPlan[0].manualPaidExpiresAt ||
          creatorCurrentPlan[0].manualPaidExpiresAt > new Date()),
      ),
      isActive: plan.isActive && !subscriptionUpgradeRequired,
      subscriptionUpgradeRequired,
      price: creatorCurrentPlan[0].customPrice ?? plan.price,
      maxFiles: creatorCurrentPlan[0].customMaxFiles ?? plan.maxFiles,
    };

    return success(
      [overriddenPlan],
      'Creator plan retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error setting up creator account:', error);

    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to retrieve creator plan',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
