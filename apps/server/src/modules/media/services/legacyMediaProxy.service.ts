import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { Readable } from 'stream';

import {
  isLegacyUmbracoMediaKey,
  toKiibeeMediaUrl,
  verifyLegacyMediaProxy,
} from 'src/utils/legacyUmbracoMedia';

@Injectable()
export class LegacyMediaProxyService {
  async stream(params: {
    key: string;
    exp: string;
    sig: string;
    range?: string;
    ifRange?: string;
    reply: FastifyReply;
  }) {
    const key = params.key?.trim();
    if (
      !key ||
      !isLegacyUmbracoMediaKey(key) ||
      !verifyLegacyMediaProxy(key, params.exp, params.sig)
    ) {
      throw new UnauthorizedException('Media link expired');
    }

    const sourceUrl = toKiibeeMediaUrl(key);
    if (!sourceUrl) {
      throw new NotFoundException('Media file not found');
    }

    const upstream = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'KiibeeMediaProxy/1.0',
        Accept: '*/*',
        'Accept-Encoding': 'identity',
        ...(params.range ? { Range: params.range } : {}),
        ...(params.ifRange ? { 'If-Range': params.ifRange } : {}),
      },
    });

    if (upstream.status === 416) {
      const contentRange = upstream.headers.get('content-range');
      if (contentRange) params.reply.header('Content-Range', contentRange);
      return params.reply.code(416).send();
    }

    if (!upstream.ok || !upstream.body) {
      throw new NotFoundException('Media file not found');
    }

    const contentType =
      upstream.headers.get('content-type') || 'application/octet-stream';
    if (/text\/html/i.test(contentType)) {
      throw new NotFoundException('Media file not found');
    }

    params.reply
      .code(upstream.status)
      .header('Content-Type', contentType)
      .header('Content-Disposition', 'inline')
      .header(
        'Cache-Control',
        `private, max-age=${Math.max(0, Math.min(3600, Number(params.exp) - Math.floor(Date.now() / 1000)))}`,
      )
      .header('X-Content-Type-Options', 'nosniff')
      .removeHeader('x-frame-options')
      .removeHeader('content-security-policy');

    for (const header of [
      'accept-ranges',
      'content-range',
      'etag',
      'last-modified',
    ]) {
      const value = upstream.headers.get(header);
      if (value) params.reply.header(header, value);
    }

    const length = upstream.headers.get('content-length');
    if (length) {
      params.reply.header('Content-Length', length);
    }

    return params.reply.send(
      Readable.fromWeb(upstream.body as import('stream/web').ReadableStream),
    );
  }
}
