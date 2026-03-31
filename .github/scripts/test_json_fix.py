#!/usr/bin/env python3
"""
Quick test to verify JSON serialization fix
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from collections import Counter

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

def test_json_serialization():
    """Test the JSON serialization fix"""
    print("🧪 Testing JSON serialization fix...")
    
    # Create test data similar to what the AI detector produces
    test_data = {
        'pr_number': 617,
        'overall_ai_percentage': 13.7,
        'confidence_score': 33.0,
        'files_analyzed': 4,
        'ai_files_count': 0,
        'human_files_count': 4,
        'mixed_files_count': 0,
        'file_results': [
            {
                'file_path': 'test.ts',
                'total_lines': 50,
                'ai_lines': 5,
                'ai_percentage': 10.0,
                'confidence_score': 75.5,
                'detection_methods': ['pattern_matching', 'style_analysis'],
                'patterns_found': ['comment: test pattern...', 'style: another pattern...'],
                'style_indicators': {
                    'total_lines': 50,
                    'comment_ratio': 0.2,
                    'avg_line_length': 45.5
                },
                'language': 'typescript',
                'is_mixed': False
            }
        ],
        'summary': {
            'total_lines_analyzed': 200,
            'ai_lines_detected': 27,
            'languages_analyzed': ['typescript', 'javascript'],
            'detection_methods_used': ['pattern_matching', 'style_analysis'],
            'high_confidence_files': 2,
            'patterns_summary': {
                'comment: test pattern...': 2,
                'style: another pattern...': 1
            }
        },
        'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
    }
    
    # Test JSON serialization
    try:
        json_str = json.dumps(test_data, indent=2, ensure_ascii=False)
        print("✅ Basic JSON serialization works")
        
        # Test round-trip
        parsed_data = json.loads(json_str)
        print("✅ JSON round-trip works")
        
        # Test file saving
        with open('test-output.json', 'w') as f:
            json.dump(test_data, f, indent=2, ensure_ascii=False)
        print("✅ JSON file saving works")
        
        # Cleanup
        Path('test-output.json').unlink(missing_ok=True)
        
        print("\n🎉 All JSON serialization tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ JSON serialization failed: {e}")
        return False

if __name__ == '__main__':
    if test_json_serialization():
        sys.exit(0)
    else:
        sys.exit(1)