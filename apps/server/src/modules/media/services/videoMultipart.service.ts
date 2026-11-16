import {
  BadRequestException,
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import { logger } from 'src/logger/logger';
import { MAX_DURATION_SECONDS } from 'src/utils/constant';

@Injectable()
export class CloudflareStreamService {
  private readonly accountId = process.env.CF_ACCOUNT_ID!;
  private readonly apiToken = process.env.CF_API_TOKEN!;

  async createUpload(fileSize?: number) {
    if (
      fileSize !== undefined &&
      (!Number.isSafeInteger(fileSize) ||
        fileSize <= 0 ||
        fileSize > 3 * 1024 * 1024 * 1024)
    ) {
      throw new BadRequestException(
        'Video file size must be between 1 byte and 3 GB',
      );
    }
    // Keep the basic endpoint compatible with already deployed clients.
    if (fileSize !== undefined) {
      return this.createTusUpload(fileSize);
    }
    try {
      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream/direct_upload`,
        {
          maxDurationSeconds: MAX_DURATION_SECONDS,
          requireSignedURLs: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        uid: response.data.result.uid,
        uploadURL: response.data.result.uploadURL,
      };
    } catch (error: any) {
      logger.error('❌ Cloudflare Stream Error:');
      throw new Error(
        error.response?.data?.errors?.[0]?.message ||
          'Cloudflare Stream upload failed',
      );
    }
  }
  private async createTusUpload(fileSize: number) {
    try {
      const duration = Buffer.from(String(MAX_DURATION_SECONDS)).toString(
        'base64',
      );
      const expiry = Buffer.from(
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ).toString('base64');
      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream?direct_user=true`,
        null,
        {
          headers: {
            Authorization: `Bearer ${this.apiToken}`,
            'Tus-Resumable': '1.0.0',
            'Upload-Length': String(fileSize),
            'Upload-Metadata': `maxDurationSeconds ${duration},requiresignedurls,expiry ${expiry}`,
          },
          timeout: 30000,
        },
      );
      const uploadURL = response.headers['location'];
      const uid = response.headers['stream-media-id'];
      if (!uploadURL || !uid) {
        throw new Error('Missing Cloudflare upload URL or video ID');
      }
      return { uid, uploadURL };
    } catch {
      // Do not log upload URLs or API credentials.
      logger.error('Cloudflare Stream TUS initialization failed');
      throw new BadGatewayException(
        'Unable to initialize video upload. Please try again.',
      );
    }
  }
}
