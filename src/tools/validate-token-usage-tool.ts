/**
 * Validate Token Usage Tool
 * Validates code for hard-coded values that should use design tokens
 */

import { z } from 'zod';
import Tool from './tool.js';
import { DesignToken, designTokens } from '../optics-data.js';
import { extractAllValues, findMatchingToken, CSSValue } from '../utils/css-parser.js';
import { readToolFile } from '../_internal/resource-path.js';

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

class ValidateTokenUsageTool extends Tool {
  name = 'validate_token_usage';
  title = 'Validate Token Usage';
  description = 'Validate code for hard-coded values that should use design tokens';

  inputSchema = {
    code: z.string().describe('CSS or component code to validate'),
  };

  async handler(args: any): Promise<string> {
    const report = this.validateTokenUsage(args.code, designTokens);
    const formatted = await this.formatValidationReport(report);

    return formatted;
  }

  /**
   * Validate token usage in code
   */
  private validateTokenUsage(
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
          suggestion: this.suggestTokenForValue(value, tokens),
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
  private suggestTokenForValue(value: CSSValue, tokens: DesignToken[]): string {
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
  private async formatValidationReport(report: ValidationReport): Promise<string> {
    if (report.issues.length === 0) {
      const template = await readToolFile('validate-token-usage-valid.md');
      return template.replace('{{totalChecked}}', report.summary.totalChecked.toString());
    }

    const template = await readToolFile('validate-token-usage-header.md');
    const status = report.valid ? '✓ Valid' : '✗ Issues Found';
    const lines: string[] = [
      template
        .replace('{{status}}', status)
        .replace('{{issueCount}}', report.issueCount.toString())
        .replace('{{totalChecked}}', report.summary.totalChecked.toString()),
      ''
    ];

    for (const issue of report.issues) {
      lines.push(`### ${issue.type}`);
      lines.push(`- **Value**: \`${issue.value}\``);
      if (issue.property) lines.push(`- **Property**: \`${issue.property}\``);
      if (issue.suggestion) lines.push(`- **Suggestion**: ${issue.suggestion}`);
      lines.push('');
    }

    return lines.join('\n');
  }
}

export default ValidateTokenUsageTool;
