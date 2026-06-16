import { eq } from 'drizzle-orm';

import { db } from '../db';
import { plans } from '../schema/subscription/plans.schema';

const PLAN_SEEDS = [
  {
    name: 'Try Kiibee',
    price: 0,
    billingCycle: 'monthly',
    maxFiles: 2,
    isActive: true,
  },
  {
    name: 'Start-up',
    price: 99,
    billingCycle: 'monthly',
    maxFiles: 10,
    isActive: true,
  },
  {
    name: 'Pro',
    price: 299,
    billingCycle: 'monthly',
    maxFiles: 70,
    isActive: true,
  },
] as const;

export const seedPlans = async () => {
  let inserted = 0;
  let skipped = 0;

  for (const plan of PLAN_SEEDS) {
    const [existing] = await db
      .select({ id: plans.id })
      .from(plans)
      .where(eq(plans.name, plan.name))
      .limit(1);

    if (existing) {
      skipped += 1;
      continue;
    }

    await db.insert(plans).values(plan);
    inserted += 1;
  }

  console.log(
    `Plans seeded successfully (${inserted} inserted, ${skipped} already existed)`,
  );
};
