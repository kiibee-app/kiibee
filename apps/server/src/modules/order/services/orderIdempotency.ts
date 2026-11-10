import { and, desc, eq, gte, isNull, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders } from 'src/database/schema/commerce/orders.schema';
import { ORDER_STATUS } from 'src/utils/constant';

const PENDING_ORDER_REUSE_WINDOW_MS = 15 * 60 * 1000;

const lockKey = async (executor: any, key: string) => {
  await executor.execute(sql`select pg_advisory_xact_lock(hashtext(${key}))`);
};

export const findOrCreateCheckoutOrder = async (
  newOrder: typeof orders.$inferInsert,
) => {
  return db.transaction(async (tx) => {
    const idempotencyKey = newOrder.idempotencyKey?.trim();

    if (idempotencyKey) {
      await lockKey(tx, `order-idempotency:${idempotencyKey}`);

      const [existing] = await tx
        .select()
        .from(orders)
        .where(eq(orders.idempotencyKey, idempotencyKey))
        .limit(1);

      if (existing) {
        if (existing.userId !== newOrder.userId) {
          throw new Error('Idempotency key belongs to another user');
        }

        return { order: existing, created: false };
      }

      const [created] = await tx
        .insert(orders)
        .values({ ...newOrder, idempotencyKey })
        .returning();

      return { order: created, created: true };
    }

    const lock = [
      'order-checkout',
      newOrder.userId,
      newOrder.mediaFileId ?? 'none',
      newOrder.collectionId ?? 'none',
      newOrder.itemType,
      newOrder.price,
      newOrder.currency,
    ].join(':');

    await lockKey(tx, lock);

    const [existing] = await tx
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.userId, newOrder.userId),
          eq(orders.status, ORDER_STATUS.PENDING),
          eq(orders.itemType, newOrder.itemType),
          eq(orders.price, newOrder.price),
          eq(orders.currency, newOrder.currency),
          gte(
            orders.createdAt,
            new Date(Date.now() - PENDING_ORDER_REUSE_WINDOW_MS),
          ),
          newOrder.mediaFileId
            ? eq(orders.mediaFileId, newOrder.mediaFileId)
            : isNull(orders.mediaFileId),
          newOrder.collectionId
            ? eq(orders.collectionId, newOrder.collectionId)
            : isNull(orders.collectionId),
        ),
      )
      .orderBy(desc(orders.createdAt))
      .limit(1);

    if (existing) {
      return { order: existing, created: false };
    }

    const [created] = await tx.insert(orders).values(newOrder).returning();

    return { order: created, created: true };
  });
};
