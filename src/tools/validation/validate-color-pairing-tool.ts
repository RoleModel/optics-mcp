/**
 * Validate Color Pairing Tool
 * Checks if background/text color pairs follow Optics design system rules
 */

import { z } from 'zod';
import Tool, { type ToolInputSchema } from '../tool.js';
import { designTokens, type DesignToken } from '../../optics-data.js';
import { checkContrast, type ContrastResult } from '../../utils/color.js';
import { readToolFile } from '../../_internal/resource-path.js';

export interface ColorPairingResult {
  backgroundToken: string;
  textToken: string;
  backgroundValue: string;
  textValue: string;
  contrast: ContrastResult | null;
  isValidPairing: boolean;
  pairingRules: string[];
  recommendation?: string;
}

/**
 * Optics color pairing rules:
 * - Primary backgrounds should use white or light text
 * - Neutral backgrounds should use appropriate contrast text
 * - Danger/warning colors have specific pairing requirements
 * - Surface colors pair with content colors
 */
const COLOR_PAIRING_RULES: Record<string, string[]> = {
  'color-primary': ['color-white', 'color-neutral-100', 'color-neutral-200'],
  'color-danger': ['color-white', 'color-neutral-100'],
  'color-warning': ['color-neutral-900', 'color-neutral-800', 'color-black'],
  'color-success': ['color-white', 'color-neutral-100'],
  'color-info': ['color-white', 'color-neutral-100'],
  'color-neutral-900': ['color-white', 'color-neutral-100', 'color-neutral-200'],
  'color-neutral-800': ['color-white', 'color-neutral-100', 'color-neutral-200'],
  'color-neutral-100': ['color-neutral-900', 'color-neutral-800', 'color-black'],
  'color-neutral-200': ['color-neutral-900', 'color-neutral-800', 'color-black'],
  'color-white': ['color-neutral-900', 'color-neutral-800', 'color-neutral-700', 'color-black', 'color-primary'],
};

class ValidateColorPairingTool extends Tool {
  name = 'validate_color_pairing';
  title = 'Validate Color Pairing';
  description = 'Check if background/text color pairs follow Optics design system rules and meet WCAG contrast requirements';

  inputSchema = {
    backgroundToken: z.string().describe('Background color token name (e.g., "color-primary", "color-neutral-100")'),
    textToken: z.string().describe('Text/foreground color token name (e.g., "color-white", "color-neutral-900")'),
  };

  async handler(args: ToolInputSchema): Promise<string> {
    const { backgroundToken, textToken } = args;
    const result = this.validateColorPairing(backgroundToken, textToken, designTokens);
    const formatted = await this.formatResult(result);

    return formatted;
  }

  /**
   * Validate a color pairing
   */
  private validateColorPairing(
    backgroundToken: string,
    textToken: string,
    tokens: DesignToken[]
  ): ColorPairingResult {
    const bgToken = tokens.find(t => t.name === backgroundToken);
    const txtToken = tokens.find(t => t.name === textToken);

    if (!bgToken || !txtToken) {
      const missing = !bgToken ? backgroundToken : textToken;
      return {
        backgroundToken,
        textToken,
        backgroundValue: bgToken?.value || '',
        textValue: txtToken?.value || '',
        contrast: null,
        isValidPairing: false,
        pairingRules: [],
        recommendation: `Token "${missing}" not found. Use search_tokens to find available color tokens.`
      };
    }

    // Check contrast
    const contrast = checkContrast(txtToken.value, bgToken.value);

    // Check pairing rules
    const pairingRules = this.getPairingRules(backgroundToken, textToken);
    const followsRules = pairingRules.length > 0;

    // A valid pairing must have sufficient contrast AND follow design rules (if rules exist)
    const hasContrast = contrast ? contrast.wcagAA : false;
    const isValidPairing = hasContrast && (followsRules || !this.hasDefinedRules(backgroundToken));

    let recommendation: string | undefined;
    if (!isValidPairing) {
      recommendation = this.getRecommendation(backgroundToken, textToken, hasContrast, followsRules, tokens);
    }

    return {
      backgroundToken,
      textToken,
      backgroundValue: bgToken.value,
      textValue: txtToken.value,
      contrast,
      isValidPairing,
      pairingRules,
      recommendation
    };
  }

