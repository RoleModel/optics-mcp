/**
 * Token migration helper
 * Suggests token migrations for hard-coded values or deprecated tokens
 */

import { DesignToken } from '../optics-data.js';

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

/**
 * Suggest token migration for a hard-coded value
 */
export function suggestTokenMigration(
  oldValue: string,
  tokens: DesignToken[],
  category?: string
): MigrationSuggestion {
  const suggestions: MigrationSuggestion['suggestedTokens'] = [];
  
  const candidateTokens = category
    ? tokens.filter(t => t.category === category)
    : tokens;
  
  // Analyze the value type
  const valueType = detectValueType(oldValue);
  
  for (const token of candidateTokens) {
    const tokenType = detectValueType(token.value);
    
    if (valueType === tokenType) {
      const similarity = calculateSimilarity(oldValue, token.value, valueType);
      
      if (similarity > 0.5) {
        suggestions.push({
          tokenName: token.name,
          tokenValue: token.value,
          category: token.category,
          similarity,
          reason: generateMigrationReason(oldValue, token, similarity)
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
function detectValueType(value: string): string {
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
function calculateSimilarity(value1: string, value2: string, type: string): number {
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
function generateMigrationReason(oldValue: string, token: DesignToken, similarity: number): string {
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
export function formatMigrationSuggestions(suggestion: MigrationSuggestion): string {
  const lines: string[] = [
    '# Token Migration Suggestions',
    '',
    `**Input Value**: \`${suggestion.inputValue}\``,
    ''
  ];
  
  if (suggestion.suggestedTokens.length > 0) {
    lines.push('## Suggested Tokens');
    lines.push('');
    
    for (const token of suggestion.suggestedTokens) {
      lines.push(`### ${token.tokenName}`);
      lines.push(`- **Value**: \`${token.tokenValue}\``);
      lines.push(`- **Category**: ${token.category}`);
      lines.push(`- **Similarity**: ${Math.round(token.similarity * 100)}%`);
      lines.push(`- **Reason**: ${token.reason}`);
      lines.push('');
    }
  } else {
    lines.push('No suitable tokens found for this value.');
    lines.push('Consider adding a new token to your design system.');
  }
  
  return lines.join('\n');
}
