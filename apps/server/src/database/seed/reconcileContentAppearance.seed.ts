import { randomUUID } from 'crypto';
import { and, eq, isNull } from 'drizzle-orm';

import { db } from '../db';
import {
  contentAppearance,
  creatorChannels,
  creatorInfo,
  users,
} from '../schema';
import { ROLE } from 'src/utils/constant';
import {
  DEFAULT_CONTENT_APPEARANCE_LAYOUT,
  RECONCILIATION_COMPLETED_MESSAGE,
  RECONCILIATION_SKIPPED_MESSAGE,
  resolveFallbackLogoUrl,
  resolveLogoName,
  resolveLogoType,
  truncateContentAppearanceDescription,
} from 'src/utils/contentAppearance';

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
    .where(and(eq(users.role, ROLE.CREATOR), isNull(contentAppearance.userId)));

  if (creators.length === 0) {
    console.log(RECONCILIATION_SKIPPED_MESSAGE);
    return;
  }

  await db
    .insert(contentAppearance)
    .values(
      creators.map((creator) => {
        const logoUrl = resolveFallbackLogoUrl(
          creator.channelLogoUrl,
          creator.avatarUrl,
        );

        return {
          id: randomUUID(),
          userId: creator.userId,
          logoType: resolveLogoType(logoUrl),
          logoName: resolveLogoName(logoUrl, creator.channelName),
          logoUrl,
          description: truncateContentAppearanceDescription(
            creator.description,
          ),
          layout: DEFAULT_CONTENT_APPEARANCE_LAYOUT,
          desktopCoverImageUrl: creator.channelCoverImageUrl?.trim() || null,
        };
      }),
    )
    .onConflictDoNothing({ target: contentAppearance.userId });

  console.log(
    `${RECONCILIATION_COMPLETED_MESSAGE} (${creators.length} creators)`,
  );
};
