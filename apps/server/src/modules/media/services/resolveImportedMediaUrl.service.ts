import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { mediaFiles } from 'src/database/schema';

const CLOUDFLARE_STREAM_VIDEO_ID_PATTERN = /^[a-f0-9]{32}$/i;
const CLOUDFLARE_STREAM_HOST_PATTERN =
  /(?:videodelivery\.net|cloudflarestream\.com|iframe\.cloudflarestream\.com)/i;

function extractCloudflareStreamVideoId(
  fileKey?: string | null,
  contentUrl?: string | null,
): string | null {
  const trimmedKey = fileKey?.trim();
  if (
    trimmedKey &&
    CLOUDFLARE_STREAM_VIDEO_ID_PATTERN.test(trimmedKey) &&
    !trimmedKey.includes('/')
  ) {
    return trimmedKey;
  }

  const trimmedUrl = contentUrl?.trim();
  if (!trimmedUrl || !CLOUDFLARE_STREAM_HOST_PATTERN.test(trimmedUrl)) {
    return null;
  }

  try {
    const { hostname, pathname } = new URL(trimmedUrl);
    if (hostname === 'iframe.cloudflarestream.com') {
      const iframeId = pathname.replace(/^\/+/, '').split('/')[0];
      return iframeId || null;
    }

    const pathId = pathname.replace(/^\/+/, '').split('/')[0];
    return pathId || null;
  } catch {
    return null;
  }
}

function toCloudflareStreamEmbedUrl(videoId: string): string {
  return `https://iframe.cloudflarestream.com/${videoId.trim()}`;
}

@Injectable()
export class ResolveImportedMediaUrlService {
  async findExternalUrl(key: string): Promise<string | null> {
    const trimmed = key?.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const cloudflareId = extractCloudflareStreamVideoId(null, trimmed);
      if (cloudflareId) {
        return toCloudflareStreamEmbedUrl(cloudflareId);
      }

      return trimmed;
    }

    const [media] = await db
      .select({ contentUrl: mediaFiles.contentUrl })
      .from(mediaFiles)
      .where(eq(mediaFiles.fileKey, trimmed))
      .limit(1);

    const contentUrl = media?.contentUrl?.trim();
    const cloudflareId = extractCloudflareStreamVideoId(trimmed, contentUrl);
    if (cloudflareId) {
      return toCloudflareStreamEmbedUrl(cloudflareId);
    }

    if (
      contentUrl &&
      (contentUrl.startsWith('http://') || contentUrl.startsWith('https://'))
    ) {
      return contentUrl;
    }

    return null;
  }
}
