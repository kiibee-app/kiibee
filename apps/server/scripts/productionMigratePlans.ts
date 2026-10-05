import { eq, and } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { creatorPlans, plans, users } from '../src/database/schema';
import { auditLogs } from '../src/database/schema/system/auditLogs.schema';
import { db } from '../src/database/db';
import { STATUS } from '../src/utils/constant';

function resolveDesiredPlanName(
  subscriptionField: any,
  profileKey: string,
): string {
  if (
    (profileKey || '').toLowerCase().includes('kammas-kantine') ||
    (profileKey || '').toLowerCase().includes('kammas_kantine')
  ) {
    return 'Pro'; // Kammas Kantine exception (25 kr)
  }

  if (!subscriptionField || typeof subscriptionField !== 'string') {
    // Explicit list of those without a legacy UDI who should still be 99kr
    const startupExceptions = [
      'damkjaermedier',
      'damkjær',
      'stopsygefravær',
      'find-dig-ikke-i-smerte',
      'find_dig_ikke_i_smerte',
    ];
    const lowerKey = (profileKey || '').toLowerCase();

    if (startupExceptions.some((ex) => lowerKey.includes(ex))) {
      return 'Start-up';
    }

    return 'Try Kiibee';
  }

  const legacyMap: Record<string, string> = {
    'umb://document/5ba7f17c7cf64beea5db1176fd45d365': 'Try Kiibee',
    'umb://document/6ae38a0b56144a55ac017545e006b9a4': 'Start-up', // The 99kr ones
    'umb://document/e46ced3f3b544a3ead6838c69a79ac8f': 'Start-up', // The 99kr ones
  };

  if (legacyMap[subscriptionField]) return legacyMap[subscriptionField];

  const normalized = subscriptionField.toLowerCase().replace(/[^a-z0-9]/g, '-');
  if (
    normalized.includes('try-kiibee') ||
    normalized.includes('proev-kiibee') ||
    normalized.includes('prov-kiibee') ||
    normalized.includes('prv-kiibee')
  ) {
    return 'Try Kiibee';
  }
  if (normalized.includes('start')) return 'Start-up';
  if (normalized.includes('pro')) return 'Start-up'; // Those matched 'pro' string should be 99kr Start-up

  return 'Start-up'; // Default fallback for unknown paid plans
}

async function main() {
  console.log('Starting master production migration for ALL creators...');

  const allPlans = await db.select().from(plans);
  const planMap = new Map(allPlans.map((p) => [p.name, p]));

  const allCreators = await db
    .select()
    .from(users)
    .where(eq(users.role, 'creator'));

  for (const creator of allCreators) {
    const latestAuditLog = await db.query.auditLogs.findFirst({
      where: (t) =>
        and(eq(t.userId, creator.id), eq(t.action, 'umbraco_profile_seed')),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });

    if (latestAuditLog && latestAuditLog.details) {
      const details = latestAuditLog.details as any;
      const subJson = details.rawFiles?.['subscription.json'];

      // Calculate exactly what plan they should be on according to the final rules
      const desiredPlanName = resolveDesiredPlanName(
        subJson?.subscription,
        details.profileKey,
      );

      const targetPlan = planMap.get(desiredPlanName);
      if (targetPlan) {
        // Apply the correct plan directly
        await db
          .update(creatorPlans)
          .set({ status: STATUS.INACTIVE })
          .where(
            and(
              eq(creatorPlans.creatorId, creator.id),
              eq(creatorPlans.status, STATUS.ACTIVE),
            ),
          );

        await db
          .insert(creatorPlans)
          .values({
            id: `cp_${targetPlan.id}_${creator.id}`,
            creatorId: creator.id,
            planId: targetPlan.id,
            status: STATUS.ACTIVE,
          })
          .onConflictDoUpdate({
            target: creatorPlans.id,
            set: { status: STATUS.ACTIVE },
          });

        console.log(`Syncing ${creator.email} to ${targetPlan.name} plan`);
      }
    }
  }

  console.log(
    'Master migration complete! EVERYONE is now on their perfectly correct legacy plan.',
  );
  process.exit(0);
}

main().catch(console.error);
