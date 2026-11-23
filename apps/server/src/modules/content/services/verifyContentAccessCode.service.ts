import {
  getChannelCodeState,
  redeemChannelCode,
} from 'src/utils/channelCodeAccess';
import { requirePubliclyVisibleCreator } from 'src/utils/publicCreatorVisibility';
import { and, eq, isNotNull } from 'drizzle-orm';
import { HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import { collections, contentSettings, mediaFiles } from 'src/database/schema';
import { comparePassword } from 'src/utils/passwordHash';
import { fail, success } from 'src/utils/sendResponse';

const matchesStoredCode = async (
  code: string,
  stored?: string | null,
): Promise<boolean> => {
  if (!stored) return false;

  try {
    const hashes: string[] = stored.trim().startsWith('[')
      ? JSON.parse(stored)
      : [stored];

    const results = await Promise.all(
      hashes.map((hash) => comparePassword(code, hash)),
    );

    return results.some(Boolean);
  } catch {
    return false;
  }
};

const resolveStoredCode = async (targetId: string): Promise<string | null> => {
  const [
    [content],
    [collection],
    [creatorSetting],
    [creatorCollection],
    [creatorMedia],
  ] = await Promise.all([
    db
      .select({ passwordHash: mediaFiles.passwordHash })
      .from(mediaFiles)
      .where(and(eq(mediaFiles.id, targetId), eq(mediaFiles.isDeleted, false)))
      .limit(1),
    db
      .select({ passwordHash: collections.passwordHash })
      .from(collections)
      .where(
        and(eq(collections.id, targetId), eq(collections.isDeleted, false)),
      )
      .limit(1),
    db
      .select({ passwordHash: contentSettings.passwordHash })
      .from(contentSettings)
      .where(eq(contentSettings.userId, targetId))
      .limit(1),
    db
      .select({ passwordHash: collections.passwordHash })
      .from(collections)
      .where(
        and(
          eq(collections.creatorId, targetId),
          eq(collections.isDeleted, false),
          isNotNull(collections.passwordHash),
        ),
      )
      .limit(1),
    db
      .select({ passwordHash: mediaFiles.passwordHash })
      .from(mediaFiles)
      .where(
        and(
          eq(mediaFiles.creatorId, targetId),
          eq(mediaFiles.isDeleted, false),
          isNotNull(mediaFiles.passwordHash),
        ),
      )
      .limit(1),
  ]);

  return (
    (
      content ??
      collection ??
      creatorSetting ??
      creatorCollection ??
      creatorMedia
    )?.passwordHash ?? null
  );
};

export const verifyContentAccessCode = async (
  targetId: string,
  code: string,
  userId?: string,
) => {
  const channel = await getChannelCodeState(targetId, userId);
  if (channel) {
    await requirePubliclyVisibleCreator(targetId);
    if (!userId) return fail('Login required', HttpStatus.UNAUTHORIZED);
    const grant = await redeemChannelCode(
      targetId,
      userId,
      code,
      channel.rentDuration,
    );
    return grant
      ? success({ valid: true, expiresAt: grant.expiresAt }, 'Code verified')
      : fail(
          'Code is invalid or your access has expired',
          HttpStatus.UNAUTHORIZED,
        );
  }
  const storedCode = await resolveStoredCode(targetId);
  const isValid = await matchesStoredCode(code, storedCode);

  return isValid
    ? success({ valid: true }, 'Code verified')
    : fail('Wrong code', HttpStatus.UNAUTHORIZED);
};
