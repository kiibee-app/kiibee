import { and, eq, isNull, or } from 'drizzle-orm';

import { db } from '../db';
import { creatorChannels, users } from '../schema';
import { ensureCreatorChannel } from 'src/modules/auth/services/ensureCreatorChannel.service';
import { ROLE } from 'src/utils/constant';

export const reconcileMissingCreatorChannels = async () => {
  const needingChannel = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(users)
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .where(
      and(
        eq(users.role, ROLE.CREATOR),
        eq(users.isDeleted, false),
        or(isNull(creatorChannels.id), eq(creatorChannels.isPublished, false)),
      ),
    );

  for (const creator of needingChannel) {
    const channelName =
      creator.fullName?.trim() ||
      [creator.firstName, creator.lastName].filter(Boolean).join(' ').trim() ||
      creator.email.split('@')[0];

    await ensureCreatorChannel(db, {
      creatorId: creator.id,
      channelName,
    });
  }
};
