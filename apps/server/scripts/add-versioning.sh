#!/bin/bash

# Script to add API versioning to all controllers (macOS compatible)
# Usage: bash scripts/add-versioning.sh

set -e

CONTROLLERS_DIR="src/modules"

echo "🔧 Adding API versioning to all controllers..."

# Find all controller files
find "$CONTROLLERS_DIR" -name "*.controller.ts" -type f | while read -r controller; do
  echo "Processing: $controller"
  
  # Check if already versioned
  if grep -q "version:" "$controller"; then
    echo "  ✓ Already versioned"
    continue
  fi
  
  # Extract controller name using sed (macOS compatible)
  CONTROLLER_NAME=$(sed -n "s/.*@Controller('\([^']*\)').*/\1/p" "$controller")
  
  if [ -z "$CONTROLLER_NAME" ]; then
    echo "  ⚠ Could not extract controller name, skipping"
    continue
  fi
  
  echo "  📝 Updating @Controller('$CONTROLLER_NAME')..."
  
  # Replace @Controller('name') with versioned version
  sed -i '' "s/@Controller('$CONTROLLER_NAME')/@Controller({ path: '$CONTROLLER_NAME', version: '1' })/g" "$controller"
  
  # Add import for ApiVersion decorator if not present
  if ! grep -q "ApiVersion" "$controller"; then
    # Find the last import line and add after it
    LAST_IMPORT_LINE=$(grep -n "^import" "$controller" | tail -1 | cut -d: -f1)
    
    if [ -n "$LAST_IMPORT_LINE" ]; then
      sed -i '' "${LAST_IMPORT_LINE}a\\
import { ApiVersion } from '../../common/decorators/api-version.decorator';
" "$controller"
      echo "  ✓ Added ApiVersion import"
    fi
  fi
  
  echo "  ✓ Updated"
done

echo ""
echo "✅ API versioning added to all controllers!"
echo ""
echo "Next steps:"
echo "1. Test all endpoints"
echo "2. Verify versioning in responses"
echo "3. Update API documentation"