  /**
   * Get applicable pairing rules for a background color
   */
  private getPairingRules(backgroundToken: string, textToken: string): string[] {
    const rules: string[] = [];

    // Check direct rules
    for (const [bgPattern, allowedText] of Object.entries(COLOR_PAIRING_RULES)) {
      if (backgroundToken.includes(bgPattern) || backgroundToken === bgPattern) {
        if (allowedText.some(t => textToken.includes(t) || textToken === t)) {
          rules.push(`✓ "${textToken}" is a recommended pairing for "${bgPattern}" backgrounds`);
        }
      }
    }

    return rules;
  }

  /**
   * Check if background has defined pairing rules
   */
  private hasDefinedRules(backgroundToken: string): boolean {
    return Object.keys(COLOR_PAIRING_RULES).some(
      pattern => backgroundToken.includes(pattern) || backgroundToken === pattern
    );
  }

  /**
   * Get recommendation for invalid pairing
   */
  private getRecommendation(
    backgroundToken: string,
    textToken: string,
    hasContrast: boolean,
    followsRules: boolean,
    tokens: DesignToken[]
  ): string {
    const recommendations: string[] = [];

    if (!hasContrast) {
      recommendations.push('Contrast ratio is below WCAG AA requirements (4.5:1 for normal text).');
    }

    if (!followsRules && this.hasDefinedRules(backgroundToken)) {
      // Find recommended pairings
      for (const [bgPattern, allowedText] of Object.entries(COLOR_PAIRING_RULES)) {
        if (backgroundToken.includes(bgPattern) || backgroundToken === bgPattern) {
          recommendations.push(`Recommended text colors for this background: ${allowedText.join(', ')}`);
          break;
        }
      }
    }

    // Suggest alternatives with good contrast
    if (!hasContrast) {
      const alternatives = this.findContrastingTokens(backgroundToken, tokens);
      if (alternatives.length > 0) {
        recommendations.push(`Alternative tokens with sufficient contrast: ${alternatives.slice(0, 3).join(', ')}`);
      }
    }

    return recommendations.join('\n');
  }

  /**
   * Find tokens that have sufficient contrast with the background
   */
  private findContrastingTokens(backgroundToken: string, tokens: DesignToken[]): string[] {
    const bgToken = tokens.find(t => t.name === backgroundToken);
    if (!bgToken) return [];

    const contrasting: string[] = [];
    const colorTokens = tokens.filter(t => 
      t.category === 'color' && 
      !t.name.includes('-h') && 
      !t.name.includes('-s') && 
      !t.name.includes('-l') &&
      !t.name.includes('-original')
    );

    for (const token of colorTokens) {
      const contrast = checkContrast(token.value, bgToken.value);
      if (contrast && contrast.wcagAA) {
        contrasting.push(token.name);
      }
    }

    return contrasting;
  }

  /**
   * Format the validation result
   */
  private async formatResult(result: ColorPairingResult): Promise<string> {
    if (!result.contrast && result.recommendation) {
      const template = await readToolFile('validate-color-pairing-error.md');
      return template
        .replace('{{backgroundToken}}', result.backgroundToken)
        .replace('{{textToken}}', result.textToken)
        .replace('{{reason}}', 'Unable to calculate contrast. Tokens may not be valid color values.')
        .replace('{{suggestion}}', result.recommendation);
    }

    const template = await readToolFile('validate-color-pairing-result.md');
    
    const pairingRulesText = result.pairingRules.length > 0 
      ? result.pairingRules.join('\n') 
      : 'No specific pairing rules defined for this background color.';

    const resultText = result.isValidPairing
      ? '✓ **Valid Pairing** - This color combination meets contrast requirements and follows design guidelines.'
      : `✗ **Invalid Pairing** - ${result.recommendation || 'This combination does not meet requirements.'}`;

    return template
      .replace('{{backgroundToken}}', result.backgroundToken)
      .replace('{{backgroundValue}}', result.backgroundValue)
      .replace('{{textToken}}', result.textToken)
      .replace('{{textValue}}', result.textValue)
      .replace('{{contrastRatio}}', result.contrast?.ratio.toString() || 'N/A')
      .replace('{{wcagAA}}', result.contrast?.wcagAA ? '✓ Pass' : '✗ Fail')
      .replace('{{wcagAAA}}', result.contrast?.wcagAAA ? '✓ Pass' : '✗ Fail')
      .replace('{{pairingRules}}', pairingRulesText)
      .replace('{{result}}', resultText);
  }
}

export default ValidateColorPairingTool;
