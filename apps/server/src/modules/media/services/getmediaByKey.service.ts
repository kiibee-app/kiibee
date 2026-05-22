import { Injectable } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SIGNED_URL_EXPIRY } from 'src/utils/constant';
import { s3 } from 'src/services/s3.client';

@Injectable()
export class GetMediaByKeyService {
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

    return getSignedUrl(s3, command, { expiresIn });
  }
}
