import { eq } from 'drizzle-orm';

import { db } from '../db';
import { plans } from '../schema/subscription/plans.schema';
import { SUBSCRIPTION_PLAN } from 'src/utils/constant';

const PLAN_SEEDS = [
  {
    name: SUBSCRIPTION_PLAN.TRY_KIIBEE,
    price: 0,
    billingCycle: 'monthly',
    maxFiles: 2,
    isActive: true,
  },
  {
    name: SUBSCRIPTION_PLAN.START_UP,
    price: 99,
    billingCycle: 'monthly',
    maxFiles: 10,
    isActive: true,
  },
  {
    name: SUBSCRIPTION_PLAN.PRO,
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
