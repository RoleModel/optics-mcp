/**
 * Accessibility checker tool
 * Validates WCAG contrast ratios for token combinations
 */

import { DesignToken } from '../optics-data.js';
import { checkContrast, ContrastResult } from '../utils/color.js';

export interface ContrastCheckResult {
  foregroundToken: string;
  backgroundToken: string;
  foregroundValue: string;
  backgroundValue: string;
  contrast: ContrastResult | null;
  passes: boolean;
  recommendation?: string;
}

/**
 * Check contrast between two tokens
 */
export function checkTokenContrast(
  foregroundToken: string,
  backgroundToken: string,
  tokens: DesignToken[]
): ContrastCheckResult {
  const fgToken = tokens.find(t => t.name === foregroundToken);
  const bgToken = tokens.find(t => t.name === backgroundToken);
  
  if (!fgToken || !bgToken) {
    return {
      foregroundToken,
      backgroundToken,
      foregroundValue: '',
      backgroundValue: '',
      contrast: null,
      passes: false,
      recommendation: 'Token not found'
    };
  }
  
  const contrast = checkContrast(fgToken.value, bgToken.value);
  
  if (!contrast) {
    return {
      foregroundToken,
      backgroundToken,
      foregroundValue: fgToken.value,
      backgroundValue: bgToken.value,
      contrast: null,
      passes: false,
      recommendation: 'Unable to calculate contrast (non-color tokens?)'
    };
  }
  
  const passes = contrast.wcagAA;
  let recommendation = '';
  
  if (!passes) {
    recommendation = findBetterTokenCombination(fgToken, tokens, bgToken.value);
  }
  
  return {
    foregroundToken,
    backgroundToken,
    foregroundValue: fgToken.value,
    backgroundValue: bgToken.value,
    contrast,
    passes,
    recommendation
  };
}

/**
 * Find better token combination with sufficient contrast
 */
function findBetterTokenCombination(
  currentToken: DesignToken,
  allTokens: DesignToken[],
  backgroundValue: string
): string {
  const colorTokens = allTokens.filter(t => t.category === 'color');
  
  for (const token of colorTokens) {
    const contrast = checkContrast(token.value, backgroundValue);
    if (contrast && contrast.wcagAA) {
      return `Try using ${token.name} (${token.value}) for better contrast`;
    }
  }
  
  return 'No alternative tokens found with sufficient contrast';
}

/**
 * Format contrast check result
 */
export function formatContrastResult(result: ContrastCheckResult): string {
  const lines: string[] = [
    '# Contrast Check Result',
    '',
    `**Foreground**: ${result.foregroundToken} (\`${result.foregroundValue}\`)`,
    `**Background**: ${result.backgroundToken} (\`${result.backgroundValue}\`)`,
    ''
  ];
  
  if (result.contrast) {
    lines.push(`**Contrast Ratio**: ${result.contrast.ratio}:1`);
    lines.push(`**WCAG AA**: ${result.contrast.wcagAA ? '✓ Pass' : '✗ Fail'}`);
    lines.push(`**WCAG AAA**: ${result.contrast.wcagAAA ? '✓ Pass' : '✗ Fail'}`);
    lines.push(`**Score**: ${result.contrast.score}`);
    lines.push('');
    
    if (!result.passes && result.recommendation) {
      lines.push('## Recommendation');
      lines.push(result.recommendation);
    }
  } else {
    lines.push('✗ Unable to calculate contrast');
    if (result.recommendation) {
      lines.push(`**Reason**: ${result.recommendation}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Check all color token combinations for a given background
 */
export function checkAllCombinations(
  backgroundToken: string,
  tokens: DesignToken[]
): ContrastCheckResult[] {
  const bgToken = tokens.find(t => t.name === backgroundToken);
  if (!bgToken) return [];
  
  const colorTokens = tokens.filter(t => t.category === 'color' && t.name !== backgroundToken);
  const results: ContrastCheckResult[] = [];
  
  for (const fgToken of colorTokens) {
    results.push(checkTokenContrast(fgToken.name, backgroundToken, tokens));
  }
  
  return results.sort((a, b) => {
    if (!a.contrast || !b.contrast) return 0;
    return b.contrast.ratio - a.contrast.ratio;
  });
}
