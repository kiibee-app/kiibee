import { eq, and, desc } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { creatorPlans, plans, users } from '../src/database/schema';
import { auditLogs } from '../src/database/schema/system/auditLogs.schema';
import { db } from '../src/database/db';
import { STATUS } from '../src/utils/constant';

function textOrNull(val: unknown): string | null {
  if (typeof val === 'string') return val;
  return null;
}

function subscriptionKey(subscription: any): string | null {
  if (!subscription || typeof subscription !== 'object') {
    return textOrNull(subscription);
  }
  return (
    textOrNull(subscription.path) ??
    textOrNull(subscription.udi) ??
    textOrNull(subscription.name)
  );
}

function resolveDesiredPlanName(subscription: any, profileKey: string): string {
  if (
    (profileKey || '').toLowerCase().includes('kammas-kantine') ||
    (profileKey || '').toLowerCase().includes('kammas_kantine')
  ) {
    return 'Pro';
  }

  const key = subscriptionKey(subscription);
  if (!key) return 'Start-up'; // Fallback to Start-up instead of Pro

  const legacyMap: Record<string, string> = {
    'umb://document/5ba7f17c7cf64beea5db1176fd45d365': 'Try Kiibee',
    'umb://document/6ae38a0b56144a55ac017545e006b9a4': 'Start-up',
    'umb://document/e46ced3f3b544a3ead6838c69a79ac8f': 'Start-up',
  };

  if (legacyMap[key]) return legacyMap[key];

  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '-');
  if (
    normalized.includes('try-kiibee') ||
    normalized.includes('proev-kiibee') ||
    normalized.includes('prov-kiibee') ||
    normalized.includes('prv-kiibee')
  ) {
    return 'Try Kiibee';
  }
  if (normalized.includes('start')) return 'Start-up';
  if (normalized.includes('pro')) return 'Start-up'; // Old mapping mapped pro to Start-up

  return 'Start-up';
}

async function main() {
  console.log('Starting creator plans fix from Umbraco data...');

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

      // Re-evaluate the correct plan name using the latest rules instead of relying on what was saved previously
      const desiredPlanName = resolveDesiredPlanName(
        details.rawFiles?.['subscription.json'],
        details.profileKey,
      );

      if (desiredPlanName) {
        const targetPlan = planMap.get(desiredPlanName);
        if (targetPlan) {
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
              id: `cp_${targetPlan.id}_${creator.id}`,
              creatorId: creator.id,
              planId: targetPlan.id,
              status: STATUS.ACTIVE,
            })
            .onConflictDoUpdate({
              target: creatorPlans.id,
              set: {
                status: STATUS.ACTIVE,
              },
            });

          console.log(
            `Updated ${creator.email} to ${targetPlan.name} plan (based on Umbraco data)`,
          );
        } else {
          console.log(`Plan not found for desired name: ${desiredPlanName}`);
        }
      }
    } else {
      console.log(`No Umbraco audit log found for ${creator.email}`);
    }
  }

  console.log('Done fixing from Umbraco data!');
  process.exit(0);
}

main().catch(console.error);
