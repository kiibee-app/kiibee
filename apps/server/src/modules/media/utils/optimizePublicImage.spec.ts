import sharp from 'sharp';
import {
  optimizePublicImage,
  PUBLIC_IMAGE_MAX_EDGE,
} from './optimizePublicImage';

describe('optimizePublicImage', () => {
  it('applies camera orientation before stripping metadata', async () => {
    const input = await sharp({
      create: { width: 40, height: 20, channels: 3, background: 'red' },
    })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const meta = await sharp(await optimizePublicImage(input)).metadata();
    expect(meta).toMatchObject({ width: 20, height: 40, format: 'webp' });
    expect(meta.orientation).toBeUndefined();
  });
  it('keeps animation frames and timing when converting GIFs', async () => {
    const pixels = Buffer.concat([
      Buffer.alloc(10 * 10 * 3, 0),
      Buffer.alloc(10 * 10 * 3, 255),
    ]);
    const gif = await sharp(pixels, {
      raw: { width: 10, height: 20, channels: 3, pageHeight: 10 },
    })
      .gif({ delay: [100, 200], loop: 0 })
      .toBuffer();
    const metadata = await sharp(await optimizePublicImage(gif), {
      animated: true,
    }).metadata();
    expect(metadata).toMatchObject({
      format: 'webp',
      pages: 2,
      pageHeight: 10,
      delay: [100, 200],
    });
  });
  it('converts large JPEGs to bounded WebP without changing their aspect ratio', async () => {
    const input = await sharp({
      create: { width: 4000, height: 2000, channels: 3, background: '#38577a' },
    })
      .jpeg()
      .toBuffer();
    const output = await optimizePublicImage(input);
    const meta = await sharp(output).metadata();
    expect(meta.format).toBe('webp');
    expect(meta.width).toBe(PUBLIC_IMAGE_MAX_EDGE);
    expect(meta.height).toBe(PUBLIC_IMAGE_MAX_EDGE / 2);
    expect(output.length).toBeLessThan(input.length);
  });

  it('preserves transparency and does not enlarge small PNGs', async () => {
    const input = await sharp({
      create: {
        width: 40,
        height: 20,
        channels: 4,
        background: { r: 20, g: 80, b: 160, alpha: 0 },
      },
    })
      .png()
      .toBuffer();
    const meta = await sharp(await optimizePublicImage(input)).metadata();
    expect(meta).toMatchObject({
      format: 'webp',
      width: 40,
      height: 20,
      hasAlpha: true,
    });
  });

  it('rejects corrupt files and SVGs disguised as supported uploads', async () => {
    await expect(optimizePublicImage(Buffer.from('invalid'))).rejects.toThrow();
    await expect(
      optimizePublicImage(
        Buffer.from(
          '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
        ),
      ),
    ).rejects.toThrow('Unsupported image format');
  });
});
