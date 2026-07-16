import { eq, sql } from 'drizzle-orm';

import { db } from '../db';
import { creatorPlans, mediaFiles, plans } from '../schema';
import { SUBSCRIPTION_PLAN_ORDER } from 'src/utils/constant';

type PlanRow = {
  id: string;
  name: string;
  maxFiles: number;
};

function pickPlanForContentCount(
  availablePlans: PlanRow[],
  contentCount: number,
  currentPlanName: string | null,
): PlanRow | null {
  const byName = new Map(
    availablePlans.map((plan) => [plan.name.toLowerCase(), plan]),
  );

  const ordered = SUBSCRIPTION_PLAN_ORDER.map((name) =>
    byName.get(name.toLowerCase()),
  ).filter((plan): plan is PlanRow => Boolean(plan));

  if (!ordered.length) {
    return null;
  }

  const current =
    (currentPlanName ? byName.get(currentPlanName.toLowerCase()) : undefined) ??
    ordered[0];

  if (contentCount <= current.maxFiles) {
    return current;
  }

  const upgrade = ordered.find((plan) => plan.maxFiles >= contentCount);
  return upgrade ?? ordered[ordered.length - 1];
}

export const reconcileCreatorPlansWithContent = async () => {
  const availablePlans = await db
    .select({
      id: plans.id,
      name: plans.name,
      maxFiles: plans.maxFiles,
    })
    .from(plans)
    .where(eq(plans.isActive, true));

  if (!availablePlans.length) {
    return;
  }

  const contentRows = await db
    .select({
      creatorId: mediaFiles.creatorId,
      contentCount: sql<number>`count(*)::int`,
    })
    .from(mediaFiles)
    .groupBy(mediaFiles.creatorId);

  const contentByCreator = new Map(
    contentRows.map((row) => [row.creatorId, Number(row.contentCount ?? 0)]),
  );

  const rows = await db
    .select({
      creatorPlanId: creatorPlans.id,
      creatorId: creatorPlans.creatorId,
      planId: creatorPlans.planId,
      planName: plans.name,
      maxFiles: plans.maxFiles,
    })
    .from(creatorPlans)
    .innerJoin(plans, eq(plans.id, creatorPlans.planId));

  for (const row of rows) {
    const contentCount = contentByCreator.get(row.creatorId) ?? 0;
    const target = pickPlanForContentCount(
      availablePlans,
      contentCount,
      row.planName,
    );

    if (!target || target.id === row.planId) {
      continue;
    }

    await db
      .update(creatorPlans)
      .set({
        planId: target.id,
        updatedAt: new Date(),
      })
      .where(eq(creatorPlans.id, row.creatorPlanId));
  }
};
