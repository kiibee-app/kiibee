import { getCloudflareDownloadUrl } from 'src/modules/download/services/cloudflareDownload';

const originalFetch = global.fetch;
const mockFetch = jest.fn();
const respond = (result: any) => ({
  ok: true,
  json: async () => ({ success: true, result }),
});
describe('Cloudflare MP4 downloads', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });
  afterAll(() => {
    global.fetch = originalFetch;
  });
  it('issues a downloadable token and returns the MP4 instead of an iframe or S3 key', async () => {
    mockFetch
      .mockResolvedValueOnce(
        respond({
          default: {
            status: 'ready',
            url: 'https://customer-test.cloudflarestream.com/video/downloads/default.mp4',
          },
        }),
      )
      .mockResolvedValueOnce(respond({ token: 'signed-token' }));
    expect(await getCloudflareDownloadUrl('video')).toBe(
      'https://customer-test.cloudflarestream.com/signed-token/downloads/default.mp4',
    );
    expect(JSON.parse(mockFetch.mock.calls[1][1].body)).toMatchObject({
      downloadable: true,
    });
  });
  it('requests generation and reports preparation without issuing an unusable URL', async () => {
    mockFetch
      .mockResolvedValueOnce(respond({}))
      .mockResolvedValueOnce(respond({ default: { status: 'inprogress' } }));
    await expect(getCloudflareDownloadUrl('video')).rejects.toMatchObject({
      status: 503,
    });
    expect(mockFetch.mock.calls[1][1].method).toBe('POST');
  });
  it('handles provider errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ success: false }),
    });
    await expect(getCloudflareDownloadUrl('video')).rejects.toMatchObject({
      status: 502,
    });
  });

  it('uses the content title for the attachment filename', async () => {
    mockFetch
      .mockResolvedValueOnce(
        respond({
          default: {
            status: 'ready',
            url: 'https://customer-test.cloudflarestream.com/video/downloads/default.mp4',
          },
        }),
      )
      .mockResolvedValueOnce(respond({ token: 'signed-token' }));
    const url = new URL(
      await getCloudflareDownloadUrl('video', 'Extravaganza'),
    );
    expect(url.searchParams.get('filename')).toBe('Extravaganza');
  });
});
