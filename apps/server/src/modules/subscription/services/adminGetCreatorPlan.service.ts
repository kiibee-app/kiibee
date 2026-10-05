import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, desc } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const adminGetCreatorPlan = async (creatorId: string) => {
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
      .orderBy(desc(creatorPlans.createdAt))
      .limit(1);

    if (!creatorCurrentPlan || creatorCurrentPlan.length === 0) {
      return success(null, 'No active plan found', HttpStatus.OK);
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorCurrentPlan[0].planId));

    if (!plan) {
      return fail('Plan details not found', HttpStatus.NOT_FOUND);
    }

    return success(
      {
        plan,
        overrides: creatorCurrentPlan[0],
      },
      'Creator plan retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error getting admin creator plan:', error);
    if (error instanceof HttpException) {
      throw error;
    }
    return fail(
      'Failed to retrieve creator plan',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
