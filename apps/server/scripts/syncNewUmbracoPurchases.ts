import 'dotenv/config';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

import { db } from '../src/database/db';
import {
  auditLogs,
  collections,
  mediaFiles,
  orders,
  payments,
  userContentAccess,
  users,
} from '../src/database/schema';
import { hashPassword } from 'src/utils/passwordHash';
import {
  batchInsert,
  findUmbracoUsersRoot,
  isSkippedUmbracoProfile,
  mapPaymentProvider,
  normalizeEmail,
  parseDate,
  parseDecimal,
  profileSeedKey,
  profileUserId,
  resolveMediaFileId,
  resolvePurchaseMediaKey,
  textOrNull,
  umbracoSeedUuid,
  viewerUserId,
  type JsonRecord,
} from '../src/database/seed/umbracoSeed.helpers';

type LogLookup = {
  transactionId: string | null;
  paytype: string | null;
  acquirer: string | null;
};

type PendingViewer = {
  id: string;
  email: string;
  fullName: string;
};

type PendingOrder = typeof orders.$inferInsert;
type PendingPayment = typeof payments.$inferInsert;
type PendingAccess = typeof userContentAccess.$inferInsert;

const BATCH_SIZE = 250;

const KNOWN_TRASHED_PROFILE_KEYS = new Set([
  'lykkeneumann',
  'tomfrankrasmussen',
]);

function normalizeProfileKey(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function isTrashedProfile(
  profileKey: string,
  info?: JsonRecord | null,
): boolean {
  const norm = normalizeProfileKey(profileKey);
  if (KNOWN_TRASHED_PROFILE_KEYS.has(norm)) {
    return true;
  }
  if (!info) return false;
  if (info.trashed === true) return true;
  const pathVal = String(info.path || '');
  if (
    pathVal.includes(',-20,') ||
    pathVal.endsWith(',-20') ||
    pathVal.startsWith('-1,-20')
  ) {
    return true;
  }
  return false;
}

function readJsonFile<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function buildLogLookup(
  profileKey: string,
  root: string,
): Map<string, LogLookup> {
  const lookup = new Map<string, LogLookup>();
  const logsPath = join(root, profileKey, 'logs', 'items.json');
  const logs = readJsonFile<JsonRecord[]>(logsPath) ?? [];

  for (const log of logs) {
    const name = textOrNull(log.name)?.toLowerCase();
    if (!name) continue;

    const fields = (log.fields as JsonRecord | undefined) ?? {};
    lookup.set(name, {
      transactionId: textOrNull(fields.transactionID),
      paytype: textOrNull(fields.paytype),
      acquirer: textOrNull(fields.acquirer),
    });
  }

  return lookup;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? 'Viewer',
    lastName: parts.slice(1).join(' ') || 'Account',
  };
}

function isDbConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const anyErr = err as any;
  const code = anyErr.code || anyErr.cause?.code;
  const msg =
    String(anyErr.message || '') + ' ' + String(anyErr.cause?.message || '');
  return (
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    msg.includes('Connection terminated') ||
    msg.includes('connect ECONNREFUSED') ||
    msg.includes('ECONNREFUSED')
  );
}

