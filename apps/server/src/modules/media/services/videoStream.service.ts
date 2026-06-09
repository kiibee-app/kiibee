import { Injectable } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from 'src/services/s3.client';

import { ResolveImportedMediaUrlService } from './resolveImportedMediaUrl.service';

@Injectable()
export class VideoStreamService {
  constructor(
    private readonly resolveImportedMediaUrl: ResolveImportedMediaUrlService,
  ) {}

  async getStreamUrl(key: string) {
    const externalUrl = await this.resolveImportedMediaUrl.findExternalUrl(key);
    if (externalUrl) {
      return { url: externalUrl };
    }

    const command = new GetObjectCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: key,
      ResponseContentDisposition: 'inline',
      ResponseContentType: 'video/mp4',
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 60 * 30,
    });

    return { url };
  }
}
