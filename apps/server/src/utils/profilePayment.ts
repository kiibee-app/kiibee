import { and, eq, gt, isNull, or } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  collections,
  contentSettings,
  userContentAccess,
  orders,
} from 'src/database/schema';

// A reserved, non-public collection represents a whole-channel pass in existing commerce tables.
export const profilePassId = (creatorId: string) =>
  `profile-access-${creatorId}`;
export const isProfilePass = (id?: string | null) =>
  Boolean(id?.startsWith('profile-access-'));
export async function getProfilePaymentState(
  creatorId: string,
  viewerId?: string,
) {
  const [setting] = await db
    .select({ accessType: contentSettings.accessType })
    .from(contentSettings)
    .where(eq(contentSettings.userId, creatorId))
    .limit(1);
  const required =
    setting?.accessType === 'paid' || setting?.accessType === 'payment';
  if (!required) return { required: false, hasAccess: true };
  const [pass] = await db
    .select()
    .from(collections)
    .where(
      and(
        eq(collections.id, profilePassId(creatorId)),
        eq(collections.isDeleted, false),
      ),
    )
    .limit(1);
  const [grant] = viewerId
    ? await db
        .select({ id: userContentAccess.id })
        .from(userContentAccess)
        .innerJoin(orders, eq(orders.id, userContentAccess.orderId))
        .where(
          and(
            eq(userContentAccess.userId, viewerId),
            eq(orders.status, 'completed'),
            eq(userContentAccess.collectionId, profilePassId(creatorId)),
            or(
              isNull(userContentAccess.rentExpiresAt),
              gt(userContentAccess.rentExpiresAt, new Date()),
            ),
          ),
        )
        .limit(1)
    : [];
  return {
    required: true,
    hasAccess: viewerId === creatorId || Boolean(grant),
    collectionId: pass?.id,
    buyPrice: pass?.buyPrice,
    rentPrice: pass?.rentPrice,
    rentDuration: pass?.rentDuration,
  };
}
