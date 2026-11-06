import sharp from 'sharp';

export const PUBLIC_IMAGE_MAX_EDGE = 1920;
export const PUBLIC_IMAGE_MAX_BYTES = 50 * 1024 * 1024;
const MAX_INPUT_PIXELS = 100_000_000;

/** Produce display images, preserving aspect ratio, transparency and GIF animation. */
export async function optimizePublicImage(input: Buffer): Promise<Buffer> {
  if (!input.length || input.length > PUBLIC_IMAGE_MAX_BYTES) {
    throw new Error('Image must be between 1 byte and 50 MB');
  }
  const image = sharp(input, {
    animated: true,
    limitInputPixels: MAX_INPUT_PIXELS,
    failOn: 'error',
  });
  const metadata = await image.metadata();
  if (!['jpeg', 'png', 'webp', 'gif'].includes(metadata.format ?? '')) {
    throw new Error('Unsupported image format');
  }
  if ((metadata.pages ?? 1) > 100) {
    throw new Error('Image animation exceeds 100 frames');
  }

  return image
    .rotate()
    .resize({
      width: PUBLIC_IMAGE_MAX_EDGE,
      height: PUBLIC_IMAGE_MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}
