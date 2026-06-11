import { db } from '../db';
import {
  auditLogs,
  mediaFiles,
  orders,
  payments,
  userContentAccess,
  users,
} from '../schema';
import {
  batchInsert,
  findUmbracoUsersRoot,
  isEnabled,
  loadProfileKeys,
  mapPaymentProvider,
  normalizeEmail,
  parseDate,
  parseDecimal,
  profileUserId,
  readItemsFile,
  resolveMediaFileId,
  resolveOrderUserId,
  resolvePurchaseMediaKey,
  shouldInsertViewerAccount,
  textOrNull,
  umbracoSeedUuid,
  type JsonRecord,
} from './umbracoSeed.helpers';
import {
  loadCreatorIdsByRole,
  loadSeededProfileUserIds,
} from './umbracoSeed.db';

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

function buildLogLookup(
  profileKey: string,
  root: string,
): Map<string, LogLookup> {
  const lookup = new Map<string, LogLookup>();
  const logs = readItemsFile(profileKey, root, 'logs') ?? [];

  for (const log of logs) {
    const name = textOrNull(log.name)?.toLowerCase();
    if (!name) {
      continue;
    }

    const fields = (log.fields as JsonRecord | undefined) ?? {};
    lookup.set(name, {
      transactionId: textOrNull(fields.transactionID),
      paytype: textOrNull(fields.paytype),
      acquirer: textOrNull(fields.acquirer),
    });
  }

  return lookup;
}

function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? 'Viewer',
    lastName: parts.slice(1).join(' ') || 'Account',
  };
}

export const seedUmbracoPurchases = async () => {
  const root = findUmbracoUsersRoot();
  if (!root) {
    console.log(
      'Umbraco purchases seed skipped (umbraco-data/users not found; set UMBRACO_DATA_USERS_PATH to override)',
    );
    return;
  }

  const existingMediaIds = new Set(
    (await db.select({ id: mediaFiles.id }).from(mediaFiles)).map(
      (row) => row.id,
    ),
  );

  const existingUsers = await db
    .select({ id: users.id, email: users.email, role: users.role })
    .from(users);
  const existingUsersByEmail = new Map(
    existingUsers.map((row) => [row.email.toLowerCase(), row.id]),
  );
  const seededProfileUserIds = await loadSeededProfileUserIds(root);
  const creatorRoleIds = await loadCreatorIdsByRole();

  const viewerCache = new Map<string, PendingViewer>();
  const pendingOrders: PendingOrder[] = [];
  const pendingPayments: PendingPayment[] = [];
  const pendingAccess: PendingAccess[] = [];
  const pendingAuditLogs: (typeof auditLogs.$inferInsert)[] = [];

  let profilesProcessed = 0;
  let purchasesProcessed = 0;
  let purchasesSkipped = 0;

  for (const profileKey of loadProfileKeys(root)) {
    const creatorId = profileUserId(profileKey);
    if (!seededProfileUserIds.has(creatorId)) {
      continue;
    }

    const purchases = readItemsFile(profileKey, root, 'purchases');
    if (!purchases?.length) {
      continue;
    }

    const logLookup = buildLogLookup(profileKey, root);
    profilesProcessed += 1;

    for (const purchase of purchases) {
      const purchaseKey = textOrNull(purchase.key)?.toLowerCase();
      const buyerEmail = normalizeEmail(purchase.email);
      const buyerName = textOrNull(purchase.fullName) ?? 'Viewer Account';

      if (!purchaseKey || !buyerEmail) {
        purchasesSkipped += 1;
        continue;
      }

      const mediaKey = resolvePurchaseMediaKey(purchase);
      const mediaFileId = mediaKey
        ? resolveMediaFileId(profileKey, mediaKey)
        : null;

      if (!mediaFileId || !existingMediaIds.has(mediaFileId)) {
        purchasesSkipped += 1;
        continue;
      }

      const orderUserId = resolveOrderUserId(buyerEmail, existingUsersByEmail);

      if (!viewerCache.has(buyerEmail)) {
        viewerCache.set(buyerEmail, {
          id: orderUserId,
          email: buyerEmail,
          fullName: buyerName,
        });
      }

      const isPurchase =
        isEnabled(purchase.isPurchase) ||
        isEnabled((purchase.properties as JsonRecord | undefined)?.isPurchase);
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

      const orderId = umbracoSeedUuid(
        'purchase-order',
        profileKey,
        purchaseKey,
      );
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
        userId: orderUserId,
        mediaFileId,
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

      pendingAccess.push({
        id: accessId,
        orderId,
        userId: orderUserId,
        mediaFileId,
        accessType,
        rentExpiresAt,
        grantedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      });

      pendingAuditLogs.push({
        id: umbracoSeedUuid('purchase-audit', profileKey, purchaseKey),
        userId: creatorId,
        action: 'umbraco_purchase_seed',
        entityType: 'order',
        entityId: orderId,
        details: {
          source: 'umbraco-data/purchases',
          profileKey,
          purchaseKey,
          buyerEmail,
          mediaFileId,
          raw: purchase,
        },
        createdAt,
      });

      purchasesProcessed += 1;
    }
  }

  const viewerNow = new Date();
  for (const viewer of viewerCache.values()) {
    if (
      !shouldInsertViewerAccount(
        viewer,
        existingUsersByEmail,
        seededProfileUserIds,
      )
    ) {
      continue;
    }

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
        isEmailVerified: true,
        isActive: true,
        createdAt: viewerNow,
        updatedAt: viewerNow,
      })
      .onConflictDoNothing({ target: users.id });

    existingUsersByEmail.set(viewer.email, viewer.id);
  }

  await batchInsert(pendingOrders, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(orders)
        .values(row)
        .onConflictDoUpdate({
          target: orders.id,
          set: {
            userId: row.userId,
            mediaFileId: row.mediaFileId,
            itemType: row.itemType,
            price: row.price,
            rentExpiresAt: row.rentExpiresAt,
            status: row.status,
            updatedAt: row.updatedAt,
          },
        });
    }
  });

  await batchInsert(pendingPayments, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(payments)
        .values(row)
        .onConflictDoUpdate({
          target: payments.id,
          set: {
            provider: row.provider,
            providerReference: row.providerReference,
            amount: row.amount,
            status: row.status,
            paymentMethod: row.paymentMethod,
            paidAt: row.paidAt,
            updatedAt: row.updatedAt,
          },
        });
    }
  });

  await batchInsert(pendingAccess, BATCH_SIZE, async (batch) => {
    for (const row of batch) {
      await db
        .insert(userContentAccess)
        .values(row)
        .onConflictDoUpdate({
          target: userContentAccess.id,
          set: {
            accessType: row.accessType,
            rentExpiresAt: row.rentExpiresAt,
            grantedAt: row.grantedAt,
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
    `Umbraco purchases seed completed (${purchasesProcessed} orders, ${viewerCache.size} buyer accounts, ${creatorRoleIds.size} creators preserved across ${profilesProcessed} profiles, ${purchasesSkipped} skipped from ${root})`,
  );
};
