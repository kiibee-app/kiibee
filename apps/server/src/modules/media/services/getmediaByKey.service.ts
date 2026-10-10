import { HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema';
import { insertContentViewService } from 'src/modules/creator-overview/services/insertContentView.service';
import { SIGNED_URL_EXPIRY } from 'src/utils/constant';
import { resolvePlayableFileUrl } from 'src/utils/resolvePlayableFileUrl';
import { fail } from 'src/utils/sendResponse';
import { ResolveImportedMediaUrlService } from './resolveImportedMediaUrl.service';

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
      apiBaseUrl?: string;
      recordView?: boolean;
    } = {},
  ) {
    const {
      expiresIn = SIGNED_URL_EXPIRY.MEDIUM,
      contentType,
      disposition = 'inline',
      apiBaseUrl,
      recordView = true,
    } = options;

    const externalUrl = await this.resolveImportedMediaUrl.findExternalUrl(key);
    if (externalUrl) {
      return externalUrl;
    }

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

    const url = await resolvePlayableFileUrl(key, apiBaseUrl, {
      expiresIn,
      contentType,
      disposition,
    });

    if (!url) {
      return fail('Media file not found', HttpStatus.NOT_FOUND);
    }

    if (recordView) {
      await insertContentViewService(
        mediaInfo.creatorId,
        mediaInfo.mediaFileId,
        null,
      );
    }

    return url;
  }
}
