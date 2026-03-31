#!/usr/bin/env python3
"""
📊 AI Analysis Report Generator

Generates detailed reports from AI code detection analysis results.
Creates markdown reports with charts, tables, and insights.
"""

import json
import argparse
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any
from collections import Counter

import pandas as pd
from jinja2 import Template

def load_analysis_results(file_path: str) -> Dict[str, Any]:
    """Load analysis results from JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        raise Exception(f"Failed to load analysis results: {e}")

def create_file_summary_table(file_results: List[Dict]) -> str:
    """Create markdown table for file analysis summary"""
    if not file_results:
        return "No files analyzed."
    
    # Sort files by AI percentage (highest first)
    sorted_files = sorted(file_results, key=lambda x: x['ai_percentage'], reverse=True)
    
    table_rows = []
    table_rows.append("| File | Language | AI % | Confidence | Lines | Methods |")
    table_rows.append("|------|----------|------|------------|-------|---------|")
    
    for file_data in sorted_files:
        file_path = file_data['file_path']
        # Truncate long file paths
        if len(file_path) > 40:
            display_path = "..." + file_path[-37:]
        else:
            display_path = file_path
            
        language = file_data['language'].title()
        ai_pct = f"{file_data['ai_percentage']:.1f}%"
        confidence = f"{file_data['confidence_score']:.1f}%"
        lines = str(file_data['total_lines'])
        methods = ", ".join(file_data['detection_methods'])
        
        # Add color coding based on AI percentage
        if file_data['ai_percentage'] >= 80:
            ai_pct = f"🔴 {ai_pct}"
        elif file_data['ai_percentage'] >= 50:
            ai_pct = f"🟡 {ai_pct}"
        elif file_data['ai_percentage'] >= 20:
            ai_pct = f"🟠 {ai_pct}"
        else:
            ai_pct = f"🟢 {ai_pct}"
            
        table_rows.append(f"| `{display_path}` | {language} | {ai_pct} | {confidence} | {lines} | {methods} |")
    
    return "\n".join(table_rows)

def create_language_breakdown(file_results: List[Dict]) -> str:
    """Create language breakdown analysis"""
    if not file_results:
        return "No language data available."
    
    # Group by language
    lang_stats = {}
    for file_data in file_results:
        lang = file_data['language'].title()
        if lang not in lang_stats:
            lang_stats[lang] = {
                'files': 0,
                'total_lines': 0,
                'ai_lines': 0,
                'avg_ai_pct': 0,
                'avg_confidence': 0
            }
        
        stats = lang_stats[lang]
        stats['files'] += 1
        stats['total_lines'] += file_data['total_lines']
        stats['ai_lines'] += file_data['ai_lines']
        stats['avg_ai_pct'] += file_data['ai_percentage']
        stats['avg_confidence'] += file_data['confidence_score']
    
    # Calculate averages
    for lang, stats in lang_stats.items():
        stats['avg_ai_pct'] /= stats['files']
        stats['avg_confidence'] /= stats['files']
        stats['ai_percentage'] = (stats['ai_lines'] / max(stats['total_lines'], 1)) * 100
    
    # Sort by AI percentage
    sorted_langs = sorted(lang_stats.items(), key=lambda x: x[1]['ai_percentage'], reverse=True)
    
    table_rows = []
    table_rows.append("| Language | Files | Lines | AI Lines | AI % | Avg Confidence |")
    table_rows.append("|----------|-------|-------|----------|------|----------------|")
    
    for lang, stats in sorted_langs:
        ai_pct_display = f"{stats['ai_percentage']:.1f}%"
        
        # Color code by AI percentage
        if stats['ai_percentage'] >= 70:
            ai_pct_display = f"🔴 {ai_pct_display}"
        elif stats['ai_percentage'] >= 40:
            ai_pct_display = f"🟡 {ai_pct_display}"
        elif stats['ai_percentage'] >= 15:
            ai_pct_display = f"🟠 {ai_pct_display}"
        else:
            ai_pct_display = f"🟢 {ai_pct_display}"
        
        table_rows.append(
            f"| {lang} | {stats['files']} | {stats['total_lines']} | "
            f"{stats['ai_lines']} | {ai_pct_display} | {stats['avg_confidence']:.1f}% |"
        )
    
    return "\n".join(table_rows)

def create_pattern_analysis(file_results: List[Dict]) -> str:
    """Create analysis of detected patterns"""
    if not file_results:
        return "No pattern data available."
    
    # Collect all patterns
    all_patterns = []
    for file_data in file_results:
        all_patterns.extend(file_data.get('patterns_found', []))
    
    if not all_patterns:
        return "No AI patterns detected."
    
    # Count pattern frequencies
    pattern_counts = Counter(all_patterns)
    top_patterns = pattern_counts.most_common(10)
    
    result = []
    result.append("**Most Common AI Patterns Detected:**\n")
    
    for i, (pattern, count) in enumerate(top_patterns, 1):
        # Clean up pattern display
        if ': ' in pattern:
            category, pattern_text = pattern.split(': ', 1)
            if len(pattern_text) > 60:
                pattern_text = pattern_text[:57] + "..."
            display_pattern = f"**{category}**: `{pattern_text}`"
        else:
            display_pattern = f"`{pattern[:60]}{'...' if len(pattern) > 60 else ''}`"
            
        result.append(f"{i}. {display_pattern} (found {count}x)")
    
    return "\n".join(result)

def create_ai_insights(analysis_data: Dict[str, Any]) -> str:
    """Generate insights based on analysis results"""
    insights = []
    
    overall_pct = analysis_data['overall_ai_percentage']
    confidence = analysis_data['confidence_score']
    files_analyzed = analysis_data['files_analyzed']
    ai_files = analysis_data['ai_files_count']
    human_files = analysis_data['human_files_count']
    mixed_files = analysis_data['mixed_files_count']
    
    # Overall assessment
    if overall_pct >= 90:
        insights.append("🚨 **Critical**: This PR contains predominantly AI-generated code (>90%). Manual review highly recommended.")
    elif overall_pct >= 70:
        insights.append("⚠️ **High**: Significant AI involvement detected. Consider additional code review.")
    elif overall_pct >= 40:
        insights.append("📊 **Moderate**: Notable AI assistance detected. Standard review process recommended.")
    elif overall_pct >= 15:
        insights.append("✅ **Low**: Minimal AI involvement. Code appears mostly human-written.")
    else:
        insights.append("🎯 **Minimal**: Very low AI involvement detected.")
    
    # Confidence analysis
    if confidence >= 90:
        insights.append(f"🎯 **High Confidence**: Analysis confidence is very high ({confidence:.1f}%).")
    elif confidence >= 70:
        insights.append(f"👍 **Good Confidence**: Analysis confidence is good ({confidence:.1f}%).")
    elif confidence < 50:
        insights.append(f"⚠️ **Low Confidence**: Analysis confidence is low ({confidence:.1f}%). Results may be less reliable.")
    
    # File distribution insights
    if files_analyzed > 0:
        if ai_files > 0:
            ai_pct = (ai_files / files_analyzed) * 100
            insights.append(f"📁 **File Distribution**: {ai_files} files ({ai_pct:.0f}%) appear AI-generated, {human_files} human-written, {mixed_files} mixed.")
        
        if mixed_files > files_analyzed * 0.5:
            insights.append("🔀 **Mixed Content**: Many files contain both AI and human code - careful review recommended.")
    
    # Recommendations
    if overall_pct >= 80:
        insights.append("📋 **Recommendations**:")
        insights.append("   - Perform thorough manual code review")
        insights.append("   - Verify AI-generated code meets coding standards")
        insights.append("   - Test all functionality extensively")
        insights.append("   - Consider adding documentation for complex AI-generated sections")
    
    return "\n".join(insights)

def create_report_template() -> str:
    """Return the markdown report template"""
    return """# 🤖 AI Code Analysis Report

