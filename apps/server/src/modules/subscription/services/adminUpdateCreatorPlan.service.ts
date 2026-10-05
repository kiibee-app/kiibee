import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { randomUUID } from 'crypto';

interface AdminUpdateCreatorPlanInput {
  planId: string;
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

    const plan = await db
      .select()
      .from(plans)
      .where(eq(plans.id, input.planId));

    if (!plan || plan.length === 0) {
      return fail('Invalid plan ID', HttpStatus.BAD_REQUEST);
    }

    // Upsert or update the current active creator plan
    const activePlans = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, creatorId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .orderBy(desc(creatorPlans.createdAt));

    if (activePlans.length > 0) {
      const currentPlan = activePlans[0];
      await db
        .update(creatorPlans)
        .set({
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
        })
        .where(eq(creatorPlans.id, currentPlan.id));
    } else {
      await db.insert(creatorPlans).values({
        id: randomUUID(),
        creatorId,
        planId: input.planId,
        status: 'active',
        customPrice: input.customPrice,
        customPrice3: input.customPrice3,
        customPrice6: input.customPrice6,
        customPrice12: input.customPrice12,
        customMaxFiles: input.customMaxFiles,
        customKiibeeCutDkk: input.customKiibeeCutDkk,
        customTransactionFeePct: input.customTransactionFeePct,
        paymentPeriod: input.paymentPeriod,
      });
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
