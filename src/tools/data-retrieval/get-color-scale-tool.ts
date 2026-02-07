/**
 * Get Color Scale Tool
 * Returns all tokens in a color family with pairing guidance
 */

import { z } from 'zod';
import Tool, { type ToolInputSchema } from '../tool.js';
import { designTokens, type DesignToken } from '../../optics-data.js';
import { readToolFile } from '../../_internal/resource-path.js';

/**
 * Color pairing rules for each color family
 */
const COLOR_PAIRING_GUIDANCE: Record<string, {
  backgrounds: string[];
  textColors: string[];
  notes: string;
}> = {
  primary: {
    backgrounds: ['color-primary-original', 'color-primary-plus-*', 'color-primary-minus-*'],
    textColors: ['color-primary-on-*', 'color-white', 'color-black'],
    notes: 'Primary colors should use matching "on" tokens for text. For example, if using --op-color-primary-plus-two as background, use --op-color-primary-on-plus-two for text.'
  },
  neutral: {
    backgrounds: ['color-neutral-plus-*', 'color-neutral-minus-*', 'color-background'],
    textColors: ['color-neutral-on-*', 'color-on-background'],
    notes: 'Neutral colors form the foundation of your UI. Always pair neutral backgrounds with their matching "on" tokens.'
  },
  'alerts-danger': {
    backgrounds: ['color-alerts-danger-original'],
    textColors: ['color-white', 'color-alerts-danger-on-*'],
    notes: 'Danger/error colors should be used sparingly. Ensure high contrast for accessibility.'
  },
  'alerts-warning': {
    backgrounds: ['color-alerts-warning-original'],
    textColors: ['color-black', 'color-neutral-900'],
    notes: 'Warning colors often need dark text due to their lighter nature.'
  },
  'alerts-info': {
    backgrounds: ['color-alerts-info-original'],
    textColors: ['color-white', 'color-alerts-info-on-*'],
    notes: 'Info colors are used for informational messages and highlights.'
  },
  'alerts-notice': {
    backgrounds: ['color-alerts-notice-original'],
    textColors: ['color-black', 'color-neutral-900'],
    notes: 'Notice/success colors indicate positive outcomes or confirmations.'
  }
};

class GetColorScaleTool extends Tool {
  name = 'get_color_scale';
  title = 'Get Color Scale';
  description = 'Get all tokens in a color family with pairing guidance';

  inputSchema = {
    colorFamily: z.string().describe('Color family name: "primary", "neutral", "alerts-danger", "alerts-warning", "alerts-info", "alerts-notice"'),
  };

  async handler(args: ToolInputSchema): Promise<string> {
    const { colorFamily } = args;
    const result = await this.getColorScale(colorFamily.toLowerCase());

    return result;
  }

  /**
   * Get all tokens for a color family
   */
  private async getColorScale(colorFamily: string): Promise<string> {
    // Find all tokens that belong to this color family
    const familyTokens = designTokens.filter(
      t => t.category === 'color' && t.name.startsWith(`color-${colorFamily}`)
    );

    if (familyTokens.length === 0) {
      const availableFamilies = this.getAvailableColorFamilies();
      return `# Color Family Not Found\n\nColor family "${colorFamily}" not found.\n\nAvailable color families:\n${availableFamilies.map(f => `- ${f}`).join('\n')}\n\nUse one of these family names to get the full color scale.`;
    }

    const template = await readToolFile('get-color-scale-result.md');

    // Extract HSL components
    const hueToken = familyTokens.find(t => t.name.endsWith('-h'));
    const satToken = familyTokens.find(t => t.name.endsWith('-s'));
    const lightToken = familyTokens.find(t => t.name.endsWith('-l'));

    // Build scale tokens list
    const scaleTokensText = this.formatScaleTokens(familyTokens);

    // Get pairing guidance
    const guidance = COLOR_PAIRING_GUIDANCE[colorFamily];
    const pairingText = guidance
      ? this.formatPairingGuidance(guidance)
      : 'No specific pairing guidance available. Follow the general rule: always pair background colors with their matching "on" text colors.';

    // Build usage examples
    const usageExamples = this.getUsageExamples(colorFamily, familyTokens);

    return template
      .replace('{{colorFamily}}', this.capitalize(colorFamily))
      .replace('{{hue}}', hueToken?.value || 'N/A')
      .replace('{{saturation}}', satToken?.value || 'N/A')
      .replace('{{lightness}}', lightToken?.value || 'N/A')
      .replace('{{scaleTokens}}', scaleTokensText)
      .replace('{{pairingGuidance}}', pairingText)
      .replace('{{usageExamples}}', usageExamples);
  }

