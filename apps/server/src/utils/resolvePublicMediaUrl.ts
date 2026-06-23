const KIIBEE_MEDIA_BASE_URL = 'https://kiibee.dk';
const KIIBEE_MEDIA_HOSTS = new Set(['kiibee.dk', 'www.kiibee.dk']);
const KIIBEE_MEDIA_PATH_PREFIX = /^\/media\//;

function getMediaCdnBase(): string | null {
  const explicit = process.env.PUBLIC_MEDIA_CDN_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }

  const bucket = process.env.DO_BUCKET?.trim();
  const region = process.env.DO_REGION?.trim();
  if (bucket && region) {
    return `https://${bucket}.${region}.digitaloceanspaces.com`;
  }

  return null;
}

function getMediaCdnStripPrefix(): string {
  return process.env.PUBLIC_MEDIA_CDN_STRIP_PREFIX?.trim() || 'media';
}

function toCdnMediaPath(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const stripPrefix = getMediaCdnStripPrefix();
  const mediaPrefix = `/${stripPrefix}`;

  if (stripPrefix && path.startsWith(`${mediaPrefix}/`)) {
    return path.slice(mediaPrefix.length);
  }

  return path;
}

function buildCdnMediaUrl(pathname: string): string | null {
  const cdnBase = getMediaCdnBase();
  if (!cdnBase) {
    return null;
  }

  return `${cdnBase}${toCdnMediaPath(pathname)}`;
}

function rewriteKiibeeMediaUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (
      KIIBEE_MEDIA_HOSTS.has(parsed.hostname) &&
      KIIBEE_MEDIA_PATH_PREFIX.test(parsed.pathname)
    ) {
      return url;
    }
  } catch {
    return url;
  }

  return url;
}

/** Map Umbraco `/media/...` paths to CDN or legacy kiibee.dk URLs. */
export function resolvePublicMediaUrl(url?: string | null): string | null {
  if (typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return rewriteKiibeeMediaUrl(trimmed);
  }

  if (trimmed.startsWith('//')) {
    return rewriteKiibeeMediaUrl(`https:${trimmed}`);
  }

  if (trimmed.startsWith('/')) {
    if (KIIBEE_MEDIA_PATH_PREFIX.test(trimmed)) {
      return `${KIIBEE_MEDIA_BASE_URL}${trimmed}`;
    }

    return buildCdnMediaUrl(trimmed) ?? `${KIIBEE_MEDIA_BASE_URL}${trimmed}`;
  }

  if (/^media\//i.test(trimmed)) {
    return `${KIIBEE_MEDIA_BASE_URL}/${trimmed}`;
  }

  return trimmed;
}