**Pull Request:** #{{ pr_number }}  
**Analysis Date:** {{ timestamp }}  
**Files Analyzed:** {{ files_analyzed }}  

---

## 📊 Summary

{{ summary_stats }}

---

## 🎯 AI Involvement Assessment

**Overall AI Percentage:** {{ overall_ai_percentage }}%  
**Confidence Score:** {{ confidence_score }}%

{{ ai_insights }}

---

## 📁 File Analysis

{{ file_summary_table }}

---

## 💻 Language Breakdown

{{ language_breakdown }}

---

## 🔍 Pattern Analysis

{{ pattern_analysis }}

---

## 📋 Technical Details

**Detection Methods Used:** {{ detection_methods }}  
**Languages Analyzed:** {{ languages_analyzed }}  
**Analysis Duration:** {{ analysis_date }}  

**Lines of Code:**
- Total Lines Analyzed: {{ total_lines }}
- AI-Generated Lines: {{ ai_lines }}
- Human-Written Lines: {{ human_lines }}

---

## ℹ️ About This Analysis

This report was generated by an automated AI code detection system that analyzes:
- **Pattern Matching**: Identifies common AI-generated code patterns and signatures
- **Style Analysis**: Examines coding style, variable naming, and structural patterns  
- **Machine Learning**: Uses statistical models to detect AI-generated content