  /**
   * Get available color families from tokens
   */
  private getAvailableColorFamilies(): string[] {
    const families = new Set<string>();
    
    for (const token of designTokens) {
      if (token.category === 'color' && token.name.startsWith('color-')) {
        // Extract family name (e.g., "primary" from "color-primary-h")
        const parts = token.name.replace('color-', '').split('-');
        if (parts.length >= 1) {
          // Handle compound names like "alerts-danger"
          if (parts[0] === 'alerts' && parts.length >= 2) {
            families.add(`alerts-${parts[1]}`);
          } else if (!['h', 's', 'l', 'original', 'on', 'plus', 'minus'].includes(parts[0])) {
            families.add(parts[0]);
          }
        }
      }
    }

    return Array.from(families).sort();
  }

  /**
   * Format scale tokens as a list
   */
  private formatScaleTokens(tokens: DesignToken[]): string {
    // Group tokens by type
    const hslTokens = tokens.filter(t => t.name.match(/-[hsl]$/));
    const scaleTokens = tokens.filter(t => t.name.match(/-(plus|minus)-\d+$/));
    const onTokens = tokens.filter(t => t.name.includes('-on-'));
    const otherTokens = tokens.filter(t => 
      !hslTokens.includes(t) && 
      !scaleTokens.includes(t) && 
      !onTokens.includes(t)
    );

    const lines: string[] = [];

    if (hslTokens.length > 0) {
      lines.push('### HSL Components');
      for (const token of hslTokens) {
        lines.push(`- \`${token.cssVar}\`: ${token.value}`);
      }
      lines.push('');
    }

    if (scaleTokens.length > 0) {
      lines.push('### Scale Variations');
      for (const token of scaleTokens.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(`- \`${token.cssVar}\`: ${token.value}`);
      }
      lines.push('');
    }

    if (onTokens.length > 0) {
      lines.push('### Text Colors (for pairing)');
      for (const token of onTokens.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(`- \`${token.cssVar}\`: ${token.value}`);
      }
      lines.push('');
    }

    if (otherTokens.length > 0) {
      lines.push('### Other Tokens');
      for (const token of otherTokens) {
        lines.push(`- \`${token.cssVar}\`: ${token.value}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Format pairing guidance
   */
  private formatPairingGuidance(guidance: { backgrounds: string[]; textColors: string[]; notes: string }): string {
    const lines: string[] = [
      '### Background Colors',
      ...guidance.backgrounds.map(b => `- \`--op-${b}\``),
      '',
      '### Recommended Text Colors',
      ...guidance.textColors.map(t => `- \`--op-${t}\``),
      '',
      '### Important Notes',
      guidance.notes
    ];

    return lines.join('\n');
  }

  /**
   * Get usage examples for the color family
   */
  private getUsageExamples(colorFamily: string, tokens: DesignToken[]): string {
    const examples: string[] = [];

    // Find a background and matching text token
    const bgToken = tokens.find(t => t.name.includes('original') || t.name.includes('plus'));
    const onToken = tokens.find(t => t.name.includes('-on-'));

    if (bgToken && onToken) {
      examples.push('```css');
      examples.push('.my-element {');
      examples.push(`  background-color: var(${bgToken.cssVar});`);
      examples.push(`  color: var(${onToken.cssVar});`);
      examples.push('}');
      examples.push('```');
    } else if (bgToken) {
      examples.push('```css');
      examples.push('.my-element {');
      examples.push(`  background-color: var(${bgToken.cssVar});`);
      examples.push(`  /* Always pair with matching "on" token for text */`);
      examples.push('}');
      examples.push('```');
    }

    return examples.length > 0 
      ? examples.join('\n')
      : 'No specific examples available.';
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default GetColorScaleTool;
