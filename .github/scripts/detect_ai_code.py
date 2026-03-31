#!/usr/bin/env python3
"""
🤖 Advanced AI Code Detection Script

This script analyzes code changes in pull requests to detect AI-generated content
using multiple detection methods including pattern matching, stylistic analysis,
and machine learning models.

Features:
- Multi-layer detection (patterns, style, ML)
- File-by-file and line-by-line analysis
- Confidence scoring and percentage calculation
- Support for multiple programming languages
- GitHub integration for PR analysis
"""

import os
import re
import ast
import sys
import json
import logging
import argparse
import subprocess
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass, asdict
from pathlib import Path
from collections import defaultdict, Counter

import numpy as np
import pandas as pd
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.ensemble import IsolationForest
    from sklearn.preprocessing import StandardScaler
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# GitHub integration
from github import Github
import requests

# Text analysis
import textstat
import jellyfish
from pygments import highlight
from pygments.lexers import get_lexer_by_name, get_lexer_for_filename
from pygments.util import ClassNotFound

# Rich console output
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table
from rich.panel import Panel

console = Console()

@dataclass
class AIDetectionResult:
    """Results of AI detection analysis"""
    file_path: str
    total_lines: int
    ai_lines: int
    ai_percentage: float
    confidence_score: float
    detection_methods: List[str]
    patterns_found: List[str]
    style_indicators: Dict[str, Any]
    language: str
    is_mixed: bool

@dataclass
class PRAnalysisResult:
    """Complete PR analysis results"""
    pr_number: int
    overall_ai_percentage: float
    confidence_score: float
    files_analyzed: int
    ai_files_count: int
    human_files_count: int
    mixed_files_count: int
    file_results: List[AIDetectionResult]
    summary: Dict[str, Any]
    timestamp: str

