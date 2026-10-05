import { eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { creatorPlans, plans, users } from '../src/database/schema';
import { db } from '../src/database/db';
import { STATUS } from '../src/utils/constant';

async function main() {
  console.log('Starting creator plans manual price adjustment...');

  const startupPlan = await db.query.plans.findFirst({
    where: (t) => eq(t.name, 'Start-up'),
  });

  if (!startupPlan) throw new Error('Start-up plan not found');

  const targetCreators = await db
    .select({ user: users })
    .from(users)
    .innerJoin(creatorPlans, eq(creatorPlans.creatorId, users.id))
    .innerJoin(plans, eq(creatorPlans.planId, plans.id))
    .where(
      and(
        eq(creatorPlans.status, STATUS.ACTIVE),
        eq(plans.name, 'Pro'),
        eq(users.role, 'creator'),
      ),
    )
    .then((res) =>
      res.map((r) => r.user).filter((u) => u.email !== 'jakob@kafekammas.dk'),
    );

  for (const creator of targetCreators) {
    // Deactivate existing plans
    await db
      .update(creatorPlans)
      .set({ status: STATUS.INACTIVE })
      .where(
        and(
          eq(creatorPlans.creatorId, creator.id),
          eq(creatorPlans.status, STATUS.ACTIVE),
        ),
      );

    // Insert new active plan
    await db
      .insert(creatorPlans)
      .values({
        id: `cp_${startupPlan.id}_${creator.id}`,
        creatorId: creator.id,
        planId: startupPlan.id,
        status: STATUS.ACTIVE,
      })
      .onConflictDoUpdate({
        target: creatorPlans.id,
        set: { status: STATUS.ACTIVE },
      });

    console.log(`Updated ${creator.email} to Start-up plan (99,00 kr)`);
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
