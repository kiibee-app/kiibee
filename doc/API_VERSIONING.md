# API Versioning Guide

## Overview

Kiibee API uses URI-based versioning to ensure backward compatibility and allow for breaking changes without disrupting existing clients.

## Current Version

- **Current Version:** v1
- **API Base URL:** `http://localhost:4001/api/v1`
- **Status:** Stable

## Versioning Strategy

### URI Versioning (Primary)

API version is included in the URL path:

```
GET /api/v1/auth/user/profile
GET /api/v2/auth/user/profile  (future version)
```

### Version Header (Informational)

All responses include version information:

```
X-API-Current-Version: 1
X-API-Version-Info: {"version":"1","status":"current","released":"2026-01-01"}
```

## Supported Versions

| Version | Status  | Released   | Sunset | Description                          |
| ------- | ------- | ---------- | ------ | ------------------------------------ |
| v1      | Current | 2026-01-01 | -      | Current stable version               |
| v2      | Planned | -          | -      | Future version with breaking changes |

## Migration Path

### When v2 is Released

1. **Both v1 and v2 will be supported** during transition period
2. **Deprecation notices** will be added to v1 endpoints
3. **Sunset header** will indicate v1 end-of-life date
4. **Migration guide** will be provided

### Example Deprecation Headers

```
Sunset: 2027-01-01T23:59:59Z
Deprecation: true
X-API-Current-Version: 2
```

## Using API Versioning

### In Controllers

```typescript
import { Controller } from "@nestjs/common";
import { ApiVersion } from "../../common/decorators/api-version.decorator";

@Controller({ path: "auth", version: "1" })
export class AuthControllerV1 {
  // Version 1 endpoints
}

// Future version
@Controller({ path: "auth", version: "2" })
export class AuthControllerV2 {
  // Version 2 endpoints with breaking changes
}
```

### Marking Endpoints as Deprecated

```typescript
import { Get } from '@nestjs/common';
import { ApiDeprecated } from '../../common/decorators/api-version.decorator';

@Get('user/profile')
@ApiDeprecated('2027-01-01', 'Use /api/v2/auth/profile instead')
async getUserProfile() {
  // This endpoint will be removed on 2027-01-01
}
```

## API Endpoints by Version

### Version 1 (Current)

All current endpoints are version 1:

- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/payment/*` - Payment processing
- `/api/v1/order/*` - Order management
- `/api/v1/content/*` - Content management
- `/api/v1/creators/*` - Creator information
- `/api/v1/collection/*` - Collections
- `/api/v1/subscription/*` - Subscriptions
- `/api/v1/coupons/*` - Coupons
- `/api/v1/viewer/*` - Viewer endpoints
- `/api/v1/payout/*` - Payout processing
- `/api/v1/media/*` - Media management
- `/api/v1/support/*` - Support endpoints
- `/api/v1/feed/*` - Feed endpoints
- `/api/v1/export/*` - Export endpoints
- `/api/v1/tutorial-videos/*` - Tutorial videos
- `/api/v1/creator-users/*` - Creator-users management
- `/api/v1/creator-overview/*` - Creator overview analytics
- `/api/v1/notification-settings/*` - Notification settings

## Best Practices

### For Frontend Developers

1. **Always use versioned URLs**

   ```typescript
   // Good
   const response = await fetch("/api/v1/auth/login");

   // Bad - no version
   const response = await fetch("/api/auth/login");
   ```

2. **Check for deprecation headers**

   ```typescript
   const response = await fetch("/api/v1/auth/profile");
   const sunset = response.headers.get("Sunset");

   if (sunset) {
     console.warn(`API version will sunset on ${sunset}`);
     // Plan migration to newer version
   }
   ```

3. **Handle version errors gracefully**
   ```typescript
   if (response.status === 404 && response.url.includes("/v1/")) {
     // Version may be deprecated
     // Try fallback or show upgrade message
   }
   ```

### For Mobile App Developers

1. **Pin to specific API version**
   - Don't assume latest version
   - Test against specific version
   - Plan for version upgrades

2. **Implement version detection**

   ```typescript
   // Check API version on app startup
   const config = await fetch("/api/health");
   const apiVersion = config.headers.get("X-API-Current-Version");
   ```

3. **Force update when version sunsets**
   ```typescript
   if (sunsetDate && new Date(sunsetDate) < new Date()) {
     showUpdateRequiredModal();
   }
   ```

## Testing API Versions

### Using cURL

```bash
# Test v1 endpoint
curl -X GET http://localhost:4001/api/v1/auth/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check version headers
curl -I http://localhost:4001/api/v1/health
```

### Using Postman

1. Set base URL: `http://localhost:4001/api/v1`
2. Add version to all requests
3. Check response headers for version info

## Future Versions (v2+)

### Planned Breaking Changes for v2

1. **Authentication**
   - Token format changes
   - Refresh token rotation
   - Stricter CORS policies

2. **Response Format**
   - Standardized error responses
   - Pagination changes
   - Field naming conventions

3. **Payment Processing**
   - New payment provider integration
   - Different webhook format
   - Updated validation rules

### Version Timeline

- **Q1 2027:** v2 development starts
- **Q2 2027:** v2 beta release
- **Q3 2027:** v2 stable release
- **Q4 2027:** v1 sunset (6 months after v2 release)

## Monitoring and Alerts

### Metrics to Track

- API version usage by client
- Deprecated endpoint calls
- Version migration progress
- Error rates by version

### Alerts

- High error rate on specific version
- Sunset date approaching for version
- Unusual version usage patterns

## Support

### Getting Help

- **API Documentation:** http://localhost:4001/api/docs
- **Version Issues:** Create GitHub issue with label `api-versioning`
- **Migration Support:** Contact backend team

### Reporting Bugs

When reporting API versioning bugs, include:

- API version used
- Request URL
- Response headers (especially version headers)
- Expected vs actual behavior

---

**Last Updated:** 2026-07-20  
**Current API Version:** v1  
**Next Version:** v2 (planned)
