import { BadRequestException, ConflictException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { orders, userContentAccess } from 'src/database/schema';

// Complete the order and grant its entitlement atomically, without a provider charge.
export async function completeZeroOrder(
  orderId: string,
  userId: string,
  rentalHours: number | null,
) {
  return db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .for('update');
    if (!order || order.userId !== userId || Number(order.price) !== 0)
      throw new BadRequestException('Invalid zero-price order');
    if (order.status === 'refunded' || order.status === 'failed')
      throw new ConflictException('Order cannot be completed');
    const rental = order.itemType === 'rental';
    if (rental && (!rentalHours || rentalHours <= 0))
      throw new BadRequestException('Rental duration is not configured');
    const expires = rental
      ? (order.rentExpiresAt ?? new Date(Date.now() + rentalHours! * 3600000))
      : null;
    if (order.status !== 'completed')
      await tx
        .update(orders)
        .set({
          status: 'completed',
          rentExpiresAt: expires,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));
    const [existing] = await tx
      .select({ id: userContentAccess.id })
      .from(userContentAccess)
      .where(eq(userContentAccess.orderId, order.id))
      .limit(1);
    if (!existing)
      await tx
        .insert(userContentAccess)
        .values({
          id: `zero-${order.id}`,
          orderId: order.id,
          userId,
          mediaFileId: order.mediaFileId,
          collectionId: order.collectionId,
          accessType: rental ? 'rented' : 'purchased',
          rentExpiresAt: expires,
        })
        .onConflictDoNothing();
    return { orderId: order.id, completed: true as const };
  });
}