---

*Generated by Foodime AI Detection System*"""

def generate_report(analysis_file: str, template_file: str = None, output_file: str = "ai-report.md"):
    """Generate comprehensive AI analysis report"""
    
    # Load analysis results
    analysis_data = load_analysis_results(analysis_file)
    
    # Load template
    if template_file and Path(template_file).exists():
        with open(template_file, 'r') as f:
            template_content = f.read()
    else:
        template_content = create_report_template()
    
    template = Template(template_content)
    
    # Prepare template variables
    file_results = analysis_data.get('file_results', [])
    summary_data = analysis_data.get('summary', {})
    
    # Create summary stats
    summary_stats = f"""
| Metric | Value |
|--------|-------|
| **Overall AI Percentage** | **{analysis_data['overall_ai_percentage']:.1f}%** |
| **Confidence Score** | {analysis_data['confidence_score']:.1f}% |
| **Files Analyzed** | {analysis_data['files_analyzed']} |
| **AI-Generated Files** | {analysis_data['ai_files_count']} |
| **Human-Written Files** | {analysis_data['human_files_count']} |
| **Mixed Files** | {analysis_data['mixed_files_count']} |
"""
    
    # Generate report sections
    template_vars = {
        'pr_number': analysis_data['pr_number'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC'),
        'files_analyzed': analysis_data['files_analyzed'],
        'overall_ai_percentage': f"{analysis_data['overall_ai_percentage']:.1f}",
        'confidence_score': f"{analysis_data['confidence_score']:.1f}",
        'summary_stats': summary_stats,
        'ai_insights': create_ai_insights(analysis_data),
        'file_summary_table': create_file_summary_table(file_results),
        'language_breakdown': create_language_breakdown(file_results),
        'pattern_analysis': create_pattern_analysis(file_results),
        'detection_methods': ', '.join(summary_data.get('detection_methods_used', [])),
        'languages_analyzed': ', '.join(summary_data.get('languages_analyzed', [])),
        'analysis_date': analysis_data.get('timestamp', 'Unknown'),
        'total_lines': summary_data.get('total_lines_analyzed', 0),
        'ai_lines': summary_data.get('ai_lines_detected', 0),
        'human_lines': summary_data.get('total_lines_analyzed', 0) - summary_data.get('ai_lines_detected', 0),
    }
    
    # Render template
    report_content = template.render(**template_vars)
    
    # Save report
    with open(output_file, 'w') as f:
        f.write(report_content)
    
    print(f"✅ Report generated: {output_file}")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="📊 Generate AI Analysis Report")
    parser.add_argument('--analysis-file', required=True, help='JSON file with analysis results')
    parser.add_argument('--template-file', help='Custom markdown template file')
    parser.add_argument('--output-file', default='ai-report.md', help='Output report file')
    
    args = parser.parse_args()
    
    try:
        generate_report(args.analysis_file, args.template_file, args.output_file)
        sys.exit(0)
    except Exception as e:
        print(f"❌ Report generation failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()