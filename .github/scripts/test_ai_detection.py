#!/usr/bin/env python3
"""
🧪 Test AI Detection Setup

Simple test script to validate that the AI detection system is working correctly.
"""

import sys
import json
import tempfile
from pathlib import Path

def create_test_files():
    """Create test files with different AI involvement levels"""
    test_files = {}
    
    # High AI involvement file (ChatGPT-style)
    high_ai_content = '''
// This code was generated using ChatGPT
export interface UserData {
  id: string;
  name: string;
  email: string;
}

// TODO: Implement validation logic
export function validateUser(userData: UserData): boolean {
  // Make sure to add proper validation
  if (!userData.id || !userData.name || !userData.email) {
    throw new Error("Not implemented");
  }
  return true;
}

// Here's how you can use this function
const result = validateUser(data);
'''
    
    # Low AI involvement file (human-written style)
    low_ai_content = '''
import { authenticateUser } from '../auth/middleware';
import { DatabaseConnection } from '../database/connection';

export class UserService {
  private db: DatabaseConnection;
  
  constructor(database: DatabaseConnection) {
    this.db = database;
  }
  
  async getUserById(userId: string) {
    const query = `
      SELECT u.id, u.name, u.email, u.created_at
      FROM users u 
      WHERE u.id = $1 AND u.is_active = true
    `;
    
    const result = await this.db.query(query, [userId]);
    return result.rows[0] || null;
  }
}
'''
    
    # Create temporary files
    with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
        f.write(high_ai_content)
        test_files['high_ai.ts'] = f.name
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.ts', delete=False) as f:
        f.write(low_ai_content)
        test_files['low_ai.ts'] = f.name
    
    return test_files

def test_detection():
    """Test the AI detection system"""
    print("🧪 Testing AI Detection System...")
    
    # Import the detector
    sys.path.append(str(Path(__file__).parent))
    from detect_ai_code import AICodeDetector
    
    detector = AICodeDetector()
    
    # Create test files
    test_files = create_test_files()
    
    results = []
    
    for file_type, file_path in test_files.items():
        with open(file_path, 'r') as f:
            content = f.read()
        
        result = detector.analyze_file(file_path, content)
        results.append((file_type, result))
        
        print(f"\n📁 {file_type}:")
        print(f"   AI Percentage: {result.ai_percentage:.1f}%")
        print(f"   Confidence: {result.confidence_score:.1f}%")
        print(f"   Methods: {', '.join(result.detection_methods)}")
        print(f"   Patterns: {len(result.patterns_found)}")
    
    # Validate results
    high_ai_result = next(r for name, r in results if 'high_ai' in name)
    low_ai_result = next(r for name, r in results if 'low_ai' in name)
    
    print(f"\n✅ Test Results:")
    
    success = True
    
    # High AI file should have higher percentage
    if high_ai_result.ai_percentage > low_ai_result.ai_percentage:
        print("   ✅ High AI file correctly identified as more AI-generated")
    else:
        print("   ❌ High AI file not identified correctly")
        success = False
    
    # High AI file should have patterns
    if len(high_ai_result.patterns_found) > 0:
        print("   ✅ AI patterns detected in high AI file")
    else:
        print("   ❌ No patterns detected in high AI file")
        success = False
    
    # Confidence should be reasonable
    if high_ai_result.confidence_score > 30:
        print("   ✅ Reasonable confidence scores")
    else:
        print("   ❌ Low confidence scores")
        success = False
    
    # Cleanup
    for file_path in test_files.values():
        Path(file_path).unlink(missing_ok=True)
    
    if success:
        print("\n🎉 All tests passed! AI detection system is working correctly.")
        return 0
    else:
        print("\n❌ Some tests failed. Please check the setup.")
        return 1

def test_requirements():
    """Test that all required packages are installed"""
    print("📦 Checking Python dependencies...")
    
    required_packages = [
        'numpy', 'pandas', 'textstat', 'pygments', 'rich', 'jinja2', 'requests'
    ]
    
    optional_packages = [
        'scikit-learn'  # Optional for ML features
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"   ✅ {package}")
        except ImportError:
            print(f"   ❌ {package} (missing)")
            missing_packages.append(package)
    
    # Check optional packages
    missing_optional = []
    for package in optional_packages:
        try:
            __import__(package)
            print(f"   ✅ {package} (optional)")
        except ImportError:
            print(f"   ⚠️ {package} (optional - ML features disabled)")
            missing_optional.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing required packages: {', '.join(missing_packages)}")
        print("   Install with: pip install -r .github/scripts/requirements.txt")
        return 1
    else:
        print("\n✅ All required packages are installed!")
        if missing_optional:
            print(f"ℹ️ Optional packages missing: {', '.join(missing_optional)} (ML features will be disabled)")
        return 0

def main():
    """Main test runner"""
    print("🚀 AI Detection System Test Suite")
    print("=" * 50)
    
    # Test requirements first
    if test_requirements() != 0:
        sys.exit(1)
    
    print("\n" + "=" * 50)
    
    # Test detection
    exit_code = test_detection()
    
    print("\n" + "=" * 50)
    print("🏁 Test suite completed!")
    
    sys.exit(exit_code)

if __name__ == '__main__':
    main()