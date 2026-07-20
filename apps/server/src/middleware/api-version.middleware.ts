import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import {
  API_VERSIONS,
  DEFAULT_API_VERSION,
  API_VERSION_HEADER,
} from '../config/api-versioning';

@Injectable()
export class ApiVersionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const version = this.extractVersion(req);

    // Set current version in response
    res.setHeader('X-API-Current-Version', DEFAULT_API_VERSION);

    // Add version info to response
    const versionConfig =
      API_VERSIONS[`v${version}` as keyof typeof API_VERSIONS];

    if (versionConfig) {
      // Add deprecation header if version has sunset date
      if (versionConfig.sunset) {
        res.setHeader('Sunset', versionConfig.sunset);
        res.setHeader('Deprecation', 'true');
      }

      // Add API version info
      res.setHeader(
        'X-API-Version-Info',
        JSON.stringify({
          version: versionConfig.version,
          status: versionConfig.status,
          released: versionConfig.released,
          sunset: versionConfig.sunset,
        }),
      );
    }

    next();
  }

  private extractVersion(req: Request): string {
    // Try to get version from URL path (/api/v1/, /api/v2/, etc.)
    const urlParts = req.url.split('/');
    const versionIndex = urlParts.indexOf('api') + 1;

    if (
      versionIndex < urlParts.length &&
      urlParts[versionIndex].startsWith('v')
    ) {
      return urlParts[versionIndex].substring(1);
    }

    // Try to get version from header
    const headerVersion = req.headers[
      API_VERSION_HEADER.toLowerCase()
    ] as string;
    if (headerVersion) {
      return headerVersion.replace('v', '');
    }

    // Default to v1
    return DEFAULT_API_VERSION;
  }
}
