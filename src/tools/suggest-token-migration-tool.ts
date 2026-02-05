/**
 * Suggest Token Migration Tool
 * Suggests token migrations for hard-coded values or deprecated tokens
 */

import { z } from 'zod';
import Tool from './tool.js';
import { designTokens, type DesignToken } from '../optics-data.js';
import { readToolFile } from '../_internal/resource-path.js';

export interface MigrationSuggestion {
  inputValue: string;
  suggestedTokens: Array<{
    tokenName: string;
    tokenValue: string;
    category: string;
    similarity: number;
    reason: string;
  }>;
}

class SuggestTokenMigrationTool extends Tool {
  name = 'suggest_token_migration';
  title = 'Suggest Token Migration';
  description = 'Suggest design tokens for a hard-coded value';

  inputSchema = {
    value: z.string().describe('Hard-coded value to find tokens for (e.g., "#0066CC", "16px")'),
    category: z.string().optional().describe('Optional category filter (color, spacing, typography)'),
  };

  async handler(args: any): Promise<string> {
    const { value, category } = args;
    const suggestion = this.suggestTokenMigration(value, designTokens, category);
    const formatted = await this.formatMigrationSuggestions(suggestion);

    return formatted;
  }

  /**
   * Suggest token migration for a hard-coded value
   */
  private suggestTokenMigration(
    oldValue: string,
    tokens: DesignToken[],
    category?: string
  ): MigrationSuggestion {
    const suggestions: MigrationSuggestion['suggestedTokens'] = [];

    const candidateTokens = category
      ? tokens.filter(t => t.category === category)
      : tokens;

    // Analyze the value type
    const valueType = this.detectValueType(oldValue);

    for (const token of candidateTokens) {
      const tokenType = this.detectValueType(token.value);

      if (valueType === tokenType) {
        const similarity = this.calculateSimilarity(oldValue, token.value, valueType);

        if (similarity > 0.5) {
          suggestions.push({
            tokenName: token.name,
            tokenValue: token.value,
            category: token.category,
            similarity,
            reason: this.generateMigrationReason(oldValue, token, similarity)
          });
        }
      }
    }

    // Sort by similarity
    suggestions.sort((a, b) => b.similarity - a.similarity);

    return {
      inputValue: oldValue,
      suggestedTokens: suggestions.slice(0, 5) // Top 5 suggestions
    };
  }

  /**
   * Detect value type (color, spacing, font-size, etc.)
   */
  private detectValueType(value: string): string {
    if (/^#[0-9a-fA-F]{3,6}$/.test(value) || /^rgba?\(/.test(value)) return 'color';
    if (/^\d+px$/.test(value)) return 'pixels';
    if (/^\d+rem$/.test(value)) return 'rem';
    if (/^\d+em$/.test(value)) return 'em';
    if (/^[34567]00$/.test(value)) return 'font-weight';
    if (/^\d+(\.\d+)?$/.test(value)) return 'number';
    if (/box-shadow|shadow/i.test(value)) return 'shadow';
    return 'string';
  }

  /**
   * Calculate similarity between values
   */
  private calculateSimilarity(value1: string, value2: string, type: string): number {
    if (type === 'color') {
      // Exact match for colors
      return value1.toLowerCase() === value2.toLowerCase() ? 1 : 0;
    }

    if (type === 'pixels' || type === 'rem' || type === 'em') {
      const num1 = parseFloat(value1);
      const num2 = parseFloat(value2);
      const diff = Math.abs(num1 - num2);
      const max = Math.max(num1, num2);
      return Math.max(0, 1 - (diff / max));
    }

    if (type === 'font-weight') {
      const num1 = parseInt(value1);
      const num2 = parseInt(value2);
      return num1 === num2 ? 1 : 0.5;
    }

    // String similarity (basic)
    return value1 === value2 ? 1 : 0.3;
  }

  /**
   * Generate migration reason
   */
  private generateMigrationReason(oldValue: string, token: DesignToken, similarity: number): string {
    if (similarity === 1) {
      return 'Exact match';
    }
    if (similarity > 0.9) {
      return 'Very close match';
    }
    if (similarity > 0.7) {
      return 'Close match';
    }
    return 'Similar value';
  }

  /**
   * Format migration suggestions
   */
  private async formatMigrationSuggestions(suggestion: MigrationSuggestion): Promise<string> {
    if (suggestion.suggestedTokens.length === 0) {
      const template = await readToolFile('suggest-token-migration-none.md');
      return template.replace('{{inputValue}}', suggestion.inputValue);
    }

    const template = await readToolFile('suggest-token-migration-header.md');
    const lines: string[] = [
      template.replace('{{inputValue}}', suggestion.inputValue),
      ''
    ];

    for (const token of suggestion.suggestedTokens) {
      lines.push(`### ${token.tokenName}`);
      lines.push(`- **Value**: \`${token.tokenValue}\``);
      lines.push(`- **Category**: ${token.category}`);
      lines.push(`- **Similarity**: ${Math.round(token.similarity * 100)}%`);
      lines.push(`- **Reason**: ${token.reason}`);
      lines.push('');
    }

    return lines.join('\n');
  }
}

export default SuggestTokenMigrationTool;
