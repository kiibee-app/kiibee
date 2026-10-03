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
    textOrNull(subscription.subscription) ??
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
    return 'Start-up';
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

  const skipList = [
    'elsebeth fogh',
    'stopsygefravær',
    'tegnestuen undertryk',
    'nsccm',
    'elias ehlers',
    'elstudio',
    'gitte hildebrandt',
    'gottleben',
    'lindhardt',
  ];

  for (const creator of allCreators) {
    const searchString =
      `${creator.fullName || ''} ${creator.email || ''}`.toLowerCase();
    if (
      skipList.some((skipStr) => searchString.includes(skipStr.toLowerCase()))
    ) {
      console.log(
        `Skipping and deleting creator from skip list: ${creator.fullName} (${creator.email})`,
      );
      await db
        .update(users)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
          status: 'deleted',
        })
        .where(eq(users.id, creator.id));
      continue;
    }
    const latestAuditLog = await db.query.auditLogs.findFirst({
      where: (t) =>
        and(eq(t.userId, creator.id), eq(t.action, 'umbraco_profile_seed')),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });

    if (latestAuditLog && latestAuditLog.details) {
      const details = latestAuditLog.details as any;

      // Re-evaluate the correct plan name using the latest rules instead of relying on what was saved previously
      let desiredPlanName = resolveDesiredPlanName(
        details.rawFiles?.['subscription.json'],
        details.profileKey,
      );

      if (desiredPlanName) {
        let targetPlan = planMap.get(desiredPlanName);
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

          let customPriceOverride: number | null = null;
          let customPrice3: number | null = null;
          let customPrice6: number | null = null;
          let customPrice12: number | null = null;
          let paymentPeriod: string | null = null;

          const subscriptionJson =
            details.rawFiles?.['subscription.json'] || {};

          if (
            subscriptionJson.price &&
            String(subscriptionJson.price).trim() !== ''
          ) {
            customPriceOverride = Number(String(subscriptionJson.price).trim());
            if (isNaN(customPriceOverride)) customPriceOverride = null;
          }
          if (
            subscriptionJson.price3 &&
            String(subscriptionJson.price3).trim() !== ''
          ) {
            customPrice3 = Number(String(subscriptionJson.price3).trim());
            if (isNaN(customPrice3)) customPrice3 = null;
          }
          if (
            subscriptionJson.price6 &&
            String(subscriptionJson.price6).trim() !== ''
          ) {
            customPrice6 = Number(String(subscriptionJson.price6).trim());
            if (isNaN(customPrice6)) customPrice6 = null;
          }
          if (
            subscriptionJson.price12 &&
            String(subscriptionJson.price12).trim() !== ''
          ) {
            customPrice12 = Number(String(subscriptionJson.price12).trim());
            if (isNaN(customPrice12)) customPrice12 = null;
          }

          // Map Umbraco PreValue IDs to actual month numbers
          const periodMap: Record<string, string> = {
            '385': '1',
            '386': '3',
            '387': '6',
            '388': '12',
          };

          if (
            subscriptionJson.paymentPeriod &&
            Array.isArray(subscriptionJson.paymentPeriod) &&
            subscriptionJson.paymentPeriod.length > 0
          ) {
            const rawVal = String(subscriptionJson.paymentPeriod[0]).trim();
            paymentPeriod = periodMap[rawVal] || rawVal;
          } else if (
            subscriptionJson.paymentPeriod &&
            String(subscriptionJson.paymentPeriod).trim() !== ''
          ) {
            const rawVal = String(subscriptionJson.paymentPeriod).trim();
            paymentPeriod = periodMap[rawVal] || rawVal;
          }

          // Automatically correct the plan if they have a custom price (typically means they are on Start-up)
          if (
            (customPriceOverride !== null || customPrice12 !== null) &&
            desiredPlanName !== 'Pro'
          ) {
            desiredPlanName = 'Start-up';
            targetPlan = planMap.get('Start-up') || targetPlan;
          }

          let customMaxFiles: number | null = null;
          if (
            subscriptionJson.maxFiles &&
            String(subscriptionJson.maxFiles).trim() !== ''
          ) {
            customMaxFiles = Number(String(subscriptionJson.maxFiles).trim());
            if (isNaN(customMaxFiles)) customMaxFiles = null;
          }

          let customKiibeeCutDkk: number | null = null;
          if (
            subscriptionJson.kiibeeCut &&
            String(subscriptionJson.kiibeeCut).trim() !== ''
          ) {
            customKiibeeCutDkk = Number(
              String(subscriptionJson.kiibeeCut).trim(),
            );
            if (isNaN(customKiibeeCutDkk)) customKiibeeCutDkk = null;
          }

          let customTransactionFeePct: number | null = null;
          if (
            subscriptionJson.transactionFee &&
            String(subscriptionJson.transactionFee).trim() !== ''
          ) {
            customTransactionFeePct = Number(
              String(subscriptionJson.transactionFee).trim(),
            );
            if (isNaN(customTransactionFeePct)) customTransactionFeePct = null;
          }
          if (!targetPlan) {
            console.error(`Target plan ${desiredPlanName} not found!`);
            continue;
          }

          // Insert new active plan
          await db
            .insert(creatorPlans)
            .values({
              id: `cp_${targetPlan.id}_${creator.id}`,
              creatorId: creator.id,
              planId: targetPlan.id,
              status: STATUS.ACTIVE,
              customPrice: customPriceOverride,
              customPrice3: customPrice3,
              customPrice6: customPrice6,
              customPrice12: customPrice12,
              paymentPeriod: paymentPeriod,
              customMaxFiles: customMaxFiles,
              customKiibeeCutDkk: customKiibeeCutDkk,
              customTransactionFeePct: customTransactionFeePct,
            })
            .onConflictDoUpdate({
              target: creatorPlans.id,
              set: {
                status: STATUS.ACTIVE,
                customPrice: customPriceOverride,
                customPrice3: customPrice3,
                customPrice6: customPrice6,
                customPrice12: customPrice12,
                paymentPeriod: paymentPeriod,
                customMaxFiles: customMaxFiles,
                customKiibeeCutDkk: customKiibeeCutDkk,
                customTransactionFeePct: customTransactionFeePct,
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
