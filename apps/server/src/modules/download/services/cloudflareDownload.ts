import { HttpException, HttpStatus } from '@nestjs/common';

// Cloudflare Stream IDs are not S3 object keys. Downloads need an MP4 export
// and a token with downloadable=true, including for private videos.
export async function getCloudflareDownloadUrl(
  videoId: string,
  title?: string,
): Promise<string> {
  const base = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/stream/${videoId}`;
  const headers = {
    Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const request = async (path: string, method = 'GET', body?: object) => {
    const response = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15_000),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new HttpException(
        'Video download is temporarily unavailable. Please try again.',
        HttpStatus.BAD_GATEWAY,
      );
    }
    return data.result;
  };
  let downloads = await request('/downloads');
  if (!downloads?.default || downloads.default.status === 'error') {
    downloads = await request('/downloads', 'POST');
  }
  if (downloads?.default?.status !== 'ready') {
    throw new HttpException(
      'Your video download is being prepared. Please try again shortly. This has not used a download.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
  const { token } = await request('/token', 'POST', {
    downloadable: true,
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  if (!token || !downloads.default.url) {
    throw new HttpException(
      'Video download is unavailable.',
      HttpStatus.BAD_GATEWAY,
    );
  }
  const url = new URL(downloads.default.url);
  if (
    !/(^|\.)(cloudflarestream\.com|videodelivery\.net)$/.test(url.hostname) ||
    url.protocol !== 'https:'
  ) {
    throw new HttpException(
      'Invalid video download URL.',
      HttpStatus.BAD_GATEWAY,
    );
  }
  url.pathname = `/${token}/downloads/default.mp4`;
  if (title) {
    // Cloudflare appends .mp4 and permits only ASCII letters, digits, - and _.
    const filename = title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120);
    if (filename) url.searchParams.set('filename', filename);
  }
  return url.toString();
}
