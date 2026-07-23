import { and, eq } from 'drizzle-orm';
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
  const [[content], [collection], [creatorSetting]] = await Promise.all([
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
  ]);

  return (content ?? collection ?? creatorSetting)?.passwordHash ?? null;
};

export const verifyContentAccessCode = async (
  targetId: string,
  code: string,
) => {
  const storedCode = await resolveStoredCode(targetId);
  const isValid = await matchesStoredCode(code, storedCode);

  return isValid
    ? success({ valid: true }, 'Code verified')
    : fail('Wrong code', HttpStatus.UNAUTHORIZED);
};
