import 'dotenv/config';
import { eq, and } from 'drizzle-orm';

import { creatorPlans, plans, users } from '../src/database/schema';
import { subscriptions } from '../src/database/schema/subscription/subscriptionInvoices.schema';
import { db } from '../src/database/db';
import { STATUS } from '../src/utils/constant';

async function main() {
  console.log('Starting creator plans fix...');

  const allPlans = await db.select().from(plans);
  const freePlan = allPlans.find((p) => Number(p.price) === 0);
  const startupPlan = allPlans.find((p) => Number(p.price) === 99);
  const proPlan = allPlans.find((p) => Number(p.price) === 299);

  if (!freePlan || !startupPlan || !proPlan) {
    throw new Error('Could not find all plans');
  }

  const allCreators = await db
    .select()
    .from(users)
    .where(eq(users.role, 'creator'));

  for (const creator of allCreators) {
    const latestSub = await db.query.subscriptions.findFirst({
      where: (t) => and(eq(t.creatorId, creator.id), eq(t.status, 'paid')),
      orderBy: (t, { desc }) => [desc(t.processedAt), desc(t.createdAt)],
    });

    let targetPlan = freePlan;
    if (latestSub) {
      if (Number(latestSub.amount) === 99) {
        targetPlan = startupPlan;
      } else if (Number(latestSub.amount) === 299) {
        targetPlan = proPlan;
      }
    }

    await db
      .update(creatorPlans)
      .set({ status: STATUS.INACTIVE })
      .where(
        and(
          eq(creatorPlans.creatorId, creator.id),
          eq(creatorPlans.status, STATUS.ACTIVE),
        ),
      );

    await db.insert(creatorPlans).values({
      id: `cp_${targetPlan.id}_${creator.id}`,
      creatorId: creator.id,
      planId: targetPlan.id,
      status: STATUS.ACTIVE,
    });

    console.log(
      `Updated ${creator.email} to ${targetPlan.name} plan (based on ${latestSub ? latestSub.amount : 'no sub'})`,
    );
  }

  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
