const KIIBEE_MEDIA_BASE_URL = 'https://kiibee.dk';
const KIIBEE_MEDIA_HOSTS = new Set(['kiibee.dk', 'www.kiibee.dk']);
const KIIBEE_MEDIA_PATH_PREFIX = /^\/media\//;
const SPACES_HOST_PATTERN = /\.digitaloceanspaces\.com$/i;

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

export function encodeSpacesMediaPath(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return path
    .split('/')
    .map((segment) => {
      if (!segment) {
        return '';
      }

      let decoded = segment;
      try {
        decoded = decodeURIComponent(segment);
      } catch {
        // keep raw segment when it is not valid percent-encoding
      }

      return encodeURIComponent(decoded.normalize('NFD'));
    })
    .join('/');
}

function buildCdnMediaUrl(pathname: string): string | null {
  const cdnBase = getMediaCdnBase();
  if (!cdnBase) {
    return null;
  }

  return `${cdnBase}${encodeSpacesMediaPath(toCdnMediaPath(pathname))}`;
}

function buildLegacyKiibeeMediaUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (KIIBEE_MEDIA_PATH_PREFIX.test(path)) {
    return `${KIIBEE_MEDIA_BASE_URL}${path}`;
  }

  return `${KIIBEE_MEDIA_BASE_URL}/media${path}`;
}

function rewriteAbsoluteMediaUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const pathname = (() => {
      try {
        return decodeURIComponent(parsed.pathname);
      } catch {
        return parsed.pathname;
      }
    })();

    if (
      KIIBEE_MEDIA_HOSTS.has(parsed.hostname) &&
      KIIBEE_MEDIA_PATH_PREFIX.test(pathname)
    ) {
      return (
        buildCdnMediaUrl(pathname) ?? `${KIIBEE_MEDIA_BASE_URL}${pathname}`
      );
    }

    if (SPACES_HOST_PATTERN.test(parsed.hostname)) {
      const cdnBase = getMediaCdnBase();
      const origin = cdnBase ?? `${parsed.protocol}//${parsed.host}`;
      return `${origin}${encodeSpacesMediaPath(pathname)}`;
    }
  } catch {
    return url;
  }

  return url;
}

/** Map Umbraco `/media/...` paths to CDN Spaces URLs (NFD-encoded keys). */
export function resolvePublicMediaUrl(url?: string | null): string | null {
  if (typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return rewriteAbsoluteMediaUrl(trimmed);
  }

  if (trimmed.startsWith('//')) {
    return rewriteAbsoluteMediaUrl(`https:${trimmed}`);
  }

  if (trimmed.startsWith('/')) {
    return buildCdnMediaUrl(trimmed) ?? buildLegacyKiibeeMediaUrl(trimmed);
  }

  if (/^media\//i.test(trimmed)) {
    return (
      buildCdnMediaUrl(`/${trimmed}`) ??
      buildLegacyKiibeeMediaUrl(`/${trimmed}`)
    );
  }

  return trimmed;
}
