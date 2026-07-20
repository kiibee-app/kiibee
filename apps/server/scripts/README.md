# API Versioning Scripts

This directory contains scripts to help add API versioning to controllers.

## Available Scripts

### 1. `add-versioning.js` (Recommended - Cross-Platform)

**Works on:** Windows, macOS, Linux

**Usage:**

```bash
# From the server directory
node scripts/add-versioning.js
```

**What it does:**

- Finds all `.controller.ts` files
- Updates `@Controller('name')` to `@Controller({ path: 'name', version: '1' })`
- Adds the `ApiVersion` import if not present
- Skips already versioned controllers

### 2. `add-versioning.sh` (Unix-only)

**Works on:** macOS, Linux (bash/zsh)

**Usage:**

```bash
# From the server directory
bash scripts/add-versioning.sh
```

**Note:** This script has issues on macOS with grep. Use the Node.js version instead.

### 3. `add-versioning.bat` (Windows-only)

**Works on:** Windows (Command Prompt)

**Usage:**

```cmd
REM From the server directory
scripts\add-versioning.bat
```

**Note:** This is a placeholder. Use the Node.js version instead for better reliability.

## Recommended Approach

**Use the Node.js script** (`add-versioning.js`) as it:

- ✅ Works on all platforms (Windows, macOS, Linux)
- ✅ More reliable than shell scripts
- ✅ Better error handling
- ✅ No dependency on grep/sed availability

## Before Running

1. Make sure you're in the `apps/server` directory
2. Ensure all controllers are in their original state (not partially updated)
3. Commit your current changes to git

## After Running

1. Build the project: `npm run build`
2. Fix any issues if they arise
3. Test the server: `npm run start:dev`
4. Verify endpoints work with `/api/v1/` prefix

## Manual Update (If Needed)

If the script fails, you can manually update controllers:

```typescript
// Before
import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
```

```typescript
// After
import { Controller } from '@nestjs/common';
import { ApiVersion } from '../../common/decorators/api-version.decorator';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
```

## Troubleshooting

### Script fails on Windows

Use the Node.js version: `node scripts/add-versioning.js`

### "Already versioned" message

The controller has already been updated. This is normal.

### Build errors after running script

Check the controller files for syntax errors. The script should not break valid TypeScript.

### Import not added correctly

Manually add the import:

```typescript
import { ApiVersion } from '../../common/decorators/api-version.decorator';
```

## Example Output

```
🔧 Adding API versioning to all controllers...

Found 19 controllers to update

Processing: src/modules/auth/auth.controller.ts
  ✓ Already versioned

Processing: src/modules/payment/payment.controller.ts
  ✓ Added ApiVersion import
  ✓ Updated @Controller('payment')

...

✅ API versioning added to all controllers!

Summary:
  - Updated: 16
  - Skipped (already versioned): 3
  - Total: 19
```

---

**Created:** 2026-07-20  
**Issue:** #2082  
**Status:** ✅ Complete
