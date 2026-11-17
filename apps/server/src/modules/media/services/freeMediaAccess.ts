import { ForbiddenException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  mediaFiles,
  users,
  collections,
  collectionItems,
} from 'src/database/schema';
import {
  publiclyVisibleCreatorWhere,
  creatorContentIsDiscoverable,
} from 'src/utils/publicCreatorVisibility';

export async function assertFreeMediaAccess(key: string) {
  const [media] = await db
    .select({ id: mediaFiles.id })
    .from(mediaFiles)
    .innerJoin(users, eq(users.id, mediaFiles.creatorId))
    .where(
      and(
        eq(mediaFiles.fileKey, key),
        eq(mediaFiles.accessType, 'free'),
        eq(mediaFiles.isPublished, true),
        eq(mediaFiles.visibility, 'public'),
        eq(mediaFiles.isDeleted, false),
        eq(users.isDeleted, false),
        publiclyVisibleCreatorWhere,
        creatorContentIsDiscoverable,
        sql`coalesce(${mediaFiles.buyPrice}, 0) = 0`,
        sql`coalesce(${mediaFiles.rentPrice}, 0) = 0`,
        sql`NOT EXISTS (
        SELECT 1 FROM ${collectionItems}
        INNER JOIN ${collections} ON ${collections.id} = ${collectionItems.collectionId}
        WHERE ${collectionItems.mediaFileId} = ${mediaFiles.id}
          AND ${collections.isDeleted} = false
          AND (${collections.accessType} <> 'free'
            OR coalesce(${collections.buyPrice}, 0) > 0
            OR coalesce(${collections.rentPrice}, 0) > 0)
      )`,
      ),
    )
    .limit(1);
  if (!media)
    throw new ForbiddenException('This content requires authenticated access');
}
