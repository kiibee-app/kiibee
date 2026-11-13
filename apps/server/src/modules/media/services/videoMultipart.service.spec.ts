import axios from 'axios';
import { BadGatewayException, BadRequestException } from '@nestjs/common';
import { CloudflareStreamService } from './videoMultipart.service';
import { mediaFiles } from 'src/database/schema/content/mediaFiles.schema';
import { mediaFileVersions } from 'src/database/schema/content/mediaFileVersions.schema';

jest.mock('axios');
jest.mock('src/logger/logger', () => ({ logger: { error: jest.fn() } }));
const post = jest.mocked(axios.post);

describe('Cloudflare video upload initialization', () => {
  beforeEach(() => jest.resetAllMocks());

  it.each([1_900_000_000, 2 * 1024 ** 3, 3 * 1024 ** 3])(
    'provisions a private TUS upload for %i bytes',
    async (fileSize) => {
      post.mockResolvedValue({
        headers: {
          location: 'https://upload.videodelivery.net/tus/session',
          'stream-media-id': 'video-id',
        },
      });
      await expect(
        new CloudflareStreamService().createUpload(fileSize),
      ).resolves.toEqual({
        uid: 'video-id',
        uploadURL: 'https://upload.videodelivery.net/tus/session',
      });
      const [url, body, config] = post.mock.calls[0];
      expect(url).toContain('/stream?direct_user=true');
      expect(body).toBeNull();
      expect(config?.headers?.['Upload-Length']).toBe(String(fileSize));
      expect(config?.headers?.['Tus-Resumable']).toBe('1.0.0');
      const metadata = String(config?.headers?.['Upload-Metadata']);
      expect(metadata.split(',')).toContain('requiresignedurls');
      expect(metadata).toContain(
        `maxDurationSeconds ${Buffer.from('7200').toString('base64')}`,
      );
      const expiry = metadata.split('expiry ')[1];
      expect(
        Date.parse(Buffer.from(expiry, 'base64').toString()),
      ).toBeGreaterThan(Date.now() + 23 * 3600 * 1000);
    },
  );

  it.each([0, -1, 1.5, 3 * 1024 ** 3 + 1, NaN, Infinity, '1900000000', null])(
    'rejects invalid or oversized size %s before contacting Cloudflare',
    async (size) => {
      await expect(
        new CloudflareStreamService().createUpload(size as number),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(post).not.toHaveBeenCalled();
    },
  );

  it('keeps existing basic POST clients compatible', async () => {
    post.mockResolvedValue({
      data: { result: { uid: 'old', uploadURL: 'https://upload.example' } },
    });
    await expect(new CloudflareStreamService().createUpload()).resolves.toEqual(
      { uid: 'old', uploadURL: 'https://upload.example' },
    );
    expect(post.mock.calls[0][0]).toContain('/stream/direct_upload');
  });

  it('rejects missing upstream headers', async () => {
    post.mockResolvedValue({ headers: { location: 'https://upload.example' } });
    await expect(
      new CloudflareStreamService().createUpload(1000),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('does not expose upstream credentials or URLs in errors', async () => {
    post.mockRejectedValue(new Error('Bearer secret-upload-token'));
    await expect(
      new CloudflareStreamService().createUpload(1000),
    ).rejects.toThrow('Unable to initialize video upload');
  });

  it('round trips file sizes above the PostgreSQL integer limit as numbers', () => {
    for (const column of [mediaFiles.fileSize, mediaFileVersions.fileSize]) {
      expect(column.getSQLType()).toBe('bigint');
      expect(column.mapFromDriverValue('3221225472')).toBe(3 * 1024 ** 3);
    }
  });
});
