import { layoutEnumValues } from 'src/database/schema/enums';

export const LOGO_TYPE = {
  PICTURE: 'picture',
  TEXT: 'text',
} as const;

export type LogoType = (typeof LOGO_TYPE)[keyof typeof LOGO_TYPE];

export const DEFAULT_CONTENT_APPEARANCE_LAYOUT = layoutEnumValues[0];

export const CONTENT_APPEARANCE_DESCRIPTION_MAX_LENGTH = 500;

export const RECONCILIATION_SKIPPED_MESSAGE =
  'Content appearance reconciliation skipped (none missing)';

export const RECONCILIATION_COMPLETED_MESSAGE =
  'Content appearance reconciliation completed';

export const resolveFallbackLogoUrl = (
  channelLogoUrl?: string | null,
  avatarUrl?: string | null,
): string | null => channelLogoUrl?.trim() || avatarUrl?.trim() || null;

export const resolveLogoType = (logoUrl?: string | null): LogoType =>
  logoUrl ? LOGO_TYPE.PICTURE : LOGO_TYPE.TEXT;

export const resolveLogoName = (
  logoUrl: string | null | undefined,
  channelName?: string | null,
): string => (logoUrl ? '' : (channelName ?? ''));

export const truncateContentAppearanceDescription = (
  description?: string | null,
): string =>
  (description ?? '').slice(0, CONTENT_APPEARANCE_DESCRIPTION_MAX_LENGTH);
