/**
 * Token validation tool
 * Validates token usage in code and suggests improvements
 */

import { DesignToken } from '../optics-data.js';
import { extractAllValues, findMatchingToken, groupValuesByType, CSSValue } from '../utils/css-parser.js';

export interface ValidationIssue {
  type: 'hard-coded-value' | 'missing-token' | 'deprecated-token';
  value: string;
  line?: number;
  property?: string;
  suggestion?: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationReport {
  valid: boolean;
  issueCount: number;
  issues: ValidationIssue[];
  summary: {
    hardCodedValues: number;
    missingTokens: number;
    totalChecked: number;
  };
}

/**
 * Validate token usage in code
 */
export function validateTokenUsage(
  code: string,
  tokens: DesignToken[],
  context?: string
): ValidationReport {
  const issues: ValidationIssue[] = [];
  const extractedValues = extractAllValues(code);
  
  for (const value of extractedValues) {
    const matchingToken = findMatchingToken(value.value, tokens);
    
    if (!matchingToken) {
      issues.push({
        type: 'hard-coded-value',
        value: value.value,
        property: value.property,
        line: value.line,
        suggestion: suggestTokenForValue(value, tokens),
        severity: 'warning'
      });
    }
  }
  
  const hardCodedValues = issues.filter(i => i.type === 'hard-coded-value').length;
  
  return {
    valid: issues.length === 0,
    issueCount: issues.length,
    issues,
    summary: {
      hardCodedValues,
      missingTokens: 0,
      totalChecked: extractedValues.length
    }
  };
}

/**
 * Suggest appropriate token for a hard-coded value
 */
function suggestTokenForValue(value: CSSValue, tokens: DesignToken[]): string {
  const categoryTokens = tokens.filter(t => {
    if (value.type === 'color') return t.category === 'color';
    if (value.type === 'spacing') return t.category === 'spacing';
    if (value.type === 'font-size') return t.name.includes('font-size');
    if (value.type === 'font-weight') return t.name.includes('font-weight');
    if (value.type === 'border-radius') return t.category === 'border';
    if (value.type === 'shadow') return t.category === 'shadow';
    return false;
  });
  
  if (categoryTokens.length === 0) {
    return 'No matching tokens found';
  }
  
  // Find closest match
  const closest = categoryTokens[0];
  return `Consider using token: ${closest.name} (${closest.value})`;
}

/**
 * Generate validation report as formatted text
 */
export function formatValidationReport(report: ValidationReport): string {
  const lines: string[] = [
    '# Token Validation Report',
    '',
    `**Status**: ${report.valid ? '✓ Valid' : '✗ Issues Found'}`,
    `**Issues**: ${report.issueCount}`,
    `**Values Checked**: ${report.summary.totalChecked}`,
    ''
  ];
  
  if (report.issues.length > 0) {
    lines.push('## Issues');
    lines.push('');
    
    for (const issue of report.issues) {
      lines.push(`### ${issue.type}`);
      lines.push(`- **Value**: \`${issue.value}\``);
      if (issue.property) lines.push(`- **Property**: \`${issue.property}\``);
      if (issue.suggestion) lines.push(`- **Suggestion**: ${issue.suggestion}`);
      lines.push('');
    }
  } else {
    lines.push('✓ No issues found! All values use design tokens.');
  }
  
  return lines.join('\n');
}
