import { SetMetadata, applyDecorators } from '@nestjs/common';

export const API_VERSION_KEY = 'apiVersion';
export const API_DEPRECATED_KEY = 'apiDeprecated';
export const API_SUNSET_KEY = 'apiSunset';

export function ApiVersion(version: string) {
  return SetMetadata(API_VERSION_KEY, version);
}

export function ApiDeprecated(sunsetDate: string, message?: string) {
  return applyDecorators(
    SetMetadata(API_DEPRECATED_KEY, true),
    SetMetadata(API_SUNSET_KEY, sunsetDate),
  );
}
