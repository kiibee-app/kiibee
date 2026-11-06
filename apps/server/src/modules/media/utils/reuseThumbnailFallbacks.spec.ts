import {
  reuseThumbnailFallbacks,
  type ImageReference,
} from './reuseThumbnailFallbacks';
const ref = (id: string, column: string, oldUrl: string): ImageReference => ({
  table: 'media_files',
  id,
  column,
  oldUrl,
});

describe('reuseThumbnailFallbacks', () => {
  it('uses the existing public thumbnail for the same content and keeps rollback URLs', () => {
    const entries = [
      {
        source: 'https://videodelivery.net/old/thumbnails/thumbnail.jpg',
        status: 'failed' as const,
        references: [ref('a', 'thumbnail_url', 'old-stream-url')],
      },
      {
        source: 'https://bucket.digitaloceanspaces.com/cover.jpg',
        status: 'ready' as const,
        references: [ref('a', 'thumbnail_landscape_url', 'original-cover-url')],
      },
    ];
    expect(reuseThumbnailFallbacks(entries)).toBe(1);
    expect(entries[1].references).toContainEqual(
      ref('a', 'thumbnail_url', 'old-stream-url'),
    );
    expect(reuseThumbnailFallbacks(entries)).toBe(1);
    expect(entries[1].references).toHaveLength(2);
  });
  it('does not borrow another content image or replace a missing source with invented artwork', () => {
    const entries = [
      {
        source: 'https://videodelivery.net/old/thumbnails/thumbnail.jpg',
        status: 'failed' as const,
        references: [ref('a', 'thumbnail_url', 'old-stream-url')],
      },
      {
        source: 'https://bucket.digitaloceanspaces.com/cover.jpg',
        status: 'ready' as const,
        references: [ref('b', 'thumbnail_landscape_url', 'original-cover-url')],
      },
    ];
    expect(reuseThumbnailFallbacks(entries)).toBe(0);
    expect(entries[1].references).toHaveLength(1);
  });
});
