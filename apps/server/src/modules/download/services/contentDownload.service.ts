import { randomUUID } from 'crypto';
import { getDownloadDispositionAndFileName } from 'src/utils/download';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import {
  analyticsEvents,
  contentDownloadCount,
  mediaFiles,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { s3 } from 'src/services/s3.client';
import { fail, success } from 'src/utils/sendResponse';
import { SIGNED_URL_EXPIRY } from 'src/utils/constant';

export const contentDownLoad = async (contentId: string, userId: string) => {
  try {
    if (!contentId || !userId) {
      return fail('Missing required parameters', HttpStatus.BAD_REQUEST);
    }

    const [content] = await db
      .select()
      .from(mediaFiles)
      .where(and(eq(mediaFiles.id, contentId)))
      .limit(1);

    if (!content) {
      return fail('Content not found', HttpStatus.NOT_FOUND);
    }

    if (!content.fileKey) {
      logger.error(`Content ${contentId} has no fileKey set`);
      return fail('File not found in storage', HttpStatus.NOT_FOUND);
    }

    const [download] = await db
      .select()
      .from(contentDownloadCount)
      .where(
        and(
          eq(contentDownloadCount.userId, userId),
          eq(contentDownloadCount.contentId, contentId),
        ),
      )
      .limit(1);

    const maxDownloadCount = content.maxDownloadCount ?? 0;

    if (
      maxDownloadCount > 0 &&
      download &&
      download.downloadCount >= maxDownloadCount
    ) {
      return fail(
        `Maximum download limit (${maxDownloadCount}) reached.`,
        HttpStatus.FORBIDDEN,
      );
    }

    const recordDownload = async () => {
      await db.transaction(async (tx) => {
        if (download) {
          await tx
            .update(contentDownloadCount)
            .set({
              downloadCount: download.downloadCount + 1,
              updatedAt: new Date(),
            })
            .where(eq(contentDownloadCount.id, download.id));
        } else {
          await tx.insert(contentDownloadCount).values({
            id: randomUUID(),
            userId,
            contentId,
            downloadCount: 1,
          });
        }

        await tx.insert(analyticsEvents).values({
          id: randomUUID(),
          userId,
          creatorId: content.creatorId,
          mediaFileId: contentId,
          eventType: 'download',
        });
      });
    };

    const { fileName, contentDisposition } = getDownloadDispositionAndFileName(
      content.fileKey,
      content.title,
    );

    let publicUrl: string | null = null;
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: process.env.DO_BUCKET!,
          Key: content.fileKey,
        }),
      );
    } catch (headError) {
      logger.error(
        `File not found in bucket "${process.env.DO_BUCKET}" for key "${content.fileKey}" (contentId: ${contentId})`,
        headError,
      );
      const row = await db
        .select({ publicUrl: mediaFiles.contentUrl })
        .from(mediaFiles)
        .where(eq(mediaFiles.id, contentId))
        .limit(1)
        .then((r) => r[0]);

      publicUrl = row?.publicUrl ?? null;

      if (publicUrl) {
        await recordDownload();
        return success(
          { downloadUrl: publicUrl, fileName },
          'Download URL generated successfully',
        );
      }

      return fail('File not found in storage', HttpStatus.NOT_FOUND);
    }

    const command = new GetObjectCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: content.fileKey,
      ResponseContentDisposition: contentDisposition,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: SIGNED_URL_EXPIRY.SHORT,
    });

    await recordDownload();

    return success(
      {
        downloadUrl: publicUrl ?? url,
        fileName,
      },
      'Download URL generated successfully',
    );
  } catch (error) {
    logger.error('Failed to download content:', error);

    return fail('Failed to download content', HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
