import {
  CHANNEL_SLUG_BASE_MAX_LENGTH,
  DEFAULT_CHANNEL_SLUG,
  SLUG_AMPERSAND_REPLACEMENT,
  SLUG_EDGE_DASH_RE,
  SLUG_NON_ALPHANUMERIC_RE,
} from 'src/utils/constant';

export function slugify(
  value: string,
  fallback = DEFAULT_CHANNEL_SLUG,
): string {
  if (!value) return fallback;
  return (
    String(value)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'a')
      .replace(/['’‘`"“”]/g, '')
      .replace(/(^|[a-z0-9])-s(-|$)/gi, '$1s$2')
      .replace(/&/g, SLUG_AMPERSAND_REPLACEMENT)
      .replace(SLUG_NON_ALPHANUMERIC_RE, '-')
      .replace(SLUG_EDGE_DASH_RE, '')
      .slice(0, CHANNEL_SLUG_BASE_MAX_LENGTH) || fallback
  );
}
