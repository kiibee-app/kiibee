import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const getCreatorPlan = async (creatorId: string) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }
    const creatorCurrentPlan = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, creatorId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .limit(1);

    if (!creatorCurrentPlan || creatorCurrentPlan.length === 0) {
      const plan = await db
        .select()
        .from(plans)
        .where(eq(plans.price, 0))
        .limit(1);
      return success(
        plan,
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

    return success(plan, 'Creator plan retrieved successfully', HttpStatus.OK);
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
