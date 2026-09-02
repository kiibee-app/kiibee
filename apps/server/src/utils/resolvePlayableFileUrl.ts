import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3 } from 'src/services/s3.client';
import { SIGNED_URL_EXPIRY } from 'src/utils/constant';
import {
  buildLegacyMediaProxyUrl,
  isLegacyUmbracoMediaKey,
} from 'src/utils/legacyUmbracoMedia';

export async function resolvePlayableFileUrl(
  key: string,
  apiBaseUrl?: string,
  options: {
    expiresIn?: number;
    contentType?: string;
    disposition?: 'inline' | 'attachment';
  } = {},
): Promise<string | null> {
  const objectKey = await findBucketObjectKey(key);
  if (objectKey) {
    const isVideo =
      objectKey.includes('/videos/') ||
      objectKey.endsWith('.mp4') ||
      objectKey.endsWith('.webm') ||
      objectKey.endsWith('.mov');

    return getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.DO_BUCKET!,
        Key: objectKey,
        ResponseContentDisposition: options.disposition ?? 'inline',
        ResponseContentType:
          options.contentType || (isVideo ? 'video/mp4' : undefined),
      }),
      { expiresIn: options.expiresIn ?? SIGNED_URL_EXPIRY.MEDIUM },
    );
  }

  if (isLegacyUmbracoMediaKey(key) && apiBaseUrl) {
    return buildLegacyMediaProxyUrl(key, apiBaseUrl);
  }

  return null;
}

async function findBucketObjectKey(key: string): Promise<string | null> {
  const bucket = process.env.DO_BUCKET;
  if (!bucket) {
    return null;
  }

  const trimmed = key.replace(/^\/+/, '');
  const candidates = [trimmed];
  if (!/^media\//i.test(trimmed) && /^\d+\//.test(trimmed)) {
    candidates.push(`media/${trimmed}`);
  }

  for (const candidate of candidates) {
    try {
      await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: candidate }));
      return candidate;
    } catch {
      // try next
    }
  }

  return null;
}
