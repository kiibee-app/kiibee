import { db } from '../db';
import { auditLogs, creatorPayouts } from '../schema';
import {
  batchInsert,
  findUmbracoUsersRoot,
  isEnabled,
  loadProfileKeys,
  parseDate,
  parseDecimal,
  profileUserId,
  readItemsFile,
  textOrNull,
  umbracoSeedUuid,
  type JsonRecord,
} from './umbracoSeed.helpers';
import { loadSeededProfileUserIds } from './umbracoSeed.db';

const BATCH_SIZE = 100;

export const seedUmbracoPayouts = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco payouts seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const seededProfileUserIds = await loadSeededProfileUserIds(root);

  const pendingPayouts: (typeof creatorPayouts.$inferInsert)[] = [];
  const pendingAuditLogs: (typeof auditLogs.$inferInsert)[] = [];
  let profilesProcessed = 0;
  let payoutsProcessed = 0;
  let payoutsSkipped = 0;

  for (const profileKey of loadProfileKeys(root)) {
    const creatorId = profileUserId(profileKey);
    if (!seededProfileUserIds.has(creatorId)) {
      continue;
    }

    const payouts = readItemsFile(profileKey, root, 'payouts');
    if (!payouts?.length) {
      continue;
    }

    profilesProcessed += 1;

    for (const payout of payouts) {
      const payoutKey = textOrNull(payout.key)?.toLowerCase();
      const amount =
        parseDecimal(payout.amount) ??
        parseDecimal((payout.properties as JsonRecord | undefined)?.amount);

      if (!payoutKey || !amount) {
        payoutsSkipped += 1;
        continue;
      }

      const createdAt =
        parseDate(payout.payoutCreateDate) ??
        parseDate(payout.createDate) ??
        new Date();
      const payoutDate =
        parseDate((payout.properties as JsonRecord | undefined)?.to) ??
        createdAt;
      const isPaid =
        isEnabled(payout.isPaid) ||
        isEnabled((payout.properties as JsonRecord | undefined)?.isPaid);
      const payoutId = umbracoSeedUuid('payout', profileKey, payoutKey);
      const creditNo = textOrNull(payout.name)?.slice(0, 50) ?? null;
      const properties = (payout.properties as JsonRecord | undefined) ?? {};

      pendingPayouts.push({
        id: payoutId,
        creatorId,
        amount,
        currency: 'DKK',
        status: isPaid ? 'completed' : 'pending',
        creditNo,
        bankAccountInfo: textOrNull(payout.publicPayoutUrl),
        payoutDate: isPaid ? payoutDate : null,
        createdAt,
        updatedAt: createdAt,
      });

      pendingAuditLogs.push({
        id: umbracoSeedUuid('payout-audit', profileKey, payoutKey),
        userId: creatorId,
        action: 'umbraco_payout_seed',
        entityType: 'creator_payout',
        entityId: payoutId,
        details: {
          source: 'umbraco-data/payouts',
          profileKey,
          payoutKey,
          mapped: {
            creditNo,
            amount,
            isPaid,
            salesAmount: textOrNull(properties.salesAmount),
            rentAmount: textOrNull(properties.rentAmount),
            rawEarnings: textOrNull(properties.rawEarnings),
            kiibeeCutAmount: textOrNull(properties.kiibeeCutAmount),
          },
          raw: payout,
        },
        createdAt,
      });

      payoutsProcessed += 1;
    }
  }

  await batchInsert(pendingPayouts, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(creatorPayouts)
        .values(row)
        .onConflictDoUpdate({
          target: creatorPayouts.id,
          set: {
            amount: row.amount,
            status: row.status,
            creditNo: row.creditNo,
            bankAccountInfo: row.bankAccountInfo,
            payoutDate: row.payoutDate,
            updatedAt: row.updatedAt,
          },
        });
    }
  });

  await batchInsert(pendingAuditLogs, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(auditLogs)
        .values(row)
        .onConflictDoNothing({ target: auditLogs.id });
    }
  });

  console.log(
    `Umbraco payouts seed completed (${payoutsProcessed} payouts across ${profilesProcessed} profiles, ${payoutsSkipped} skipped from ${root})`,
  );
};
