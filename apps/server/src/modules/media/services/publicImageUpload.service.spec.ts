import sharp from 'sharp';
import { s3 } from 'src/services/s3.client';
import { PublicImageUploadService } from './publicImageUpload.service';

jest.mock('src/services/s3.client', () => ({ s3: { send: jest.fn() } }));

describe('PublicImageUploadService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uploads actual WebP bytes under a .webp key with matching headers', async () => {
    const buffer = await sharp({
      create: { width: 20, height: 10, channels: 3, background: 'red' },
    })
      .jpeg()
      .toBuffer();
    const result = await new PublicImageUploadService().upload({
      buffer,
      filename: 'cover.jpg',
      mimetype: 'image/jpeg',
    });
    const command = (s3.send as jest.Mock).mock.calls[0][0];
    expect(result.key).toMatch(/^images\/.+\.webp$/);
    expect(result.url.endsWith(result.key)).toBe(true);
    expect(command.input.ContentType).toBe('image/webp');
    expect(command.input.CacheControl).toContain('immutable');
    expect((await sharp(command.input.Body).metadata()).format).toBe('webp');
  });

  it('does not write invalid images to storage', async () => {
    await expect(
      new PublicImageUploadService().upload({
        buffer: Buffer.from('invalid'),
        filename: 'cover.png',
      }),
    ).rejects.toThrow('Invalid or unsupported image');
    expect(s3.send).not.toHaveBeenCalled();
  });
});
