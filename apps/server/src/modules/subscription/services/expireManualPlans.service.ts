import { and, eq, lte, inArray } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans, users } from 'src/database/schema';

export async function expireManualPlans(creatorId?: string) {
  return db.transaction(async (tx) => {
    const [freePlan] = await tx
      .select({ id: plans.id })
      .from(plans)
      .where(and(eq(plans.price, 0), eq(plans.isActive, true)))
      .limit(1);
    if (!freePlan) throw new Error('No active Try Kiibee plan found');
    const expired = await tx
      .update(creatorPlans)
      .set({
        planId: freePlan.id,
        manuallyPaid: false,
        manualPaidExpiresAt: null,
        customPrice: null,
        customPrice3: null,
        customPrice6: null,
        customPrice12: null,
        customMaxFiles: null,
        customKiibeeCutDkk: null,
        customTransactionFeePct: null,
        paymentPeriod: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(creatorPlans.status, 'active'),
          eq(creatorPlans.manuallyPaid, true),
          lte(creatorPlans.manualPaidExpiresAt, new Date()),
          creatorId ? eq(creatorPlans.creatorId, creatorId) : undefined,
        ),
      )
      .returning({ creatorId: creatorPlans.creatorId });
    if (expired.length)
      await tx
        .update(users)
        .set({ subscriptionUpgradeRequired: false })
        .where(
          inArray(
            users.id,
            expired.map((row) => row.creatorId),
          ),
        );
    return expired.length;
  });
}
