import { eq } from 'drizzle-orm';

import { db } from '../db';
import { auditLogs, users } from '../schema';
import {
  batchInsert,
  findUmbracoUsersRoot,
  loadProfileKeys,
  normalizeEmail,
  parseDate,
  profileUserId,
  readItemsFile,
  textOrNull,
  umbracoSeedUuid,
  type JsonRecord,
} from './umbracoSeed.helpers';

const BATCH_SIZE = 500;

export const seedUmbracoLogs = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco logs seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
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

  const pendingLogs: (typeof auditLogs.$inferInsert)[] = [];
  let profilesProcessed = 0;
  let logsProcessed = 0;
  let logsSkipped = 0;

  for (const profileKey of loadProfileKeys(root)) {
    const creatorId = profileUserId(profileKey);
    if (!existingCreatorIds.has(creatorId)) {
      continue;
    }

    const logs = readItemsFile(profileKey, root, 'logs');
    if (!logs?.length) {
      continue;
    }

    profilesProcessed += 1;

    for (const log of logs) {
      const logKey = textOrNull(log.key)?.toLowerCase();
      if (!logKey) {
        logsSkipped += 1;
        continue;
      }

      const fields = (log.fields as JsonRecord | undefined) ?? {};
      const buyerEmail = normalizeEmail(fields.email);
      const createdAt = parseDate(log.createDate) ?? new Date();
      const logId = umbracoSeedUuid('log', profileKey, logKey);

      pendingLogs.push({
        id: logId,
        userId: creatorId,
        action: 'umbraco_log_seed',
        entityType: 'umbraco_transaction_log',
        entityId: textOrNull(log.name),
        details: {
          source: 'umbraco-data/logs',
          profileKey,
          logKey,
          mapped: {
            fullName: textOrNull(fields.fullName),
            email: buyerEmail,
            price: textOrNull(fields.price),
            isPurchase: textOrNull(fields.isPurchase),
            paytype: textOrNull(fields.paytype),
            acquirer: textOrNull(fields.acquirer),
            transactionId: textOrNull(fields.transactionID),
            media: textOrNull(fields.media),
          },
          raw: log,
        },
        createdAt,
      });

      logsProcessed += 1;
    }
  }

  await batchInsert(pendingLogs, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(auditLogs)
        .values(row)
        .onConflictDoUpdate({
          target: auditLogs.id,
          set: {
            userId: row.userId,
            entityId: row.entityId,
            details: row.details,
            createdAt: row.createdAt,
          },
        });
    }
  });

  console.log(
    `Umbraco logs seed completed (${logsProcessed} logs across ${profilesProcessed} profiles, ${logsSkipped} skipped from ${root})`,
  );
};
