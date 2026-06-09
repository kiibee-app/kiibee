import { eq } from 'drizzle-orm';

import { db } from '../db';
import { auditLogs, creatorPayouts, users } from '../schema';
import {
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

export const seedUmbracoPayouts = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco payouts seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const existingCreatorIds = new Set(
    (
      await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, 'creator'))
    ).map((row) => row.id),
  );

  let profilesProcessed = 0;
  let payoutsProcessed = 0;
  let payoutsSkipped = 0;

  for (const profileKey of loadProfileKeys(root)) {
    const creatorId = profileUserId(profileKey);
    if (!existingCreatorIds.has(creatorId)) {
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

      await db
        .insert(creatorPayouts)
        .values({
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
        })
        .onConflictDoUpdate({
          target: creatorPayouts.id,
          set: {
            amount,
            status: isPaid ? 'completed' : 'pending',
            creditNo,
            bankAccountInfo: textOrNull(payout.publicPayoutUrl),
            payoutDate: isPaid ? payoutDate : null,
            updatedAt: createdAt,
          },
        });

      await db
        .insert(auditLogs)
        .values({
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
        })
        .onConflictDoNothing({ target: auditLogs.id });

      payoutsProcessed += 1;
    }
  }

  console.log(
    `Umbraco payouts seed completed (${payoutsProcessed} payouts across ${profilesProcessed} profiles, ${payoutsSkipped} skipped from ${root})`,
  );
};
