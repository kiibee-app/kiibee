export function resolvePublicImageMigrationSource(
  value: string,
  bucket: string | undefined,
  region: string | undefined,
): string | null {
  if (!bucket || !region)
    throw new Error('DO_BUCKET and DO_REGION are required');
  if (/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value))
    return value;
  let url: URL;
  try {
    url = new URL(value, 'https://kiibee.dk');
  } catch {
    return null;
  }
  if (
    url.protocol !== 'https:' ||
    url.hash ||
    url.username ||
    url.password ||
    url.port
  )
    return null;
  const streamHost = /(^|\.)(videodelivery\.net|cloudflarestream\.com)$/.test(
    url.hostname,
  );
  if (
    streamHost &&
    /^\/[a-f0-9]{32}\/thumbnails\/(?:thumbnail|thumb_\d+_\d+)\.jpg$/i.test(
      url.pathname,
    )
  ) {
    const allowed = new Set(['time', 'height', 'width', 'fit']);
    if ([...url.searchParams.keys()].every((key) => allowed.has(key)))
      return url.href;
    return null;
  }
  if (url.search) return null;
  const originHost = `${bucket}.${region}.digitaloceanspaces.com`;
  const cdnHost = `${bucket}.${region}.cdn.digitaloceanspaces.com`;
  let path = url.pathname;
  if (
    ['kiibee.dk', 'www.kiibee.dk'].includes(url.hostname) &&
    path.startsWith('/media/')
  )
    path = path.slice(6);
  else if (![originHost, cdnHost].includes(url.hostname)) return null;
  if (path.startsWith('/images/webp-v1/')) return null;
  try {
    path = path
      .split('/')
      .map((segment) =>
        encodeURIComponent(decodeURIComponent(segment).normalize('NFD')),
      )
      .join('/');
  } catch {
    return null;
  }
  // Known legacy Kiibee bucket has an active CDN; other buckets retain their origin.
  const host =
    bucket === 'kiibee-bucket' && region === 'lon1' ? cdnHost : originHost;
  return `https://${host}${path}`;
}
