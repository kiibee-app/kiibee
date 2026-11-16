import { BadRequestException, HttpStatus } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { db } from 'src/database/db';
import { contentLimits } from 'src/database/schema';
import { success } from 'src/utils/sendResponse';
import { resolveStreamLimit } from 'src/utils/streamLimit';
import { DEFAULT_DOWNLOAD_LIMIT } from 'src/utils/downloadLimit';

export async function getContentStreamLimit() {
  const [limit] = await db.select().from(contentLimits).limit(1);
  return success(
    { maxStreamLimit: resolveStreamLimit(limit?.maxStreamLimit) },
    'Stream limit fetched successfully',
    HttpStatus.OK,
  );
}

export async function setContentStreamLimit(maxStreamLimit: number) {
  if (
    !Number.isInteger(maxStreamLimit) ||
    maxStreamLimit < 1 ||
    maxStreamLimit > 10
  ) {
    throw new BadRequestException(
      'Stream limit must be an integer between 1 and 10',
    );
  }
  await db.transaction(async (tx) => {
    const [existing] = await tx.select().from(contentLimits).limit(1);
    if (existing) {
      await tx
        .update(contentLimits)
        .set({ maxStreamLimit })
        .where(eq(contentLimits.id, existing.id));
    } else {
      await tx.insert(contentLimits).values({
        id: randomUUID(),
        maxLimit: DEFAULT_DOWNLOAD_LIMIT,
        maxStreamLimit,
      });
    }
  });
  return success(
    { maxStreamLimit },
    'Stream limit saved successfully',
    HttpStatus.OK,
  );
}
