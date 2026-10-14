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

export const adminGetCreatorPlan = async (creatorId: string) => {
  try {
    if (!creatorId) {
      return fail('Creator ID is required', HttpStatus.BAD_REQUEST);
    }

    const [creatorUser] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
      })
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

    const creatorCurrentPlan = await db
      .select()
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, targetUserId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .orderBy(desc(creatorPlans.createdAt))
      .limit(1);

    if (!creatorCurrentPlan || creatorCurrentPlan.length === 0) {
      const [defaultPlan] = await db
        .select()
        .from(plans)
        .where(eq(plans.isActive, true))
        .orderBy(plans.price)
        .limit(1);

      return success(
        {
          plan: defaultPlan || null,
          overrides: null,
          hasSubscription: false,
        },
        'No active subscription found. Default plan provided.',
        HttpStatus.OK,
      );
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorCurrentPlan[0].planId));

    if (!plan) {
      const [fallbackPlan] = await db
        .select()
        .from(plans)
        .where(eq(plans.isActive, true))
        .orderBy(plans.price)
        .limit(1);

      return success(
        {
          plan: fallbackPlan || null,
          overrides: creatorCurrentPlan[0],
          hasSubscription: true,
        },
        'Assigned plan details not found, using fallback plan',
        HttpStatus.OK,
      );
    }

    return success(
      {
        plan,
        overrides: creatorCurrentPlan[0],
        hasSubscription: true,
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
