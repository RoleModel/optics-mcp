/**
 * Theme generator tool
 * Generates complete theme with CSS variables and Figma Variables JSON
 * Uses actual Optics tokens, only customizing HSL color base values
 */

import { z } from 'zod';
import Tool, { type ToolInputSchema } from './tool.js';
import { designTokens, type DesignToken } from '../optics-data.js';
import { generateFigmaVariablesJSON } from '../utils/figma-tokens.js';
import { readToolFile } from '../_internal/resource-path.js';

interface BrandColors {
  primary?: string;        // Main brand color (hex) - converted to --op-color-primary-h/s/l
  neutral?: string;        // Neutral color (hex) - converted to --op-color-neutral-h/s/l
  'alerts-warning'?: string;  // Warning color (hex)
  'alerts-danger'?: string;   // Error color (hex)
  'alerts-info'?: string;     // Info color (hex)
  'alerts-notice'?: string;   // Success color (hex)
}

interface GeneratedTheme {
  cssVariables: string;
  figmaVariables: string;
  tokens: DesignToken[];
  documentation: string;
}

class GenerateThemeTool extends Tool {
  name = 'generate_theme'
  title = 'Generate Theme'
  description = 'Generate a complete theme with CSS variables and Figma Variables JSON using Optics design tokens'

  inputSchema = {
    brandName: z
      .string()
      .describe('The name of the brand/theme (e.g., "Acme Corp")'),
    primary: z
      .string()
      .describe('Primary brand color (hex, e.g., "#FF5733")'),
    neutral: z
      .string()
      .optional()
      .describe('Neutral color (hex, optional)')
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const brandColors: BrandColors = {
      primary: args.primary,
      neutral: args.neutral
    };
    const theme = await this.generateTheme(args.brandName, brandColors);

    // Load markdown template and replace placeholders
    let output = await readToolFile('generate-theme-output.md');

    output = output
      .replace('{{brandName}}', args.brandName)
      .replace('{{cssVariables}}', theme.cssVariables)
      .replace('{{figmaVariables}}', theme.figmaVariables)
      .replace('{{totalTokens}}', String(theme.tokens.length))
      .replace('{{colorTokens}}', String(theme.tokens.filter(t => t.category === 'color').length))
      .replace('{{typographyTokens}}', String(theme.tokens.filter(t => t.category === 'typography').length))
      .replace('{{spacingTokens}}', String(theme.tokens.filter(t => t.category === 'spacing').length))
      .replace('{{documentation}}', theme.documentation);

    return output;
  }

  /**
   * Optics color families that can be themed
   * Each accepts a hex color that will be converted to HSL base values
   */

  /**
   * Generate Optics HSL color tokens from brand colors
   * Each color family gets h/s/l base values that drive the scale system
   */
  private generateColorTokens(brandColors: BrandColors): DesignToken[] {
    const tokens: DesignToken[] = [];

    // Default Optics colors if not provided
    const defaults: BrandColors = {
      primary: '#2D6FDB',      // Optics default primary
      neutral: '#757882',      // Optics default neutral
      'alerts-warning': '#FFD93D',
      'alerts-danger': '#FF6B94',
      'alerts-info': '#2D6FDB',
      'alerts-notice': '#6ACF71'
    };

    const colors = { ...defaults, ...brandColors };

    // Generate HSL base values for each color family
    for (const [family, hex] of Object.entries(colors)) {
      if (!hex) continue;

      const hsl = this.hexToHSL(hex);
      const familyName = family === 'primary' || family === 'neutral' ? family : family;

      tokens.push({
        name: `op-color-${familyName}-h`,
        value: String(hsl.h),
        category: 'color',
        description: `${familyName} color hue (HSL) - drives all ${familyName} scale tokens`
      });

      tokens.push({
        name: `op-color-${familyName}-s`,
        value: `${hsl.s}%`,
        category: 'color',
        description: `${familyName} color saturation (HSL)`
      });

      tokens.push({
        name: `op-color-${familyName}-l`,
        value: `${hsl.l}%`,
        category: 'color',
        description: `${familyName} color lightness (HSL)`
      });
    }

    return tokens;
  }

