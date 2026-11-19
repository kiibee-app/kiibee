import { HttpStatus } from '@nestjs/common';
import { and, eq, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentSettings,
  creatorChannels,
  mediaFiles,
  users,
  userContentAccess,
  orders,
} from 'src/database/schema';
import { CONTENT_VISIBILITY, ROLE } from 'src/utils/constant';
import { fail } from 'src/utils/sendResponse';

export const publiclyVisibleCreatorWhere = eq(users.isHidden, false);

export const creatorHasPublishedContentWhere = sql`EXISTS (
  SELECT 1
  FROM ${mediaFiles}
  WHERE ${mediaFiles.creatorId} = ${users.id}
    AND ${mediaFiles.isDeleted} = false
    AND ${mediaFiles.isPublished} = true
    AND ${mediaFiles.visibility} = ${CONTENT_VISIBILITY.PUBLIC}
)`;

export function profileContentVisibleTo(viewerId?: string) {
  return sql`(
    NOT EXISTS (SELECT 1 FROM ${contentSettings}
      WHERE ${contentSettings.userId} = ${mediaFiles.creatorId}
        AND ${contentSettings.accessType}::text IN ('payment', 'paid'))
    ${
      viewerId
        ? sql`OR ${mediaFiles.creatorId} = ${viewerId}
      OR EXISTS (SELECT 1 FROM ${userContentAccess}
        INNER JOIN ${orders} ON ${orders.id} = ${userContentAccess.orderId}
        WHERE ${userContentAccess.userId} = ${viewerId}
          AND ${userContentAccess.collectionId} = 'profile-access-' || ${mediaFiles.creatorId}
          AND ${orders.status} = 'completed'
          AND (${userContentAccess.rentExpiresAt} IS NULL OR ${userContentAccess.rentExpiresAt} > now()))`
        : sql``
    }
  )`;
}

export const creatorContentIsDiscoverableFor = (viewerId?: string) => sql`(
  ${profileContentVisibleTo(viewerId)}
  AND NOT EXISTS (
    SELECT 1
    FROM ${contentSettings}
    WHERE ${contentSettings.userId} = ${mediaFiles.creatorId}
      AND ${contentSettings.accessType}::text IN ('set_password', 'request_email', 'password', 'email_gated')
  )
)`;

export const creatorContentIsDiscoverable = creatorContentIsDiscoverableFor();

// Hidden means unlisted on the portal; direct channel links remain accessible.
export const requirePubliclyVisibleCreator = async (
  creatorIdOrSlug: string,
) => {
  const [creator] = await db
    .select({
      id: users.id,
      isHidden: users.isHidden,
      isDeleted: users.isDeleted,
    })
    .from(users)
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .where(
      and(
        or(
          eq(users.id, creatorIdOrSlug),
          eq(creatorChannels.slug, creatorIdOrSlug),
        ),
        eq(users.role, ROLE.CREATOR),
      ),
    )
    .limit(1);

  if (!creator || creator.isDeleted) {
    return fail('Creator not found', HttpStatus.NOT_FOUND);
  }

  return creator;
};
