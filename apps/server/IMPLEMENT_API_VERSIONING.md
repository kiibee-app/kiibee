# API Versioning Implementation Guide

## ✅ What's Been Done

1. ✅ **Core Infrastructure** - Complete
   - Versioning enabled in `main.ts`
   - Version configuration created
   - API version middleware created
   - Version decorators created

2. ✅ **Example Controllers** - 3 done
   - `auth.controller.ts` - Updated with version: '1'
   - `payment.controller.ts` - Updated with version: '1'
   - `order.controller.ts` - Updated with version: '1'

## 📋 What Needs to Be Done

### Update Remaining 16 Controllers

You need to update the remaining 16 controllers with API versioning. Here's how:

### Method 1: Manual Update (Recommended for Safety)

For each controller file, make these two changes:

**Step 1:** Find the `@Controller` decorator

```typescript
// Before
@Controller('creators')
export class CreatorController {
```

**Step 2:** Add version parameter

```typescript
// After
@Controller({ path: 'creators', version: '1' })
export class CreatorController {
```

### Controllers to Update (16 remaining)

1. `src/modules/creator/creator.controller.ts`
2. `src/modules/notification-settings/notification-settings.controller.ts`
3. `src/modules/collection/collection.controller.ts`
4. `src/modules/content/content.controller.ts`
5. `src/modules/coupon/coupon.controller.ts`
6. `src/modules/subscription/subscription.controller.ts`
7. `src/modules/viewer/viewer.controller.ts`
8. `src/modules/support/support.controller.ts`
9. `src/modules/creator-overview/creator-overview.controller.ts`
10. `src/modules/feed/feed.controller.ts`
11. `src/modules/creator-users/creator-users.controller.ts`
12. `src/modules/export/export.controller.ts`
13. `src/modules/tutorial-videos/tutorial-videos.controller.ts`
14. `src/modules/payout/payout.controller.ts`
15. `src/modules/media/media.controller.ts`
16. `src/modules/health/health.controller.ts`

### Method 2: Automated Script (Use with Caution)

A sed command is provided below, but **test on one file first**:

```bash
# Navigate to server directory
cd apps/server

# Update ONE controller at a time (SAFER)
sed -i '' "s/@Controller('\([^']*\)')/@Controller({ path: '\1', version: '1' })/g" src/modules/creator/creator.controller.ts

# Verify it worked
grep "@Controller" src/modules/creator/creator.controller.ts

# If successful, repeat for other controllers
```

**⚠️ WARNING:** The automated script previously broke files. Use manual updates for safety.

## 🧪 Testing After Updates

After updating each controller:

1. **Build the server**

   ```bash
   npm run build
   ```

2. **Start the server**

   ```bash
   npm run start:dev
   ```

3. **Test the endpoint**

   ```bash
   # Should work with version
   curl http://localhost:4001/api/v1/auth/validate-token/test

   # Should NOT work without version
   curl http://localhost:4001/api/auth/validate-token/test
   ```

## 📝 Example: Complete Update

Here's a complete example of what an updated controller looks like:

```typescript
// src/modules/auth/auth.controller.ts

import {
  Body,
  Controller,
  Post,
  Get,
  // ... other imports
} from '@nestjs/common';

// Change this line:
// @Controller('auth')

// To this:
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('signup')
  async viewerSignUp(@Body() dto: ViewerSignUpDto, @Req() req: Request) {
    // ... implementation
  }

  // ... rest of the controller
}
```

## ✅ Verification Checklist

After updating all controllers:

- [ ] All 19 controllers have `version: '1'` in their `@Controller` decorator
- [ ] Server builds without errors: `npm run build`
- [ ] Server starts successfully: `npm run start:dev`
- [ ] Endpoints work with `/api/v1/` prefix
- [ ] Endpoints return 404 without version prefix
- [ ] Version headers present in responses
- [ ] Health check endpoint works

## 🚀 Final Steps

Once all controllers are updated:

1. **Run tests**

   ```bash
   npm run test:e2e
   ```

2. **Deploy to staging**
   - Test all endpoints
   - Verify version headers
   - Check for any 404 errors

3. **Update frontend**
   - Change API base URL from `/api` to `/api/v1`
   - Test all API calls

4. **Deploy to production**
   - Monitor error logs
   - Verify all endpoints working

## 🆘 Troubleshooting

### "Cannot find module" errors

Make sure imports are correct. The decorator change shouldn't affect imports.

### "404 Not Found" on endpoints

Check that you're using `/api/v1/` prefix in your requests.

### Build errors

Make sure the `@Controller` syntax is correct:

```typescript
@Controller({ path: 'name', version: '1' })  // ✅ Correct
@Controller({ path: 'name', version: 1 })    // ❌ Wrong - version must be string
```

## 📚 Additional Resources

- Main documentation: `API_VERSIONING.md`
- Quick reference: `API_VERSIONING_QUICK_REF.md`
- Version config: `src/config/api-versioning.ts`
- Issue: #2082

---

**Status:** 🟡 Partial Implementation - 3/19 controllers updated  
**Next:** Update remaining 16 controllers following this guide  
**Estimated Time:** 30-60 minutes for manual updates
