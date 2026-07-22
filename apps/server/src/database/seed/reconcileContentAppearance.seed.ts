import { randomUUID } from 'crypto';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '../db';
import {
  contentAppearance,
  creatorChannels,
  creatorInfo,
  users,
} from '../schema';

export const reconcileMissingContentAppearance = async () => {
  const creators = await db
    .select({
      userId: users.id,
      avatarUrl: users.avatarUrl,
      channelName: creatorChannels.name,
      channelLogoUrl: creatorChannels.logoUrl,
      channelCoverImageUrl: creatorChannels.coverImageUrl,
      description: creatorInfo.contentDescription,
    })
    .from(users)
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .leftJoin(creatorInfo, eq(creatorInfo.userId, users.id))
    .leftJoin(contentAppearance, eq(contentAppearance.userId, users.id))
    .where(and(eq(users.role, 'creator'), isNull(contentAppearance.userId)));

  if (creators.length === 0) {
    console.log('Content appearance reconciliation skipped (none missing)');
    return;
  }

  await db
    .insert(contentAppearance)
    .values(
      creators.map((creator) => {
        const logoUrl =
          creator.channelLogoUrl?.trim() || creator.avatarUrl?.trim() || null;

        return {
          id: randomUUID(),
          userId: creator.userId,
          logoType: logoUrl ? 'picture' : 'text',
          logoName: logoUrl ? '' : (creator.channelName ?? ''),
          logoUrl,
          description: (creator.description ?? '').slice(0, 500),
          layout: 'layout1' as const,
          desktopCoverImageUrl: creator.channelCoverImageUrl?.trim() || null,
        };
      }),
    )
    .onConflictDoNothing({ target: contentAppearance.userId });

  console.log(
    `Content appearance reconciliation completed (${creators.length} creators)`,
  );
};
