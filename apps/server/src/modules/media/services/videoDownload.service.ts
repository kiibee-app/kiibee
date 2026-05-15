import { Injectable } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from 'src/services/s3.client';

@Injectable()
export class VideoDownloadService {
  async getDownloadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.DO_BUCKET!,
      Key: key,
    });

    return getSignedUrl(s3, command, {
      expiresIn: 600,
    });
  }
}
