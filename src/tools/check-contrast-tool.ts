/**
 * Check Contrast Tool
 * Validates WCAG contrast ratios for token combinations
 */

import { z } from 'zod';
import Tool from './tool.js';
import { designTokens, type DesignToken } from '../optics-data.js';
import { checkContrast, ContrastResult } from '../utils/color.js';
import { readToolFile } from '../_internal/resource-path.js';

export interface ContrastCheckResult {
  foregroundToken: string;
  backgroundToken: string;
  foregroundValue: string;
  backgroundValue: string;
  contrast: ContrastResult | null;
  passes: boolean;
  recommendation?: string;
}

class CheckContrastTool extends Tool {
  name = 'check_contrast';
  title = 'Check Contrast';
  description = 'Check WCAG contrast ratio between two color tokens';

  inputSchema = {
    foregroundToken: z.string().describe('Foreground color token name'),
    backgroundToken: z.string().describe('Background color token name'),
  };

  async handler(args: any): Promise<string> {
    const { foregroundToken, backgroundToken } = args;
    const result = this.checkTokenContrast(foregroundToken, backgroundToken, designTokens);
    const formatted = await this.formatContrastResult(result);

    return formatted;
  }

  /**
   * Check contrast between two tokens
   */
  private checkTokenContrast(
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
      recommendation = this.findBetterTokenCombination(fgToken, tokens, bgToken.value);
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
  private findBetterTokenCombination(
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
  private async formatContrastResult(result: ContrastCheckResult): Promise<string> {
    if (result.contrast) {
      const template = await readToolFile('check-contrast-result.md');
      let output = template
        .replace('{{foregroundToken}}', result.foregroundToken)
        .replace('{{foregroundValue}}', result.foregroundValue)
        .replace('{{backgroundToken}}', result.backgroundToken)
        .replace('{{backgroundValue}}', result.backgroundValue)
        .replace('{{contrastRatio}}', result.contrast.ratio.toString())
        .replace('{{wcagAA}}', result.contrast.wcagAA ? '✓ Pass' : '✗ Fail')
        .replace('{{wcagAAA}}', result.contrast.wcagAAA ? '✓ Pass' : '✗ Fail')
        .replace('{{score}}', result.contrast.score);

      if (!result.passes && result.recommendation) {
        output += '\n\n## Recommendation\n' + result.recommendation;
      }

      return output;
    } else {
      const template = await readToolFile('check-contrast-error.md');
      return template
        .replace('{{foregroundToken}}', result.foregroundToken)
        .replace('{{foregroundValue}}', result.foregroundValue)
        .replace('{{backgroundToken}}', result.backgroundToken)
        .replace('{{backgroundValue}}', result.backgroundValue)
        .replace('{{reason}}', result.recommendation || 'Unknown error');
    }
  }
}

export default CheckContrastTool;