export async function syncNewUmbracoPurchases() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const creatorArg = args
    .find((a) => a.startsWith('--creator='))
    ?.replace('--creator=', '')
    ?.trim();

  console.log(`\n======================================================`);
  console.log(`  SAFE NON-DESTRUCTIVE UMBRACO PURCHASES & VIEWERS SYNC`);
  console.log(`  Mode: ${isDryRun ? 'DRY-RUN (Preview Only)' : 'LIVE SYNC'}`);
  if (creatorArg) {
    console.log(`  Target Creator Filter: "${creatorArg}"`);
  }
  console.log(`======================================================\n`);

  const root = findUmbracoUsersRoot();
  if (!root) {
    console.error('Error: umbraco-data/users directory not found.');
    process.exit(1);
  }

  // Load existing data safely
  let existingUsersByEmail = new Map<string, string>();
  let existingOrderIds = new Set<string>();
  let existingAccessIds = new Set<string>();
  let existingMediaIds = new Set<string>();
  let existingCollectionIds = new Set<string>();

  try {
    const usersRows = await db
      .select({ id: users.id, email: users.email })
      .from(users);
    for (const u of usersRows) {
      if (u.email) existingUsersByEmail.set(u.email.toLowerCase(), u.id);
    }

    const orderRows = await db.select({ id: orders.id }).from(orders);
    for (const o of orderRows) existingOrderIds.add(o.id);

    const accessRows = await db
      .select({ id: userContentAccess.id })
      .from(userContentAccess);
    for (const a of accessRows) existingAccessIds.add(a.id);

    const mediaRows = await db.select({ id: mediaFiles.id }).from(mediaFiles);
    for (const m of mediaRows) existingMediaIds.add(m.id);

    const collRows = await db.select({ id: collections.id }).from(collections);
    for (const c of collRows) existingCollectionIds.add(c.id);
  } catch (err) {
    if (isDryRun && isDbConnectionError(err)) {
      console.warn(
        `[DRY-RUN NOTICE] Database offline or unreachable (${(err as Error).message}). Simulating dry run with local filesystem state.`,
      );
    } else {
      throw err;
    }
  }

  const profileDirs = readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));

  const pendingViewers = new Map<string, PendingViewer>();
  const pendingOrders: PendingOrder[] = [];
  const pendingPayments: PendingPayment[] = [];
  const pendingAccess: PendingAccess[] = [];
  const pendingAuditLogs: (typeof auditLogs.$inferInsert)[] = [];

  let totalPurchasesScanned = 0;
  let totalExistingOrdersSkipped = 0;
  let totalNewOrdersFound = 0;
  let totalPurchasesSkippedNoMedia = 0;

  for (const profileKey of profileDirs) {
    if (creatorArg) {
      const match =
        profileKey.toLowerCase() === creatorArg.toLowerCase() ||
        normalizeProfileKey(profileKey) === normalizeProfileKey(creatorArg);
      if (!match) continue;
    }

    // Check trashed & skip list
    const info = readJsonFile<JsonRecord>(
      join(root, profileKey, 'profile-info', 'info.json'),
    );
    if (isTrashedProfile(profileKey, info)) {
      continue;
    }
    if (isSkippedUmbracoProfile(profileKey)) {
      continue;
    }

    const purchasesPath = join(root, profileKey, 'purchases', 'items.json');
    const purchases = readJsonFile<JsonRecord[]>(purchasesPath);
    if (!purchases || purchases.length === 0) {
      continue;
    }

    const logLookup = buildLogLookup(profileKey, root);
    const creatorId = profileUserId(profileKey);

    let creatorNewOrders = 0;
    let creatorExistingOrders = 0;

    for (const purchase of purchases) {
      totalPurchasesScanned += 1;
      const purchaseKey = textOrNull(purchase.key)?.toLowerCase();
      const buyerEmail = normalizeEmail(purchase.email);
      const buyerName = textOrNull(purchase.fullName) ?? 'Viewer Account';

      if (!purchaseKey || !buyerEmail) {
        continue;
      }

      const mediaKey = resolvePurchaseMediaKey(purchase);
      const candidateMediaFileId = mediaKey
        ? resolveMediaFileId(profileKey, mediaKey)
        : null;

      let targetMediaFileId: string | null = null;
      let targetCollectionId: string | null = null;

      if (
        candidateMediaFileId &&
        (existingMediaIds.has(candidateMediaFileId) || isDryRun)
      ) {
        targetMediaFileId = candidateMediaFileId;
      } else if (mediaKey) {
        const collId1 = umbracoSeedUuid('collection', profileKey, mediaKey);
        const collId2 = umbracoSeedUuid('collection', profileKey, 'default');
        if (existingCollectionIds.has(collId1)) {
          targetCollectionId = collId1;
        } else if (existingCollectionIds.has(collId2)) {
          targetCollectionId = collId2;
        } else if (isDryRun) {
          targetCollectionId = collId1;
        }
      }

      // Ensure media or collection exists in DB or dry-run
      if (!targetMediaFileId && !targetCollectionId) {
        totalPurchasesSkippedNoMedia += 1;
        continue;
      }

      const orderId = umbracoSeedUuid(
        'purchase-order',
        profileKey,
        purchaseKey,
      );

      // Check if order already exists
      if (existingOrderIds.has(orderId)) {
        creatorExistingOrders += 1;
        totalExistingOrdersSkipped += 1;
        continue;
      }

      // Resolve user for order
      let userId = existingUsersByEmail.get(buyerEmail);
      if (!userId) {
        // Prepare new viewer account
        if (!pendingViewers.has(buyerEmail)) {
          userId = viewerUserId(buyerEmail);
          pendingViewers.set(buyerEmail, {
            id: userId,
            email: buyerEmail,
            fullName: buyerName,
          });
          existingUsersByEmail.set(buyerEmail, userId);
        } else {
          userId = pendingViewers.get(buyerEmail)!.id;
        }
      }

      const isPurchase =
        purchase.isPurchase === true ||
        purchase.isPurchase === 1 ||
        (purchase.properties as JsonRecord | undefined)?.isPurchase === true;
      const itemType = isPurchase ? 'purchase' : 'rental';
      const accessType = isPurchase ? 'purchased' : 'rented';
      const price =
        parseDecimal(purchase.price) ??
        parseDecimal((purchase.properties as JsonRecord | undefined)?.price) ??
        '0.00';
      const createdAt =
        parseDate(purchase.orderCreateDate) ??
        parseDate(purchase.createDate) ??
        new Date();
      const rentExpiresAt = parseDate(purchase.expireDate);
      const purchaseName = textOrNull(purchase.name)?.toLowerCase() ?? '';
      const logDetails = purchaseName ? logLookup.get(purchaseName) : undefined;

      const paymentId = umbracoSeedUuid(
        'purchase-payment',
        profileKey,
        purchaseKey,
      );
      const accessId = umbracoSeedUuid(
        'purchase-access',
        profileKey,
        purchaseKey,
      );

      pendingOrders.push({
        id: orderId,
        userId,
        mediaFileId: targetMediaFileId,
        collectionId: targetCollectionId,
        itemType,
        price,
        currency: 'DKK',
        rentExpiresAt,
        status: 'completed',
        createdAt,
        updatedAt: createdAt,
      });

      pendingPayments.push({
        id: paymentId,
        orderId,
        provider: mapPaymentProvider(logDetails?.paytype),
        providerReference: logDetails?.transactionId,
        amount: price,
        currency: 'DKK',
        status: 'completed',
        paymentMethod: logDetails?.paytype,
        paidAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      });

      if (!existingAccessIds.has(accessId)) {
        pendingAccess.push({
          id: accessId,
          orderId,
          userId,
          mediaFileId: targetMediaFileId,
          collectionId: targetCollectionId,
          accessType,
          rentExpiresAt,
          grantedAt: createdAt,
          createdAt,
          updatedAt: createdAt,
        });
      }

      pendingAuditLogs.push({
        id: umbracoSeedUuid('purchase-audit', profileKey, purchaseKey),
        userId: creatorId,
        action: 'umbraco_purchase_sync',
        entityType: 'order',
        entityId: orderId,
        details: {
          source: 'umbraco-data/purchases',
          profileKey,
          purchaseKey,
          buyerEmail,
          mediaFileId: targetMediaFileId,
          collectionId: targetCollectionId,
        },
        createdAt,
      });

      creatorNewOrders += 1;
      totalNewOrdersFound += 1;
    }

    if (creatorNewOrders > 0 || creatorArg) {
      console.log(
        `  👤 Creator [${profileKey}]: ${creatorNewOrders} new orders found (${creatorExistingOrders} existing skipped)`,
      );
    }
  }

  console.log(`\n------------------------------------------------------`);
  console.log(`  SUMMARY OF CHANGES`);
  console.log(`------------------------------------------------------`);
  console.log(`  Total purchases scanned:    ${totalPurchasesScanned}`);
  console.log(`  Existing orders preserved:  ${totalExistingOrdersSkipped}`);
  console.log(`  New orders to insert:       ${totalNewOrdersFound}`);
  console.log(`  New viewer users to add:    ${pendingViewers.size}`);
  console.log(`  Skipped (media not matched):${totalPurchasesSkippedNoMedia}`);
  console.log(`  Deletions / Overwrites:     0 (100% NON-DESTRUCTIVE)`);
  console.log(`------------------------------------------------------\n`);

  if (isDryRun) {
    console.log(`[DRY-RUN] No changes were written to the database.`);
    return;
  }

  if (totalNewOrdersFound === 0 && pendingViewers.size === 0) {
    console.log(`Database is already up-to-date with all exported purchases.`);
    return;
  }

  // Live insertion: Safe, non-destructive inserts with onConflictDoNothing
  const viewerPasswordHash =
    process.env.CREATOR_SEED_PASSWORD_HASH?.trim() ||
    (await hashPassword('123456'));
  const now = new Date();

  // 1. Insert any new viewer accounts
  if (pendingViewers.size > 0) {
    console.log(`Inserting ${pendingViewers.size} new viewer user accounts...`);
    for (const viewer of pendingViewers.values()) {
      const { firstName, lastName } = splitName(viewer.fullName);
      await db
        .insert(users)
        .values({
          id: viewer.id,
          email: viewer.email,
          firstName,
          lastName,
          fullName: viewer.fullName,
          role: 'viewer',
          status: 'active',
          passwordHash: viewerPasswordHash,
          isEmailVerified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: users.id });
    }
  }

  // 2. Insert new orders
  if (pendingOrders.length > 0) {
    console.log(`Inserting ${pendingOrders.length} new orders...`);
    await batchInsert(pendingOrders, BATCH_SIZE, async (batch) => {
      for (const row of batch) {
        await db
          .insert(orders)
          .values(row)
          .onConflictDoNothing({ target: orders.id });
      }
    });
  }

  // 3. Insert payments
  if (pendingPayments.length > 0) {
    console.log(`Inserting ${pendingPayments.length} payments...`);
    await batchInsert(pendingPayments, BATCH_SIZE, async (batch) => {
      for (const row of batch) {
        await db
          .insert(payments)
          .values(row)
          .onConflictDoNothing({ target: payments.id });
      }
    });
  }

  // 4. Insert access
  if (pendingAccess.length > 0) {
    console.log(`Inserting ${pendingAccess.length} content access grants...`);
    await batchInsert(pendingAccess, BATCH_SIZE, async (batch) => {
      for (const row of batch) {
        await db
          .insert(userContentAccess)
          .values(row)
          .onConflictDoNothing({ target: userContentAccess.id });
      }
    });
  }

  // 5. Insert audit logs
  if (pendingAuditLogs.length > 0) {
    await batchInsert(pendingAuditLogs, BATCH_SIZE, async (batch) => {
      for (const row of batch) {
        await db
          .insert(auditLogs)
          .values(row)
          .onConflictDoNothing({ target: auditLogs.id });
      }
    });
  }

  console.log(`\n✔ Live purchases & viewers sync completed successfully!\n`);
}

syncNewUmbracoPurchases()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal sync error:', err);
    process.exit(1);
  });