  /**
   * Convert hex to HSL
   */
  private hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    hex = hex.replace('#', '');

    // Convert to RGB first
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Generate CSS variables from tokens using HSL for colors
   */
  private generateCSSVariables(tokens: DesignToken[], themeName: string = 'default'): string {
    const lines: string[] = [
      `/* ${themeName} Theme - Generated by Optics MCP */`,
      `/* HSL tokens for easy theming */`,
      `:root {`
    ];

    // Group tokens by category
    const grouped: Record<string, DesignToken[]> = {};
    tokens.forEach(token => {
      if (!grouped[token.category]) grouped[token.category] = [];
      grouped[token.category].push(token);
    });

    // Output color tokens - they're already in HSL format
    if (grouped['color']) {
      lines.push(`  /* Colors (HSL) */`);
      for (const token of grouped['color']) {
        // Tokens are already properly formatted (either HSL base values or full color values)
        lines.push(`  --${token.name}: ${token.value};`);
      }
      lines.push('');
    }

    // Output non-color tokens normally
    for (const [category, categoryTokens] of Object.entries(grouped)) {
      if (category === 'color') continue; // Already handled

      lines.push(`  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */`);
      for (const token of categoryTokens) {
        lines.push(`  --${token.name}: ${token.value};`);
      }
      lines.push('');
    }

    lines.push('}');

    return lines.join('\n');
  }

  /**
   * Generate theme documentation
   */
  private async generateDocumentation(themeName: string, tokens: DesignToken[]): Promise<string> {
    // Load documentation template
    let documentation = await readToolFile('generate-theme-instructions.md');

    // Generate token summary
    const stats = tokens.reduce((acc, token) => {
      acc[token.category] = (acc[token.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tokenSummary = Object.entries(stats)
      .map(([category, count]) => `- **${category}**: ${count} tokens`)
      .join('\n');

    // Generate token categories table
    const grouped: Record<string, DesignToken[]> = {};
    tokens.forEach(token => {
      if (!grouped[token.category]) grouped[token.category] = [];
      grouped[token.category].push(token);
    });

    const tokenCategories = Object.entries(grouped)
      .map(([category, categoryTokens]) => {
        const lines = [
          `### ${category.charAt(0).toUpperCase() + category.slice(1)}`,
          '',
          '| Token Name | Value | Description |',
          '|------------|-------|-------------|'
        ];

        for (const token of categoryTokens) {
          lines.push(`| \`${token.name}\` | \`${token.value}\` | ${token.description || ''} |`);
        }

        return lines.join('\n');
      })
      .join('\n\n');

    // Replace placeholders
    documentation = documentation
      .replace('{{themeName}}', themeName)
      .replace('{{tokenSummary}}', tokenSummary)
      .replace('{{tokenCategories}}', tokenCategories);

    return documentation;
  }

  /**
   * Main theme generation function
   * Uses all standard Optics tokens, only customizing the HSL color base values
   */
  private async generateTheme(brandName: string, brandColors: BrandColors): Promise<GeneratedTheme> {
    // Start with all standard Optics tokens
    let tokens: DesignToken[] = [...designTokens];

    // Override HSL color base values if custom colors provided
    if (Object.keys(brandColors).length > 0) {
      const customColorTokens = this.generateColorTokens(brandColors);

      // Replace the HSL base tokens with custom ones
      tokens = tokens.map(token => {
        const customToken = customColorTokens.find(ct => ct.name === token.name);
        return customToken || token;
      });
    }

    const cssVariables = this.generateCSSVariables(tokens, brandName);
    const figmaVariables = generateFigmaVariablesJSON(tokens, { collectionName: `${brandName} Design System` });
    const documentation = await this.generateDocumentation(brandName, tokens);

    return {
      cssVariables,
      figmaVariables,
      tokens,
      documentation
    };
  }
}

export default GenerateThemeTool;
