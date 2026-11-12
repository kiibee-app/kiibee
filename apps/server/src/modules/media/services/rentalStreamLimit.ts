import { ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { and, desc, eq, gt, inArray, isNull, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  analyticsEvents,
  collectionItems,
  mediaFiles,
  userContentAccess,
} from 'src/database/schema';

export const DEFAULT_RENTAL_STREAM_LIMIT = 7;

async function rentalUsage(
  executor: Pick<typeof db, 'select'>,
  userId: string,
  mediaId: string,
) {
  const memberships = await executor
    .select({ id: collectionItems.collectionId })
    .from(collectionItems)
    .where(eq(collectionItems.mediaFileId, mediaId));
  const access = await executor
    .select()
    .from(userContentAccess)
    .where(
      and(
        eq(userContentAccess.userId, userId),
        or(
          eq(userContentAccess.mediaFileId, mediaId),
          and(
            isNull(userContentAccess.mediaFileId),
            inArray(
              userContentAccess.collectionId,
              memberships.map((row) => row.id),
            ),
          ),
        ),
        or(
          isNull(userContentAccess.rentExpiresAt),
          gt(userContentAccess.rentExpiresAt, new Date()),
        ),
      ),
    )
    .orderBy(desc(userContentAccess.grantedAt));
  if (access.some((row) => row.accessType === 'purchased')) return null;
  const rental = access.find((row) => row.accessType === 'rented');
  if (!rental) return null;
  const marker = `rental-stream:${rental.id}`;
  const [usage] = await executor
    .select({ count: sql<number>`count(*)::int` })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.userId, userId),
        eq(analyticsEvents.mediaFileId, mediaId),
        eq(analyticsEvents.eventType, 'play_start'),
        eq(analyticsEvents.referrer, marker),
      ),
    );
  return {
    marker,
    usedStreams: Number(usage?.count ?? 0),
    maxStreams: DEFAULT_RENTAL_STREAM_LIMIT,
    remainingStreams: Math.max(
      0,
      DEFAULT_RENTAL_STREAM_LIMIT - Number(usage?.count ?? 0),
    ),
  };
}

export async function getRentalStreamInfo(userId: string, contentId: string) {
  const result = await rentalUsage(db, userId, contentId);
  if (!result) return null;
  const { marker, ...info } = result;
  return info;
}

// Count issued playback sessions, scoped to the rental and file. A later rental
// starts a new allowance; purchased access and creator previews remain unlimited.
export async function recordRentalStream(
  userId: string,
  key: string,
  role?: string,
) {
  if (role === 'admin') return;
  const [media] = await db
    .select()
    .from(mediaFiles)
    .where(or(eq(mediaFiles.fileKey, key), eq(mediaFiles.id, key)))
    .limit(1);
  if (!media || media.creatorId === userId) return;
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`rental-stream:${userId}:${media.id}`}))`,
    );
    const info = await rentalUsage(tx, userId, media.id);
    if (!info) return;
    const { marker, usedStreams } = info;
    if (usedStreams >= DEFAULT_RENTAL_STREAM_LIMIT) {
      throw new ForbiddenException(
        `Rental stream limit (${DEFAULT_RENTAL_STREAM_LIMIT}) reached.`,
      );
    }
    await tx.insert(analyticsEvents).values({
      id: randomUUID(),
      userId,
      creatorId: media.creatorId,
      mediaFileId: media.id,
      eventType: 'play_start',
      referrer: marker,
    });
  });
}
