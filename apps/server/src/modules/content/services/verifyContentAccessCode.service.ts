import { and, eq } from 'drizzle-orm';
import { HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import {
  collectionItems,
  collections,
  contentSettings,
  mediaFiles,
} from 'src/database/schema';
import { comparePassword } from 'src/utils/passwordHash';
import { fail, success } from 'src/utils/sendResponse';

const matchesStoredCode = async (code: string, stored?: string | null) => {
  if (!stored) return false;

  const hashes: string[] = stored.trim().startsWith('[')
    ? JSON.parse(stored)
    : [stored];
  const results = await Promise.all(
    hashes.map((hash) => comparePassword(code, hash)),
  );

  return results.some(Boolean);
};

export const verifyContentAccessCode = async (
  contentId: string,
  code: string,
) => {
  const [content] = await db
    .select({
      creatorId: mediaFiles.creatorId,
      passwordHash: mediaFiles.passwordHash,
    })
    .from(mediaFiles)
    .where(and(eq(mediaFiles.id, contentId), eq(mediaFiles.isDeleted, false)))
    .limit(1);

  if (!content) return fail('Content not found', HttpStatus.NOT_FOUND);

  const [collection] = await db
    .select({ passwordHash: collections.passwordHash })
    .from(collectionItems)
    .innerJoin(collections, eq(collectionItems.collectionId, collections.id))
    .where(
      and(
        eq(collectionItems.mediaFileId, contentId),
        eq(collections.isDeleted, false),
      ),
    )
    .limit(1);

  const [creatorSetting] = await db
    .select({ passwordHash: contentSettings.passwordHash })
    .from(contentSettings)
    .where(eq(contentSettings.userId, content.creatorId))
    .limit(1);

  const storedCode =
    content.passwordHash ??
    collection?.passwordHash ??
    creatorSetting?.passwordHash;
  const isValid = await matchesStoredCode(code, storedCode);

  if (!isValid) return fail('Wrong code', HttpStatus.UNAUTHORIZED);
  return success({ valid: true }, 'Code verified');
};
