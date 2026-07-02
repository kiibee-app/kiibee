import { HttpStatus } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

import { db } from 'src/database/db';
import { analyticsDailySummary } from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';

export const insertContentViewService = async (
  creatorId: string,
  mediaFileId: string,
  collectionId: string | null,
) => {
  try {
    if (!creatorId || !mediaFileId) {
      return fail(
        'Missing required parameters for inserting content performance',
        HttpStatus.BAD_REQUEST,
      );
    }

    const today = new Date().toISOString().split('T')[0];

    const existing = await db.query.analyticsDailySummary.findFirst({
      where: and(
        eq(analyticsDailySummary.creatorId, creatorId),
        eq(analyticsDailySummary.mediaFileId, mediaFileId),
        collectionId
          ? eq(analyticsDailySummary.collectionId, collectionId)
          : sql`${analyticsDailySummary.collectionId} IS NULL`,
      ),
    });

    if (existing) {
      await db
        .update(analyticsDailySummary)
        .set({
          views: sql`${analyticsDailySummary.views} + 1`,
          clicks: sql`${analyticsDailySummary.clicks} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(analyticsDailySummary.id, existing.id));

      return success(null, 'Page visit updated successfully', HttpStatus.OK);
    }

    await db.insert(analyticsDailySummary).values({
      id: randomUUID(),
      creatorId,
      mediaFileId,
      collectionId,
      date: today,
      views: 1,
      clicks: 1,
    });

    return success(
      null,
      'Content view inserted successfully',
      HttpStatus.CREATED,
    );
  } catch (error) {
    logger.error(
      `Error inserting content performance for creatorId: ${creatorId}, mediaFileId: ${mediaFileId}, collectionId: ${collectionId}`,
      error,
    );

    return fail(
      'Failed to insert content performance',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
