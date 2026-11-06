import { resolvePublicImageMigrationSource } from './publicImageMigrationSource';

const resolveSource = (url: string) =>
  resolvePublicImageMigrationSource(url, 'kiibee-bucket', 'lon1');
describe('public image migration sources', () => {
  it('resolves legacy media to the existing CDN with normalized Unicode', () => {
    expect(resolveSource('/media/12/café.jpg')).toBe(
      'https://kiibee-bucket.lon1.cdn.digitaloceanspaces.com/12/cafe%CC%81.jpg',
    );
    expect(
      resolveSource(
        'https://kiibee-bucket.lon1.digitaloceanspaces.com/images/a.png',
      ),
    ).toBe(
      'https://kiibee-bucket.lon1.cdn.digitaloceanspaces.com/images/a.png',
    );
  });
  it('accepts public stream thumbnails and embedded raster images', () => {
    const url =
      'https://videodelivery.net/0123456789abcdef0123456789abcdef/thumbnails/thumbnail.jpg?time=1s&height=600';
    expect(resolveSource(url)).toBe(url);
    expect(resolveSource(url.replace('thumbnail.jpg', 'thumb_5_0.jpg'))).toBe(
      url.replace('thumbnail.jpg', 'thumb_5_0.jpg'),
    );
    expect(resolveSource('data:image/png;base64,YWJj')).toBe(
      'data:image/png;base64,YWJj',
    );
    expect(resolveSource(url + '&token=secret')).toBeNull();
  });
  it('rejects arbitrary hosts, private URLs and already migrated files', () => {
    for (const url of [
      'http://localhost/a.jpg',
      'https://other.digitaloceanspaces.com/a.jpg',
      'https://example.com/a.jpg',
      'https://kiibee-bucket.lon1.digitaloceanspaces.com/a.jpg?X-Amz-Signature=secret',
      'https://kiibee-bucket.lon1.digitaloceanspaces.com/images/webp-v1/abc.webp',
    ]) {
      expect(resolveSource(url)).toBeNull();
    }
  });
});
