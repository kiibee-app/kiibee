import { getChannelCodeState } from './channelCodeAccess';
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
  const codeState = await getChannelCodeState(creatorId, viewerId);
  if (codeState) return codeState;
  const [setting] = await db
    .select({
      accessType: contentSettings.accessType,
      accessBoxText: contentSettings.accessBoxText,
    })
    .from(contentSettings)
    .where(eq(contentSettings.userId, creatorId))
    .limit(1);
  const required =
    setting?.accessType === 'paid' || setting?.accessType === 'payment';
  if (!required)
    return {
      codeRequired: false,
      required: false,
      hasAccess: true,
      accessBoxText: setting?.accessBoxText ?? null,
    };
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
        .select({
          id: userContentAccess.id,
          accessType: userContentAccess.accessType,
          rentExpiresAt: userContentAccess.rentExpiresAt,
          grantedAt: userContentAccess.grantedAt,
        })
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
    accessBoxText: setting?.accessBoxText ?? null,
    codeRequired: false,
    required: true,
    hasAccess: viewerId === creatorId || Boolean(grant),
    accessInfo: grant
      ? {
          accessType: grant.accessType,
          rentExpiresAt: grant.rentExpiresAt,
          grantedAt: grant.grantedAt,
        }
      : undefined,
    collectionId: pass?.id,
    buyPrice: pass?.buyPrice,
    rentPrice: pass?.rentPrice,
    rentDuration: pass?.rentDuration,
  };
}
