import { slugify } from './slug';

// External sites still link to these original Umbraco spellings.
const MICROPHONE_SHOW_ALIASES: Readonly<Record<string, string>> = {
  'mick-oegendahl-traafraeser': 'mick-oegendahl-taafraeser',
  'mick-oegendahl-micktricks': 'mick-oegendahl-micktrix',
};

export function resolveLegacyContentKey(
  contentKey: string,
  creatorSlug?: string,
): string {
  const creatorKey = slugify(creatorSlug ?? '', '').replace(/-/g, '');
  if (creatorKey !== 'microphoneentertainment') return contentKey;

  return MICROPHONE_SHOW_ALIASES[slugify(contentKey, '')] ?? contentKey;
}
