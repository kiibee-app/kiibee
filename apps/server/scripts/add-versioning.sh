#!/bin/bash

# Script to add API versioning to all controllers
# Usage: ./scripts/add-versioning.sh

set -e

CONTROLLERS_DIR="src/modules"

echo "🔧 Adding API versioning to all controllers..."

# List of controllers to update
CONTROLLERS=$(find "$CONTROLLERS_DIR" -name "*.controller.ts" -type f)

for controller in $CONTROLLERS; do
  echo "Processing: $controller"
  
  # Check if already versioned
  if grep -q "version:" "$controller"; then
    echo "  ✓ Already versioned"
    continue
  fi
  
  # Extract controller name from @Controller decorator
  CONTROLLER_NAME=$(grep -oP "@Controller\('\K[^']+" "$controller" || echo "")
  
  if [ -z "$CONTROLLER_NAME" ]; then
    echo "  ⚠ Could not extract controller name, skipping"
    continue
  fi
  
  echo "  📝 Updating @Controller('$CONTROLLER_NAME')..."
  
  # Create backup
  cp "$controller" "${controller}.bak"
  
  # Replace @Controller('name') with versioned version
  sed -i "" "s/@Controller('$CONTROLLER_NAME')/@Controller({ path: '$CONTROLLER_NAME', version: '1' })/g" "$controller"
  
  # Add import for ApiVersion decorator if not present
  if ! grep -q "ApiVersion" "$controller"; then
    # Find the last import line
    LAST_IMPORT=$(grep -n "^import" "$controller" | tail -1 | cut -d: -f1)
    
    if [ -n "$LAST_IMPORT" ]; then
      # Add import after last import
      sed -i "" "${LAST_IMPORT}a\\
import { ApiVersion } from '../../common/decorators/api-version.decorator';
" "$controller"
    fi
  fi
  
  echo "  ✓ Updated"
  
  # Remove backup if successful
  rm "${controller}.bak"
done

echo ""
echo "✅ API versioning added to all controllers!"
echo ""
echo "Next steps:"
echo "1. Test all endpoints"
echo "2. Verify versioning in responses"
echo "3. Update API documentation"
