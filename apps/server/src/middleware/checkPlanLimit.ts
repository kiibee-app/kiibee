import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';

import { db } from 'src/database/db';
import { creatorPlans, mediaFiles, plans, users } from 'src/database/schema';
import { ROLE } from 'src/utils/constant';

@Injectable()
export class CheckPlanLimit implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== ROLE.CREATOR) {
      throw new ForbiddenException('Only creators are subject to plan limits');
    }

    const [creatorPlan] = await db
      .select({
        planId: creatorPlans.planId,
      })
      .from(creatorPlans)
      .where(eq(creatorPlans.creatorId, userId));

    if (!creatorPlan) {
      throw new NotFoundException(
        'No subscription plan found for this creator',
      );
    }

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, creatorPlan.planId));

    if (!plan) {
      throw new NotFoundException('Plan details not found');
    }

    const [existingContentCount] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(mediaFiles)
      .where(eq(mediaFiles.creatorId, userId));

    if (Number(existingContentCount.count) >= plan.maxFiles) {
      throw new ForbiddenException(
        `Content limit of ${plan.maxFiles} reached for your plan, please upgrade to add more content`,
      );
    }

    return true;
  }
}