class AICodeDetector:
    """Advanced AI code detection system"""
    
    def __init__(self):
        self.console = console
        self.setup_logging()
        self.load_patterns()
        self.setup_ml_models()
        
    def setup_logging(self):
        """Configure logging"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('ai-analysis-debug.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def load_patterns(self):
        """Load AI detection patterns and signatures"""
        self.ai_patterns = {
            'comments': [
                # AI-typical comments
                r'(?i)(?:generated|created|written)\s+(?:by|with|using)\s+(?:ai|chatgpt|gpt|claude|copilot)',
                r'(?i)ai\s*[–-]\s*generated',
                r'(?i)auto[–-]?generated\s+(?:by|with|using)',
                r'(?i)(?:this|code)\s+(?:was\s+)?generated\s+(?:by|with|using)',
                # Placeholder comments typical of AI
                r'(?i)(?:add|implement|insert|place)\s+(?:your|the|additional|more)\s+(?:code|logic|functionality)',
                r'(?i)(?:todo|fixme|note):\s*(?:implement|add|complete|finish)',
                # AI disclaimer patterns
                r'(?i)(?:please\s+)?(?:note|remember):\s*(?:this|the)\s+(?:code|implementation)',
                r'(?i)(?:make\s+sure|ensure)\s+to\s+(?:test|validate|verify)',
            ],
            'code_style': [
                # AI-typical variable naming
                r'\b(?:temp|tmp|result|data|item|element|value)(?:\d+|[A-Z][a-z]*)*\b',
                # Excessive type annotations (TypeScript/Python)
                r':\s*(?:string|number|boolean|any|unknown)\[\]',
                # Over-documented obvious code
                r'\/\*\*[\s\S]*?\*\/\s*(?:const|let|var|function)',
                # AI-typical error handling
                r'(?i)throw\s+new\s+Error\s*\(\s*[\'"`](?:not\s+implemented|todo|placeholder)',
                # Generic exception messages
                r'(?i)catch\s*\([^)]*\)\s*\{[^}]*(?:console\.(?:error|log)|logger?\.(?:error|warn))',
            ],
            'structure': [
                # Extremely regular patterns
                r'(?:export\s+)?(?:const|function)\s+\w+\s*(?:\([^)]*\))?\s*(?::\s*\w+)?\s*=?\s*\{[^}]*\}',
                # Repetitive interface definitions
                r'interface\s+\w+\s*\{(?:\s*\w+:\s*\w+;)*\s*\}',
                # Over-abstraction patterns
                r'(?:abstract\s+)?class\s+\w+(?:Manager|Service|Handler|Processor|Controller)',
            ],
            'documentation': [
                # AI-typical JSDoc/documentation
                r'\/\*\*[\s\S]*?@(?:param|returns?|throws?|example)[\s\S]*?\*\/',
                # Generic descriptions
                r'(?i)(?:this\s+(?:function|method|class)|(?:function|method|class)\s+that)\s+(?:is\s+used\s+to|will|can)',
                # AI placeholder documentation
                r'(?i)(?:description|summary|overview):\s*(?:todo|tbd|placeholder)',
            ]
        }
        
        # Language-specific patterns
        self.language_patterns = {
            'typescript': [
                r'(?:export\s+)?(?:interface|type)\s+\w+\s*=',
                r'(?:const|let)\s+\w+:\s*(?:Promise<.*?>|Observable<.*?>)',
                r'(?:async\s+)?(?:function|\w+)\s*\([^)]*\):\s*Promise<.*?>',
            ],
            'python': [
                r'def\s+\w+\([^)]*\)\s*->\s*(?:Optional\[.*?\]|Union\[.*?\]|List\[.*?\])',
                r'(?:from\s+typing\s+import|import\s+typing)',
                r'@(?:dataclass|property|staticmethod|classmethod)',
            ],
            'javascript': [
                r'(?:const|let|var)\s+\w+\s*=\s*(?:require\(|import\()',
                r'module\.exports\s*=|export\s+(?:default\s+)?(?:class|function)',
                r'(?:async\s+)?function\s*\*?\s*\w*\s*\([^)]*\)',
            ]
        }
        
        # AI model signatures (common patterns in AI-generated code)
        self.ai_signatures = {
            'chatgpt': [
                'Certainly! Here',
                'Here\'s a',
                'This code',
                'The above',
                'Note that',
                'Make sure to',
                'Don\'t forget to',
                'You might want to',
                'Consider adding',
                'This implementation',
            ],
            'copilot': [
                '// TODO: Implement',
                '// FIXME:',
                '// NOTE:',
                '// Add your',
                '// Replace with',
                'throw new Error("Not implemented")',
                'console.log("TODO")',
            ],
            'claude': [
                'I\'ll help you',
                'Here\'s how you can',
                'This approach',
                'The key insight',
                'One important consideration',
                'You may also want to',
                'This solution',
            ]
        }
    
    def setup_ml_models(self):
        """Initialize machine learning models for detection"""
        if not SKLEARN_AVAILABLE:
            self.logger.warning("scikit-learn not available, ML features disabled")
            self.ml_models_ready = False
            return
            
        try:
            # TF-IDF for code style analysis
            self.tfidf_vectorizer = TfidfVectorizer(
                max_features=10000,
                ngram_range=(1, 3),
                token_pattern=r'\b\w+\b',
                stop_words=None  # Keep programming keywords
            )
            
            # Isolation Forest for anomaly detection
            self.isolation_forest = IsolationForest(
                contamination=0.1,
                random_state=42,
                n_estimators=100
            )
            
            # Scaler for feature normalization
            self.scaler = StandardScaler()
            
            self.ml_models_ready = True
            self.logger.info("ML models initialized successfully")
            
        except Exception as e:
            self.logger.warning(f"ML models initialization failed: {e}")
            self.ml_models_ready = False
    
    def get_file_language(self, file_path: str) -> str:
        """Detect programming language from file extension"""
        try:
            lexer = get_lexer_for_filename(file_path)
            return lexer.name.lower()
        except ClassNotFound:
            ext = Path(file_path).suffix.lower()
            language_map = {
                '.ts': 'typescript',
                '.tsx': 'typescript',
                '.js': 'javascript',
                '.jsx': 'javascript',
                '.py': 'python',
                '.java': 'java',
                '.go': 'go',
                '.rs': 'rust',
                '.cpp': 'cpp',
                '.c': 'c',
                '.sql': 'sql',
                '.md': 'markdown'
            }
            return language_map.get(ext, 'unknown')
    
    def analyze_code_patterns(self, content: str, language: str) -> Tuple[float, List[str]]:
        """Analyze code for AI-generated patterns"""
        patterns_found = []
        total_matches = 0
        
        # Check general AI patterns
        for category, patterns in self.ai_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, content, re.MULTILINE)
                if matches:
                    patterns_found.extend([f"{category}: {pattern[:50]}..." for _ in matches])
                    total_matches += len(matches)
        
        # Check language-specific patterns
        if language in self.language_patterns:
            for pattern in self.language_patterns[language]:
                matches = re.findall(pattern, content, re.MULTILINE)
                if matches:
                    patterns_found.extend([f"{language}: {pattern[:50]}..." for _ in matches])
                    total_matches += len(matches)
        
        # Check AI model signatures
        for model, signatures in self.ai_signatures.items():
            for signature in signatures:
                if signature in content:
                    patterns_found.append(f"{model}: {signature}")
                    total_matches += 1
        
        # Calculate pattern-based AI probability
        lines_count = len(content.split('\n'))
        pattern_density = total_matches / max(lines_count, 1)
        pattern_score = min(pattern_density * 100, 100)
        
        return pattern_score, patterns_found
    
    def analyze_code_style(self, content: str, language: str) -> Tuple[float, Dict[str, Any]]:
        """Analyze stylistic indicators of AI-generated code"""
        style_indicators = {}
        
        lines = content.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        
        # Basic metrics
        style_indicators['total_lines'] = len(lines)
        style_indicators['non_empty_lines'] = len(non_empty_lines)
        style_indicators['empty_line_ratio'] = (len(lines) - len(non_empty_lines)) / max(len(lines), 1)
        
        # Comment analysis
        comment_lines = []
        if language in ['javascript', 'typescript', 'java', 'cpp', 'c']:
            comment_lines = [line for line in lines if line.strip().startswith('//') or '/*' in line]
        elif language == 'python':
            comment_lines = [line for line in lines if line.strip().startswith('#')]
        
        style_indicators['comment_ratio'] = len(comment_lines) / max(len(non_empty_lines), 1)
        
        # Line length analysis
        if non_empty_lines:
            line_lengths = [len(line) for line in non_empty_lines]
            style_indicators['avg_line_length'] = np.mean(line_lengths)
            style_indicators['line_length_std'] = np.std(line_lengths)
            style_indicators['max_line_length'] = max(line_lengths)
        
        # Indentation consistency
        indentations = []
        for line in non_empty_lines:
            indent_count = len(line) - len(line.lstrip())
            if indent_count > 0:
                indentations.append(indent_count)
        
        if indentations:
            style_indicators['indent_consistency'] = len(set(indentations)) / len(indentations)
            style_indicators['avg_indentation'] = np.mean(indentations)
        
        # Readability metrics
        try:
            # Remove code-specific elements for readability analysis
            text_content = re.sub(r'[{}();,=\[\]]', ' ', content)
            text_content = re.sub(r'\b\d+\b', '', text_content)
            text_content = re.sub(r'\s+', ' ', text_content)
            
            if text_content.strip():
                style_indicators['flesch_score'] = textstat.flesch_reading_ease(text_content)
                style_indicators['complexity'] = textstat.flesch_kincaid_grade(text_content)
        except:
            pass
        
        # Variable naming analysis
        if language in ['javascript', 'typescript', 'python']:
            # Extract variable names
            var_pattern = r'\b(?:const|let|var|def)\s+([a-zA-Z_][a-zA-Z0-9_]*)'
            variables = re.findall(var_pattern, content)
            
            if variables:
                # Check for generic names typical of AI
                generic_names = ['temp', 'tmp', 'data', 'result', 'item', 'element', 'value', 'obj', 'arr']
                generic_count = sum(1 for var in variables if var.lower() in generic_names)
                style_indicators['generic_variable_ratio'] = generic_count / len(variables)
                
                # Average variable name length
                style_indicators['avg_variable_length'] = np.mean([len(var) for var in variables])
        
        # Calculate style-based AI probability
        ai_indicators = 0
        total_indicators = 0
        
        # High comment ratio (AI often over-comments)
        if style_indicators.get('comment_ratio', 0) > 0.3:
            ai_indicators += 1
        total_indicators += 1
        
        # Very consistent indentation (AI is often perfectly consistent)
        if style_indicators.get('indent_consistency', 1) < 0.1:
            ai_indicators += 1
        total_indicators += 1
        
        # Generic variable names
        if style_indicators.get('generic_variable_ratio', 0) > 0.4:
            ai_indicators += 1
        total_indicators += 1
        
        # Very regular line lengths
        if style_indicators.get('line_length_std', 100) < 20:
            ai_indicators += 1
        total_indicators += 1
        
        style_score = (ai_indicators / max(total_indicators, 1)) * 100
        
        return style_score, style_indicators
    
    def analyze_with_ml(self, content: str) -> float:
        """Use machine learning for AI detection"""
        if not self.ml_models_ready or not SKLEARN_AVAILABLE:
            return 0.0
        
        try:
            # Extract features
            features = []
            
            # Text-based features
            words = content.split()
            if words:
                # Lexical diversity
                unique_words = len(set(words))
                lexical_diversity = unique_words / len(words)
                features.append(lexical_diversity)
                
                # Average word length
                avg_word_length = np.mean([len(word) for word in words])
                features.append(avg_word_length)
                
                # Repetition patterns
                word_counts = Counter(words)
                most_common = word_counts.most_common(1)[0][1] if word_counts else 1
                repetition_ratio = most_common / len(words)
                features.append(repetition_ratio)
            else:
                features.extend([0.0, 0.0, 0.0])
            
            # Structural features
            lines = content.split('\n')
            features.append(len(lines))  # Total lines
            features.append(len([line for line in lines if line.strip()]))  # Non-empty lines
            
            # Pattern density
            total_patterns = 0
            for patterns in self.ai_patterns.values():
                for pattern in patterns:
                    total_patterns += len(re.findall(pattern, content, re.MULTILINE))
            
            pattern_density = total_patterns / max(len(lines), 1)
            features.append(pattern_density)
            
            # Convert to numpy array
            features_array = np.array(features).reshape(1, -1)
            
            # Normalize features
            features_normalized = self.scaler.fit_transform(features_array)
            
            # Use isolation forest for anomaly detection
            anomaly_score = self.isolation_forest.fit_predict(features_normalized)[0]
            
            # Convert anomaly score to probability (anomalies are potentially AI-generated)
            ml_score = 50 + (anomaly_score * -25)  # Convert -1/1 to 25-75 range
            
            return max(0, min(100, ml_score))
            
        except Exception as e:
            self.logger.warning(f"ML analysis failed: {e}")
            return 0.0
    
    def analyze_file(self, file_path: str, content: str) -> AIDetectionResult:
        """Perform complete AI detection analysis on a file"""
        language = self.get_file_language(file_path)
        
        # Pattern-based analysis
        pattern_score, patterns_found = self.analyze_code_patterns(content, language)
        
        # Style-based analysis
        style_score, style_indicators = self.analyze_code_style(content, language)
        
        # ML-based analysis
        ml_score = self.analyze_with_ml(content)
        
        # Combine scores with weights (adjust if ML not available)
        if ml_score > 0:
            weights = {'patterns': 0.4, 'style': 0.3, 'ml': 0.3}
            combined_score = (
                pattern_score * weights['patterns'] +
                style_score * weights['style'] +
                ml_score * weights['ml']
            )
        else:
            # No ML available, use pattern and style only
            weights = {'patterns': 0.6, 'style': 0.4}
            combined_score = (
                pattern_score * weights['patterns'] +
                style_score * weights['style']
            )
        
        # Calculate confidence based on agreement between methods
        if ml_score > 0:
            scores = [pattern_score, style_score, ml_score]
        else:
            scores = [pattern_score, style_score]
        
        if len(scores) > 1:
            score_variance = np.var(scores)
            confidence = max(0, min(100, 100 - score_variance))
        else:
            confidence = 50  # Default confidence for single method
        
        # Determine detection methods used
        detection_methods = []
        if pattern_score > 10:
            detection_methods.append('pattern_matching')
        if style_score > 10:
            detection_methods.append('style_analysis')
        if ml_score > 10 and SKLEARN_AVAILABLE:
            detection_methods.append('ml_analysis')
        
        # Line-by-line analysis for mixed files
        lines = content.split('\n')
        total_lines = len([line for line in lines if line.strip()])
        
        # Estimate AI lines based on pattern density and score
        ai_line_ratio = combined_score / 100
        ai_lines = int(total_lines * ai_line_ratio)
        
        # Determine if file is mixed (both AI and human code)
        is_mixed = 20 <= combined_score <= 80
        
        return AIDetectionResult(
            file_path=file_path,
            total_lines=total_lines,
            ai_lines=ai_lines,
            ai_percentage=combined_score,
            confidence_score=confidence,
            detection_methods=detection_methods,
            patterns_found=patterns_found[:10],  # Limit to top 10
            style_indicators=style_indicators,
            language=language,
            is_mixed=is_mixed
        )
    
    def analyze_pr_changes(self, pr_number: int, base_ref: str, head_ref: str, repo_path: str) -> PRAnalysisResult:
        """Analyze all changes in a pull request"""
        self.console.print(f"[bold blue]🔍 Analyzing PR #{pr_number}[/bold blue]")
        
        try:
            # Get changed files using git
            cmd = f"git diff --name-only {base_ref}..{head_ref}"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=repo_path)
            
            if result.returncode != 0:
                raise Exception(f"Git diff failed: {result.stderr}")
            
            changed_files = [f for f in result.stdout.strip().split('\n') if f]
            
            # Filter for relevant file types
            supported_extensions = {'.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.sql', '.md'}
            relevant_files = [f for f in changed_files if Path(f).suffix.lower() in supported_extensions]
            
            self.console.print(f"Found {len(relevant_files)} relevant files to analyze")
            
            file_results = []
            
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=self.console
            ) as progress:
                task = progress.add_task("Analyzing files...", total=len(relevant_files))
                
                for file_path in relevant_files:
                    full_path = Path(repo_path) / file_path
                    
                    if not full_path.exists():
                        continue
                    
                    try:
                        # Read file content
                        with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        
                        # Skip empty files
                        if not content.strip():
                            continue
                        
                        # Analyze file
                        result = self.analyze_file(file_path, content)
                        file_results.append(result)
                        
                        progress.update(task, advance=1)
                        
                    except Exception as e:
                        self.logger.warning(f"Failed to analyze {file_path}: {e}")
                        continue
            
            # Calculate overall statistics
            if file_results:
                total_lines = sum(r.total_lines for r in file_results)
                total_ai_lines = sum(r.ai_lines for r in file_results)
                overall_ai_percentage = (total_ai_lines / max(total_lines, 1)) * 100
                
                # Overall confidence is weighted average
                total_confidence = sum(r.confidence_score * r.total_lines for r in file_results)
                overall_confidence = total_confidence / max(total_lines, 1)
                
                # Categorize files
                ai_files = [r for r in file_results if r.ai_percentage >= 70]
                human_files = [r for r in file_results if r.ai_percentage < 20]
                mixed_files = [r for r in file_results if 20 <= r.ai_percentage < 70]
                
            else:
                overall_ai_percentage = 0
                overall_confidence = 0
                ai_files = human_files = mixed_files = []
            
            # Create summary
            all_patterns = [pattern for r in file_results for pattern in r.patterns_found]
            pattern_counts = Counter(all_patterns)
            
            summary = {
                'total_lines_analyzed': total_lines if file_results else 0,
                'ai_lines_detected': total_ai_lines if file_results else 0,
                'languages_analyzed': list(set(r.language for r in file_results)),
                'detection_methods_used': list(set(method for r in file_results for method in r.detection_methods)),
                'high_confidence_files': len([r for r in file_results if r.confidence_score >= 80]),
                'patterns_summary': dict(pattern_counts),  # Convert Counter to dict for JSON serialization
            }
            
            return PRAnalysisResult(
                pr_number=pr_number,
                overall_ai_percentage=overall_ai_percentage,
                confidence_score=overall_confidence,
                files_analyzed=len(file_results),
                ai_files_count=len(ai_files),
                human_files_count=len(human_files),
                mixed_files_count=len(mixed_files),
                file_results=file_results,
                summary=summary,
                timestamp=datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
            )
            
        except Exception as e:
            self.logger.error(f"PR analysis failed: {e}")
            raise

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="🤖 AI Code Detection Tool")
    parser.add_argument('--pr-number', type=int, required=True, help='Pull request number')
    parser.add_argument('--base-ref', required=True, help='Base commit SHA')
    parser.add_argument('--head-ref', required=True, help='Head commit SHA')
    parser.add_argument('--repo-path', default='.', help='Repository path')
    parser.add_argument('--output-format', choices=['json', 'yaml'], default='json')
    parser.add_argument('--detailed-analysis', action='store_true', help='Include detailed analysis')
    parser.add_argument('--output-file', default='ai-analysis-results.json', help='Output file path')
    
    args = parser.parse_args()
    
    # Initialize detector
    detector = AICodeDetector()
    
    try:
        # Analyze PR
        result = detector.analyze_pr_changes(
            args.pr_number,
            args.base_ref,
            args.head_ref,
            args.repo_path
        )
        
        # Display results
        console.print("\n[bold green]✅ Analysis Complete![/bold green]")
        
        # Create summary table
        table = Table(title="AI Detection Summary")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="magenta")
        
        table.add_row("Overall AI Percentage", f"{result.overall_ai_percentage:.1f}%")
        table.add_row("Confidence Score", f"{result.confidence_score:.1f}%")
        table.add_row("Files Analyzed", str(result.files_analyzed))
        table.add_row("AI-Generated Files", str(result.ai_files_count))
        table.add_row("Human-Written Files", str(result.human_files_count))
        table.add_row("Mixed Files", str(result.mixed_files_count))
        
        console.print(table)
        
        # Save results with manual serialization to avoid dataclass issues
        output_data = {
            'pr_number': result.pr_number,
            'overall_ai_percentage': float(result.overall_ai_percentage),
            'confidence_score': float(result.confidence_score), 
            'files_analyzed': result.files_analyzed,
            'ai_files_count': result.ai_files_count,
            'human_files_count': result.human_files_count,
            'mixed_files_count': result.mixed_files_count,
            'file_results': [
                {
                    'file_path': fr.file_path,
                    'total_lines': fr.total_lines,
                    'ai_lines': fr.ai_lines,
                    'ai_percentage': float(fr.ai_percentage),
                    'confidence_score': float(fr.confidence_score),
                    'detection_methods': list(fr.detection_methods),
                    'patterns_found': [str(p) for p in fr.patterns_found],
                    'style_indicators': {str(k): (float(v) if isinstance(v, (int, float)) else str(v)) for k, v in fr.style_indicators.items()},
                    'language': str(fr.language),
                    'is_mixed': bool(fr.is_mixed)
                } for fr in result.file_results
            ],
            'summary': {
                'total_lines_analyzed': result.summary.get('total_lines_analyzed', 0),
                'ai_lines_detected': result.summary.get('ai_lines_detected', 0),
                'languages_analyzed': list(result.summary.get('languages_analyzed', [])),
                'detection_methods_used': list(result.summary.get('detection_methods_used', [])),
                'high_confidence_files': result.summary.get('high_confidence_files', 0),
                'patterns_summary': dict(result.summary.get('patterns_summary', {}))
            },
            'timestamp': str(result.timestamp)
        }
        try:
            # Since we've manually created a clean dict, try direct serialization
            with open(args.output_file, 'w') as f:
                json.dump(output_data, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            console.print(f"[red]JSON serialization error: {e}[/red]")
            console.print("[yellow]Using string fallback...[/yellow]")
            
            # Fallback: convert everything to strings
            with open(args.output_file, 'w') as f:
                json.dump(output_data, f, indent=2, default=str)
        
        console.print(f"\n[bold blue]📁 Results saved to {args.output_file}[/bold blue]")
        
        # Exit with appropriate code
        if result.overall_ai_percentage >= 90:
            console.print("[bold red]⚠️ High AI involvement detected![/bold red]")
            sys.exit(2)
        elif result.overall_ai_percentage >= 70:
            console.print("[bold yellow]⚠️ Significant AI involvement detected[/bold yellow]")
            sys.exit(1)
        else:
            console.print("[bold green]✅ Analysis completed successfully[/bold green]")
            sys.exit(0)
            
    except Exception as e:
        console.print(f"[bold red]❌ Analysis failed: {e}[/bold red]")
        sys.exit(3)

if __name__ == '__main__':
    main()