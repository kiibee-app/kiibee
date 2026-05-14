import { Injectable } from '@nestjs/common';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from 'src/services/s3.client';

@Injectable()
export class VideoStreamService {
  async getStreamUrl(key: string) {
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
