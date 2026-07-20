#!/usr/bin/env node

/**
 * Script to add API versioning to all controllers
 * Works on Windows, macOS, and Linux
 *
 * Usage: node scripts/add-versioning.js
 */

const fs = require('fs');
const path = require('path');

const CONTROLLERS_DIR = path.join(__dirname, '..', 'src', 'modules');

console.log('🔧 Adding API versioning to all controllers...\n');

// Find all controller files
function findControllers(dir) {
  let controllers = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      controllers = controllers.concat(findControllers(filePath));
    } else if (file.endsWith('.controller.ts')) {
      controllers.push(filePath);
    }
  }

  return controllers;
}

const controllers = findControllers(CONTROLLERS_DIR);
console.log(`Found ${controllers.length} controllers to update\n`);

let updatedCount = 0;
let skippedCount = 0;

controllers.forEach((controllerPath) => {
  console.log(`Processing: ${path.relative(process.cwd(), controllerPath)}`);

  let content = fs.readFileSync(controllerPath, 'utf8');

  // Check if already versioned
  if (content.includes('version:')) {
    console.log('  ✓ Already versioned\n');
    skippedCount++;
    return;
  }

  // Find @Controller decorator
  const controllerMatch = content.match(/@Controller\('([^']+)'\)/);

  if (!controllerMatch) {
    console.log('  ⚠ Could not find @Controller decorator, skipping\n');
    return;
  }

  const controllerName = controllerMatch[1];
  const oldDecorator = `@Controller('${controllerName}')`;
  const newDecorator = `@Controller({ path: '${controllerName}', version: '1' })`;

  // Replace controller decorator
  content = content.replace(oldDecorator, newDecorator);

  // Add import for ApiVersion if not present
  if (!content.includes('ApiVersion')) {
    // Find last import statement
    const importLines = content
      .split('\n')
      .filter((line) => line.trim().startsWith('import '));
    if (importLines.length > 0) {
      const lastImport = importLines[importLines.length - 1];
      const importToAdd =
        "import { ApiVersion } from '../../common/decorators/api-version.decorator';";
      content = content.replace(lastImport, `${lastImport}\n${importToAdd}`);
      console.log('  ✓ Added ApiVersion import');
    }
  }

  // Write updated content
  fs.writeFileSync(controllerPath, content);
  console.log(`  ✓ Updated @Controller('${controllerName}')\n`);
  updatedCount++;
});

console.log('\n✅ API versioning added to all controllers!');
console.log(`\nSummary:`);
console.log(`  - Updated: ${updatedCount}`);
console.log(`  - Skipped (already versioned): ${skippedCount}`);
console.log(`  - Total: ${controllers.length}`);
console.log('\nNext steps:');
console.log('1. Test build: npm run build');
console.log('2. Start server: npm run start:dev');
console.log('3. Test endpoints with /api/v1/ prefix');
console.log('4. Verify versioning in responses');
