import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { logger } from 'src/logger/logger';
import { MAX_DURATION_SECONDS } from 'src/utils/constant';

@Injectable()
export class CloudflareStreamService {
  private readonly accountId = process.env.CF_ACCOUNT_ID!;
  private readonly apiToken = process.env.CF_API_TOKEN!;

  async createUpload() {
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
}
