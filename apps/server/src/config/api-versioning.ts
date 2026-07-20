export const API_VERSIONS = {
  v1: {
    version: '1',
    released: '2026-01-01',
    sunset: null,
    status: 'current',
    description: 'Current stable API version',
  },
  v2: {
    version: '2',
    released: null,
    sunset: null,
    status: 'planned',
    description: 'Planned API version with breaking changes',
  },
} as const;

export const DEFAULT_API_VERSION = '1';

export const API_VERSION_HEADER = 'X-API-Version';

export type ApiVersion = keyof typeof API_VERSIONS;

export function isSupportedVersion(version: string): boolean {
  return version in API_VERSIONS;
}

export function getVersionConfig(version: string) {
  return API_VERSIONS[version as ApiVersion];
}
