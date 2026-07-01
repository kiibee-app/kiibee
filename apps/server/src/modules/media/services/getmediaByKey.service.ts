import { HttpStatus, Injectable } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SIGNED_URL_EXPIRY } from 'src/utils/constant';
import { s3 } from 'src/services/s3.client';
import { eq } from 'drizzle-orm';
import { ResolveImportedMediaUrlService } from './resolveImportedMediaUrl.service';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema';
import { fail } from 'src/utils/sendResponse';
import { insertContentViewService } from 'src/modules/creator-overview/services/insertContentView.service';

@Injectable()
export class GetMediaByKeyService {
  constructor(
    private readonly resolveImportedMediaUrl: ResolveImportedMediaUrlService,
  ) {}

  async getSignedUrl(
    key: string,
    options: {
      expiresIn?: number;
      contentType?: string;
      disposition?: 'inline' | 'attachment';
    } = {},
  ) {
    const {
      expiresIn = SIGNED_URL_EXPIRY.MEDIUM,
      contentType,
      disposition = 'inline',
    } = options;

    const externalUrl = await this.resolveImportedMediaUrl.findExternalUrl(key);
    if (externalUrl) {
      return externalUrl;
    }

    const isVideo =
      key.includes('/videos/') ||
      key.endsWith('.mp4') ||
      key.endsWith('.webm') ||
      key.endsWith('.mov');

    const command = new GetObjectCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: key,
      ResponseContentDisposition: disposition,
      ResponseContentType: contentType || (isVideo ? 'video/mp4' : undefined),
    });

    const [mediaInfo] = await db
      .select({
        creatorId: mediaFiles.creatorId,
        mediaFileId: mediaFiles.id,
      })
      .from(mediaFiles)
      .where(eq(mediaFiles.fileKey, key));

    if (!mediaInfo) {
      return fail('Media file not found', HttpStatus.NOT_FOUND);
    }

    await insertContentViewService(
      mediaInfo.creatorId,
      mediaInfo.mediaFileId,
      null,
    );

    return getSignedUrl(s3, command, { expiresIn });
  }
}
