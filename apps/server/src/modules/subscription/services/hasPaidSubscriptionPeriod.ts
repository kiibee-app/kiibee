import { and, desc, eq, gt, lte } from 'drizzle-orm';
import type { db } from 'src/database/db';
import { creatorPlans, subscriptions } from 'src/database/schema';

export async function hasPaidSubscriptionPeriod(
  database: Pick<typeof db, 'select'>,
  creatorId: string,
  planId?: string,
) {
  const [manualPlan] = await database
    .select({
      manuallyPaid: creatorPlans.manuallyPaid,
      expiresAt: creatorPlans.manualPaidExpiresAt,
    })
    .from(creatorPlans)
    .where(
      and(
        eq(creatorPlans.creatorId, creatorId),
        eq(creatorPlans.status, 'active'),
        planId ? eq(creatorPlans.planId, planId) : undefined,
      ),
    )
    .orderBy(desc(creatorPlans.createdAt))
    .limit(1);
  if (
    manualPlan?.manuallyPaid &&
    (!manualPlan.expiresAt || manualPlan.expiresAt > new Date())
  )
    return true;

  const assignedPlan =
    planId ??
    database
      .select({ planId: creatorPlans.planId })
      .from(creatorPlans)
      .where(
        and(
          eq(creatorPlans.creatorId, creatorId),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .orderBy(desc(creatorPlans.createdAt))
      .limit(1);

  const now = new Date();
  const [paidPeriod] = await database
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.creatorId, creatorId),
        eq(subscriptions.planId, assignedPlan),
        eq(subscriptions.status, 'paid'),
        gt(subscriptions.amount, '0'),
        lte(subscriptions.startAt, now),
        gt(subscriptions.endAt, now),
      ),
    )
    .limit(1);

  return Boolean(paidPeriod);
}
