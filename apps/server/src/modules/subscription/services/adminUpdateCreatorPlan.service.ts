import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorChannels,
  creatorPlans,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
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

    const [creatorUser] = await db
      .select({ id: users.id })
      .from(users)
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .where(
        and(
          or(eq(users.id, creatorId), eq(creatorChannels.slug, creatorId)),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
      .limit(1);

    if (!creatorUser) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    const targetUserId = creatorUser.id;

    const [targetPlan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, input.planId))
      .limit(1);

    if (!targetPlan) {
      return fail('Invalid plan ID', HttpStatus.BAD_REQUEST);
    }

    // Upsert or update the current active creator plan
    const activePlans = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, targetUserId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .orderBy(desc(creatorPlans.createdAt));

    let savedOverrides: any = null;

    if (activePlans.length > 0) {
      const currentPlan = activePlans[0];
      const [updated] = await db
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
        .where(eq(creatorPlans.id, currentPlan.id))
        .returning();
      savedOverrides = updated;

      if (activePlans.length > 1) {
        for (let i = 1; i < activePlans.length; i++) {
          await db
            .update(creatorPlans)
            .set({ status: 'inactive', updatedAt: new Date() })
            .where(eq(creatorPlans.id, activePlans[i].id));
        }
      }
    } else {
      const [inserted] = await db
        .insert(creatorPlans)
        .values({
          id: randomUUID(),
          creatorId: targetUserId,
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
        })
        .returning();
      savedOverrides = inserted;
    }

    return success(
      {
        plan: targetPlan,
        overrides: savedOverrides,
        hasSubscription: true,
      },
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
