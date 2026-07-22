import { HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { fail } from 'src/utils/sendResponse';
import { insertContentViewService } from 'src/modules/creator-overview/services/insertContentView.service';
@Injectable()
export class VideoStreamService {
  private readonly accountId = process.env.CF_ACCOUNT_ID as string;
  private readonly apiToken = process.env.CF_API_TOKEN as string;
  private readonly keyId = process.env.CF_STREAM_KEY_ID as string;
  private readonly pem = process.env.CF_STREAM_PEM as string;
  private readonly customerId = process.env.CF_STREAM_ACCOUNT_HASH as string;

  async getStreamUrl(videoId: string, expiresInSec = 3600) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream/${videoId}/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.keyId,
          pem: this.pem,
          exp: Math.floor(Date.now() / 1000) + expiresInSec,
        }),
      },
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        `Cloudflare Stream token error: ${data.errors?.map((e: any) => e.message).join(', ')}`,
      );
    }

    const [mediaInfo] = await db
      .select({
        creatorId: mediaFiles.creatorId,
        mediaFileId: mediaFiles.id,
      })
      .from(mediaFiles)
      .where(eq(mediaFiles.fileKey, videoId));

    if (!mediaInfo) {
      return fail('Media file not found', HttpStatus.NOT_FOUND);
    }

    await insertContentViewService(
      mediaInfo.creatorId,
      mediaInfo.mediaFileId,
      null,
    );

    return {
      token: data.result.token as string,
      streamUrl: `https://customer-${this.customerId}.cloudflarestream.com/${data.result.token}/manifest/video.m3u8`,
      iframeUrl: `https://customer-${this.customerId}.cloudflarestream.com/${data.result.token}/iframe`,
    };
  }
}
