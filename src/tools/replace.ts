/**
 * Token replacement tool
 * Replaces hard-coded values with design tokens
 */

import { DesignToken } from '../optics-data.js';
import { extractAllValues, findMatchingToken } from '../utils/css-parser.js';

export interface ReplacementSuggestion {
  original: string;
  replacement: string;
  tokenName: string;
  property?: string;
}

export interface ReplacementResult {
  originalCode: string;
  fixedCode: string;
  replacements: ReplacementSuggestion[];
  replacementCount: number;
}

/**
 * Replace hard-coded values with tokens
 */
export function replaceHardCodedValues(
  code: string,
  tokens: DesignToken[],
  autofix: boolean = false
): ReplacementResult {
  const extractedValues = extractAllValues(code);
  const replacements: ReplacementSuggestion[] = [];
  let fixedCode = code;
  
  for (const value of extractedValues) {
    const matchingToken = findMatchingToken(value.value, tokens);
    
    if (matchingToken) {
      const replacement = `var(--${matchingToken})`;
      replacements.push({
        original: value.value,
        replacement,
        tokenName: matchingToken,
        property: value.property
      });
      
      if (autofix) {
        fixedCode = fixedCode.replace(
          new RegExp(escapeRegex(value.value), 'g'),
          replacement
        );
      }
    }
  }
  
  return {
    originalCode: code,
    fixedCode: autofix ? fixedCode : code,
    replacements,
    replacementCount: replacements.length
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Format replacement suggestions
 */
export function formatReplacementSuggestions(result: ReplacementResult): string {
  const lines: string[] = [
    '# Token Replacement Suggestions',
    '',
    `**Replacements Found**: ${result.replacementCount}`,
    ''
  ];
  
  if (result.replacements.length > 0) {
    lines.push('## Suggested Replacements');
    lines.push('');
    
    for (const rep of result.replacements) {
      lines.push(`- Replace \`${rep.original}\` with \`${rep.replacement}\``);
      lines.push(`  Token: ${rep.tokenName}`);
      if (rep.property) lines.push(`  Property: ${rep.property}`);
      lines.push('');
    }
    
    if (result.fixedCode !== result.originalCode) {
      lines.push('## Fixed Code');
      lines.push('```css');
      lines.push(result.fixedCode);
      lines.push('```');
    }
  } else {
    lines.push('✓ No replacements needed!');
  }
  
  return lines.join('\n');
}
